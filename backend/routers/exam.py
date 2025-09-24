from fastapi import APIRouter, Depends
from supabase import Client

from controllers.exam import create_exam_controller, get_exam_controller
from db.database import get_supabase_client
from schemas.exam import PostExamRequest, GetExamResponse, PostExamResponse
from services.auth import validate_admin_user, validate_student_user

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


@exam_router.get("/{exam_id}", response_model=GetExamResponse)
async def get_exam_endpoint(
    exam_id: str,
    supabase: Client = Depends(get_supabase_client),
    _=Depends(validate_student_user),
):
    return await get_exam_controller(exam_id, supabase)
