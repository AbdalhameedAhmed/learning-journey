from typing import Optional
from datetime import datetime

from config import settings
from db.database import get_supabase_client
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials
from jose import JWTError, jwt
from schemas.auth import (
    TokenData,
)
from supabase import Client
from utils.auth import security, verify_password


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
    """Get session by refresh token from sessions table"""
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


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    supabase: Client = Depends(get_supabase_client),
):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        payload = jwt.decode(
            credentials.credentials,
            settings.JWT_SECRET_KEY,
            algorithms=[settings.JWT_ALGORITHM],
        )
        print(payload, "✨✨")
        email: Optional[str] = payload.get("sub")
        user_id: Optional[int] = payload.get("user_id")
        created_at: Optional[str] = payload.get("created_at")
        expires_at: Optional[str] = payload.get("expires_at")

        if email is None or user_id is None or created_at is None or expires_at is None:
            raise credentials_exception

        # Check if it's an access token
        if payload.get("type") != "access":
            raise credentials_exception

        if datetime.fromisoformat(expires_at) < datetime.now():
            raise credentials_exception

        token_data = TokenData(
            email=email,
            user_id=user_id,
            created_at=created_at,
            expires_at=expires_at,
        )
    except JWTError:
        raise credentials_exception

    user = await get_user_by_id(user_id=token_data.user_id, supabase=supabase)
    print(user, "😈")
    if user is None:
        raise credentials_exception
    return user
