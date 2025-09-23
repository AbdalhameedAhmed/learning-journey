from datetime import datetime, timedelta
from typing import Optional

from config import settings
from fastapi import HTTPException, status
import jwt
from schemas.auth import (
    RefreshTokenRequest,
    Token,
    TokenType,
    UserLogin,
    UserRegister,
)
from services.auth import (
    authenticate_user,
    get_session_by_refresh_token,
    get_user_by_email,
    get_user_by_id,
)
from supabase import Client
from utils.auth import create_token, get_password_hash


async def register_user_controller(user_data: UserRegister, supabase: Client):
    existing_user = await get_user_by_email(user_data.email, supabase)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered"
        )

    hashed_password = get_password_hash(user_data.password)

    try:
        response = (
            supabase.table("users")
            .insert(
                {
                    "first_name": user_data.first_name,
                    "last_name": user_data.last_name,
                    "email": user_data.email,
                    "password": hashed_password,
                    "role": user_data.role.value,
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


async def login_user_controller(user_credentials: UserLogin, supabase: Client):
    user = await authenticate_user(
        user_credentials.email, user_credentials.password, supabase
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

    return Token(access_token=access_token, refresh_token=refresh_token)


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
