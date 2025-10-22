from typing import Annotated

from fastapi import APIRouter, Depends, Header
from supabase import Client

from controllers.admin import (
    get_exam_report_controller,
    get_quiz_report_controller,
    get_users_basic_info_and_exams_controller,
)
from db.database import get_supabase_client
from schemas.exam import ExamType
from services.auth import validate_admin_user

admin_router = APIRouter(
    prefix="/admin",
    tags=["Admin"],
)


@admin_router.get("/progress")
async def get_users_progress(
    supabase: Client = Depends(get_supabase_client),
    origin: Annotated[str | None, Header()] = None,
    _=Depends(validate_admin_user),
):
    return await get_users_basic_info_and_exams_controller(origin, supabase)


@admin_router.get("/quiz-report")
async def get_quiz_report(
    quiz_id: int,
    supabase: Client = Depends(get_supabase_client),
    origin: Annotated[str | None, Header()] = None,
    _=Depends(validate_admin_user),
):
    return await get_quiz_report_controller(quiz_id, supabase, origin)


@admin_router.get("/exam-report")
async def get_exam_report(
    quiz_id: int,
    exam_type: ExamType,
    supabase: Client = Depends(get_supabase_client),
    origin: Annotated[str | None, Header()] = None,
    _=Depends(validate_admin_user),
):
    return await get_exam_report_controller(quiz_id, exam_type, supabase, origin)
