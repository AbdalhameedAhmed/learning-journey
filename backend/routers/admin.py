from typing import Annotated

from controllers.admin import get_users_basic_info_and_exams_controller
from db.database import get_supabase_client
from fastapi import APIRouter, Depends, Header
from services.auth import validate_admin_user
from supabase import Client

admin_router = APIRouter(
    prefix="/admin",
    tags=["Admin"],
)


@admin_router.get("/progress")
async def get_users_progress(
    supabase: Client = Depends(get_supabase_client),
    # origin: Annotated[str | None, Header()] = None,
    _=Depends(validate_admin_user),
):
    origin="http://localhost:5173"
    return await get_users_basic_info_and_exams_controller(origin, supabase)
