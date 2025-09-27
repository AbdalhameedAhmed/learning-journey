from db.database import get_supabase_client
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials
from schemas.auth import (
    UserResponse,
    UserRole,
)
from supabase import Client
from utils.auth import decode_token, security, verify_password


async def get_user_by_email_and_role(email: str, role: UserRole, supabase: Client):
    try:
        response = (
            supabase.table("users")
            .select("*")
            .eq("email", email)
            .in_("role", [role.value, "admin"])
            .execute()
        )
        if response.data:
            return response.data[0]
        return None
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database error: {str(e)}",
        )


async def check_registration_eligibility(
    email: str, role: UserRole, supabase: Client
) -> bool:
    try:
        response = supabase.table("users").select("*").eq("email", email).execute()

        for existing_user_data in response.data:
            if existing_user_data["role"] == "admin":
                return False

            if existing_user_data["role"] == role.value:
                return False

        return True
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database error during registration check: {str(e)}",
        )


async def get_user_by_id(user_id: int, supabase: Client):
    try:
        response = supabase.table("users").select("*").eq("id", user_id).execute()
        if response.data:
            return response.data[0]
        return None
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database error: {str(e)}",
        )


async def get_session_by_refresh_token(refresh_token: str, supabase: Client):
    try:
        response = (
            supabase.table("sessions")
            .select("*")
            .eq("refresh_token", refresh_token)
            .execute()
        )
        if response.data:
            return response.data[0]
        return None
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database error: {str(e)}",
        )


async def authenticate_user(
    email: str, password: str, role: UserRole, supabase: Client
):
    user = await get_user_by_email_and_role(email, role, supabase)
    if not user:
        return False
    if not verify_password(password, user["password"]):
        return False

    user.pop("password")
    return user


def get_token_data(
    credentials: HTTPAuthorizationCredentials = Depends(security),
):
    token_data = decode_token(credentials.credentials)
    return token_data


async def get_current_user(
    token_data=Depends(get_token_data),
):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    supabase = get_supabase_client()

    user_dict = await get_user_by_id(user_id=token_data.user_id, supabase=supabase)
    if user_dict is None:
        raise credentials_exception

    try:
        user_response = UserResponse(**user_dict)
        return user_response
    except Exception:
        raise credentials_exception


async def validate_student_user(
    token_data=Depends(get_token_data),
):
    if token_data.role != UserRole.regular and token_data.role != UserRole.pro:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have permission to perform this action.",
        )
    return token_data


async def get_student_user(token_data=Depends(validate_student_user)):
    return await get_current_user(token_data=token_data)


async def validate_admin_user(
    token_data=Depends(get_token_data),
):
    if token_data.role != UserRole.admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have permission to perform this action.",
        )
    return token_data
