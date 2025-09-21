from controllers.auth import (
    login_user_controller,
    refresh_token_controller,
    register_user_controller,
)
from db.database import get_supabase_client
from fastapi import APIRouter, Depends
from schemas.auth import (
    RefreshTokenRequest,
    Token,
    UserLogin,
    UserRegister,
    UserResponse,
)
from services.auth import (
    get_current_user,
)
from supabase import Client

auth_router = APIRouter(
    prefix="/auth",
    tags=["Auth"],
)


# API Endpoints
@auth_router.post("/register", response_model=UserResponse)
async def register_user(
    user_data: UserRegister, supabase: Client = Depends(get_supabase_client)
):
    return await register_user_controller(user_data, supabase)


@auth_router.post("/login", response_model=Token)
async def login_user(
    user_credentials: UserLogin, supabase: Client = Depends(get_supabase_client)
):
    return await login_user_controller(user_credentials, supabase)


@auth_router.post("/refresh", response_model=Token)
async def refresh_token(
    refresh_request: RefreshTokenRequest,
    supabase: Client = Depends(get_supabase_client),
):
    return await refresh_token_controller(refresh_request, supabase)


@auth_router.get("/me", response_model=UserResponse)
async def get_current_user_info(current_user: dict = Depends(get_current_user)):
    return current_user
