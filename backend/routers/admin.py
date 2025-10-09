from controllers.admin import (
    get_quiz_report_controller,
    get_users_basic_info_and_exams_controller,
    get_exam_report_controller,
)
from db.database import get_supabase_client
from fastapi import APIRouter, Depends
from services.auth import validate_admin_user
from supabase import Client

from schemas.exam import ExamType

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
    origin = "http://localhost:5173"
    return await get_users_basic_info_and_exams_controller(origin, supabase)


@admin_router.get("/quiz-report")
async def get_quiz_report(
    quiz_id: int,
    supabase: Client = Depends(get_supabase_client),
    # origin: Annotated[str | None, Header()] = None,
    # _=Depends(validate_admin_user),
):
    origin = "http://localhost:5173"
    return await get_quiz_report_controller(quiz_id, supabase, origin)


@admin_router.get("/exam-report")
async def get_exam_report(
    quiz_id: int,
    exam_type: ExamType,
    supabase: Client = Depends(get_supabase_client),
    # origin: Annotated[str | None, Header()] = None,
    # _=Depends(validate_admin_user),
):
    origin = "http://localhost:5173"
    return await get_exam_report_controller(quiz_id, exam_type, supabase, origin)
