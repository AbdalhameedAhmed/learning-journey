from datetime import datetime, timedelta
from typing import Optional

import jwt
from utils.cloudinary import upload_image
from config import settings
from fastapi import HTTPException, UploadFile, status
from schemas.auth import (
    LoginResponse,
    RefreshTokenRequest,
    Token,
    TokenData,
    TokenType,
    UserLogin,
    UserRegister,
    UserResponse,
    UserRole,
)
from services.auth import (
    authenticate_user,
    check_registration_eligibility,
    get_session_by_refresh_token,
    get_user_by_id,
)
from supabase import Client
from utils.auth import create_token, create_user_progress, get_password_hash
from utils.get_role import get_role_via_origin


async def register_user_controller(
    user_data: UserRegister, origin: str | None, supabase: Client
):
    role = get_role_via_origin(origin)

    if role == UserRole.admin:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Can't register with admin account",
            headers={"WWW-Authenticate": "Bearer"},
        )

    is_registration_eligable = await check_registration_eligibility(
        user_data.email, role, supabase
    )
    if not is_registration_eligable:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="الايميل موجد مسبقا"
        )

    hashed_password = get_password_hash(user_data.password)

    progress_data = create_user_progress(role)

    try:
        response = (
            supabase.table("users")
            .insert(
                {
                    "first_name": user_data.first_name,
                    "last_name": user_data.last_name,
                    "email": user_data.email,
                    "password": hashed_password,
                    "role": role.value,
                    "current_progress_data": progress_data,
                }
            )
            .execute()
        )

        if not response.data:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to create user",
            )

        created_user = response.data[0]
        return created_user

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database error: {str(e)}",
        )


async def login_user_controller(
    user_credentials: UserLogin, origin: str | None, supabase: Client
):
    role = get_role_via_origin(origin)
    user = await authenticate_user(
        user_credentials.email,
        user_credentials.password,
        role,
        supabase,
    )
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Create timestamps
    now = datetime.now()

    access_token_expires = now + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    refresh_token_expires = now + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)

    # Create tokens with embedded info
    access_token = create_token(
        user_id=user["id"],
        email=user["email"],
        role=user["role"],
        created_at=now,
        expires_at=access_token_expires,
        type=TokenType.access,
    )

    refresh_token = create_token(
        user_id=user["id"],
        email=user["email"],
        role=user["role"],
        created_at=now,
        expires_at=refresh_token_expires,
        type=TokenType.refresh,
    )
    try:
        supabase.table("sessions").insert(
            {
                "refresh_token": refresh_token,
            }
        ).execute()
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create session: {str(e)}",
        )

    return LoginResponse(
        user=UserResponse(**user),
        tokens=Token(access_token=access_token, refresh_token=refresh_token),
    )


async def refresh_token_controller(
    refresh_request: RefreshTokenRequest, supabase: Client
):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid refresh token",
        headers={"WWW-Authenticate": "Bearer"},
    )

    session = await get_session_by_refresh_token(
        refresh_request.refresh_token, supabase
    )
    if not session:
        raise credentials_exception

    try:
        payload = jwt.decode(
            refresh_request.refresh_token,
            settings.JWT_SECRET_KEY,
            algorithms=[settings.JWT_ALGORITHM],
        )

        user_id: Optional[int] = payload.get("user_id")
        created_at_str: Optional[str] = payload.get("created_at")
        expires_at_str: Optional[int] = payload.get(
            "exp"
        )  # PyJWT decodes this to an int

        if not user_id or not created_at_str or not expires_at_str:
            raise credentials_exception

        if payload.get("type") != "refresh":
            raise credentials_exception

    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Refresh token has expired"
        )
    except jwt.InvalidTokenError:
        raise credentials_exception

    user = await get_user_by_id(user_id, supabase)
    if not user:
        raise credentials_exception

    now = datetime.now()
    access_token_expires = now + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)

    new_access_token = create_token(
        user_id=user_id,
        email=user["email"],
        role=user["role"],
        created_at=datetime.fromisoformat(created_at_str.replace("Z", "+00:00")),
        expires_at=access_token_expires,
        type=TokenType.access,
    )

    return Token(
        access_token=new_access_token, refresh_token=refresh_request.refresh_token
    )


async def logout_user_controller(refresh_token: str, supabase: Client):
    supabase.table("sessions").delete().eq("refresh_token", refresh_token).execute()

    return {"message": "Logout successful"}


async def update_profile_controller(
    first_name: str | None,
    last_name: str | None,
    profile_picture: UploadFile | None,
    current_user: TokenData,
    supabase: Client,
):
    user_id = current_user.user_id
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="User not authenticated."
        )

    update_data = {}

    # Update first_name if provided
    if first_name is not None:
        if not first_name.strip():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="First name cannot be empty.",
            )
        update_data["first_name"] = first_name.strip()

    # Update last_name if provided
    if last_name is not None:
        if not last_name.strip():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Last name cannot be empty.",
            )
        update_data["last_name"] = last_name.strip()

    # Handle profile picture upload to Cloudinary
    if profile_picture:
        try:
            # Upload new image to Cloudinary
            cloudinary_url = await upload_image(profile_picture)
            update_data["profile_picture"] = cloudinary_url

        except HTTPException:
            raise
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to process profile picture: {str(e)}",
            )

    # If no data to update, return error
    if not update_data:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No valid data provided for update.",
        )

    try:
        # Update user in Supabase
        response = (
            supabase.table("users").update(update_data).eq("id", user_id).execute()
        )

        if not response.data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="User not found."
            )

        updated_user = response.data[0]
        return {
            "message": "Profile updated successfully",
            "user": {
                "id": updated_user["id"],
                "first_name": updated_user["first_name"],
                "last_name": updated_user["last_name"],
                "profile_picture": updated_user.get("profile_picture"),
            },
        }

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update profile in database: {str(e)}",
        )
