from controllers.exam import create_exam_controller, get_exam_controller
from db.database import get_supabase_client
from fastapi import APIRouter, Depends, Query
from schemas.auth import UserResponse
from schemas.exam import ExamType, PostExamRequest, PostExamResponse
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
    _=Depends(validate_admin_user),
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
