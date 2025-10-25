from controllers.course import (
    get_course_details_controller,
    get_lesson_details_controller,
)
from db.database import get_supabase_client
from fastapi import APIRouter, Depends
from schemas.auth import UserResponse
from services.auth import get_student_user, validate_student_user
from supabase import Client

courses_router = APIRouter(
    prefix="/courses",
    tags=["Courses"],
)


@courses_router.get("/{course_id}")
async def get_course_details(
    course_id: int,
    supabase: Client = Depends(get_supabase_client),
    _: dict = Depends(validate_student_user),
):
    return await get_course_details_controller(course_id, supabase)


@courses_router.get("/lesson/{lesson_id}")
async def get_lesson_details(
    lesson_id: int,
    supabase: Client = Depends(get_supabase_client),
    student_user: UserResponse = Depends(get_student_user),
):
    return await get_lesson_details_controller(lesson_id, student_user, supabase)
