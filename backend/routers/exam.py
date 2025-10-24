from controllers.exam import (
    create_exam_controller,
    get_exam_controller,
    submit_exam_controller,
)
from db.database import get_supabase_client
from fastapi import APIRouter, Depends, Query
from schemas.auth import UserResponse
from schemas.exam import (
    ExamSubmissionRequest,
    ExamType,
    PostExamRequest,
    PostExamResponse,
)
from services.auth import get_student_user, validate_admin_user
from supabase import Client

exam_router = APIRouter(
    prefix="/exam",
    tags=["Exam"],
)


@exam_router.post("/", response_model=PostExamResponse)
async def create_exam_endpoint(
    exam_data: PostExamRequest,
    supabase: Client = Depends(get_supabase_client),
):
    return await create_exam_controller(exam_data, supabase)


@exam_router.get("/{exam_id}")
async def get_exam_endpoint(
    exam_id: str,
    exam_type: ExamType = Query(),
    student_user: UserResponse = Depends(get_student_user),
):
    supabase = get_supabase_client()

    return await get_exam_controller(exam_id, exam_type, student_user, supabase)


@exam_router.post("/submit")
async def submit_exam_endpoint(
    submission_data: ExamSubmissionRequest,
    supabase: Client = Depends(get_supabase_client),
    student_user: UserResponse = Depends(get_student_user),
):
    user_id = student_user.id
    user_role = student_user.role
    user_progress = student_user.current_progress_data

    return await submit_exam_controller(
        submission_data=submission_data,
        user_id=user_id,
        user_role=user_role,
        user_progress=user_progress,
        supabase=supabase,
    )
