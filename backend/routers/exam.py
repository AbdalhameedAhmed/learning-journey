from fastapi import APIRouter, Depends
from supabase import Client

from controllers.exam import create_exam_controller
from db.database import get_supabase_client
from schemas.exam import ExamRequest, ExamResponse
from services.auth import get_admin_user

exam_router = APIRouter(
    prefix="/exam",
    tags=["Exam"],
)


@exam_router.post("/", response_model=ExamResponse)
async def create_exam_endpoint(
    exam_data: ExamRequest,
    supabase: Client = Depends(get_supabase_client),
    _=Depends(get_admin_user),
):
    return await create_exam_controller(exam_data, supabase)
