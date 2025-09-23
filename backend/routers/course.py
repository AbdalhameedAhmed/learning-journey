from db.database import get_supabase_client
from fastapi import APIRouter, Depends, HTTPException
from services.auth import get_current_user
from supabase import Client

courses_router = APIRouter(
    prefix="/courses",
    tags=["Courses"],
)


@courses_router.get("/{course_id}")
async def get_course_details(
    course_id: int,
    supabase: Client = Depends(get_supabase_client),
    _: dict = Depends(get_current_user),
):
    """
    Get course details by course ID.
    This includes modules, lessons for each module, and assets for each lesson.
    """
    query = (
        supabase.table("courses")
        .select("id, name, modules(id, name, lessons(id, name, assets(id, type, url)))")
        .eq("id", course_id)
        .single()
    )
    response = query.execute()

    if not response.data:
        raise HTTPException(status_code=404, detail="Course not found")

    return response.data
