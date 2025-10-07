from controllers.favorites import toggle_favorite_controller, get_favorites_controller
from db.database import get_supabase_client
from fastapi import APIRouter, Depends
from schemas.auth import (
    TokenData,
)
from services.auth import (
    validate_student_user,
)
from supabase import Client

favorites_router = APIRouter(
    prefix="/favorites",
    tags=["Favorites"],
)


@favorites_router.post("/{lesson_id}")
async def toggle_favorite(
    lesson_id: int,
    user: TokenData = Depends(validate_student_user),
    supabase: Client = Depends(get_supabase_client),
):
    return await toggle_favorite_controller(lesson_id, user, supabase)


@favorites_router.get("/")
async def get_favorites(
    user: TokenData = Depends(validate_student_user),
    supabase: Client = Depends(get_supabase_client),
):
    return await get_favorites_controller(user, supabase)
