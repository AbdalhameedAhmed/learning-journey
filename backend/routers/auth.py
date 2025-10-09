from typing import Annotated, Optional

from controllers.auth import (
    login_user_controller,
    logout_user_controller,
    refresh_token_controller,
    register_user_controller,
    update_profile_controller,
)
from db.database import get_supabase_client
from fastapi import APIRouter, Depends, File, Form, Header, UploadFile
from schemas.auth import (
    LoginResponse,
    RefreshTokenRequest,
    Token,
    TokenData,
    UserLogin,
    UserRegister,
    UserResponse,
)
from services.auth import get_current_user, get_token_data
from supabase import Client

auth_router = APIRouter(
    prefix="/auth",
    tags=["Auth"],
)


@auth_router.post("/register", response_model=UserResponse)
async def register_user(
    user_data: UserRegister,
    origin: Annotated[str | None, Header()] = None,
    supabase: Client = Depends(get_supabase_client),
):
    return await register_user_controller(user_data, origin, supabase)


@auth_router.post("/login", response_model=LoginResponse)
async def login_user(
    user_credentials: UserLogin,
    origin: Annotated[str | None, Header()] = None,
    supabase: Client = Depends(get_supabase_client),
):
    return await login_user_controller(user_credentials, origin, supabase)


@auth_router.post("/refresh", response_model=Token)
async def refresh_token(
    refresh_request: RefreshTokenRequest,
    supabase: Client = Depends(get_supabase_client),
):
    return await refresh_token_controller(refresh_request, supabase)


@auth_router.get("/me", response_model=UserResponse)
async def get_current_user_info(current_user: dict = Depends(get_current_user)):
    return current_user


@auth_router.post("/logout")
async def logout_user(
    request_body: RefreshTokenRequest, supabase: Client = Depends(get_supabase_client)
):
    return await logout_user_controller(request_body.refresh_token, supabase)


@auth_router.patch("/profile")
async def update_profile(
    first_name: Optional[str] = Form(None),
    last_name: Optional[str] = Form(None),
    profile_picture: Optional[UploadFile] = File(None),
    current_user: TokenData = Depends(get_token_data),
    supabase: Client = Depends(get_supabase_client),
):
    return await update_profile_controller(
        first_name, last_name, profile_picture, current_user, supabase
    )
