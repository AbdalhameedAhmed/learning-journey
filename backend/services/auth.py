from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials
from supabase import Client

from db.database import get_supabase_client
from schemas.auth import UserRole
from utils.auth import decode_token, security, verify_password


async def get_user_by_email(email: str, supabase: Client):
    try:
        response = supabase.table("users").select("*").eq("email", email).execute()
        if response.data:
            return response.data[0]
        return None
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database error: {str(e)}",
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


async def authenticate_user(email: str, password: str, supabase: Client):
    user = await get_user_by_email(email, supabase)
    if not user:
        return False
    if not verify_password(password, user["password"]):
        return False
    return user


def validate_token(
    credentials: HTTPAuthorizationCredentials = Depends(security),
):
    token_data = decode_token(credentials.credentials)
    return token_data


async def get_current_user(
    token_data=Depends(validate_token),
    supabase: Client = Depends(get_supabase_client),
):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    user = await get_user_by_id(user_id=token_data.user_id, supabase=supabase)
    if user is None:
        raise credentials_exception
    return user


async def get_admin_user(
    token_data=Depends(validate_token),
):
    if token_data.role != UserRole.admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have permission to perform this action.",
        )
    return token_data
