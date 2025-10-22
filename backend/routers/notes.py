from db.database import get_supabase_client
from fastapi import APIRouter, Depends
from schemas.notes import AddNote, NoteResponse
from services.auth import UserResponse, get_current_user
from supabase import Client

notes_router = APIRouter(
    prefix="/notes",
    tags=["Notes"],
)


@notes_router.get("/{lesson_id}", response_model=list[NoteResponse])
async def get_lesson_notes(
    lesson_id: int,
    supabase: Client = Depends(get_supabase_client),
    user: UserResponse = Depends(get_current_user),
):
    """
    Get notes for a specific lesson.
    """
    query = (
        supabase.table("notes")
        .select("*")
        .eq("lesson_id", lesson_id)
        .eq("user_id", user.id)
    )
    response = query.execute()

    return response.data


@notes_router.post("")
async def add_note(
    note_data: AddNote,
    supabase: Client = Depends(get_supabase_client),
    user: UserResponse = Depends(get_current_user),
):
    query = supabase.table("notes").insert(
        {**note_data.model_dump(), "user_id": user.id}
    )
    response = query.execute()

    return response.data


@notes_router.delete("/{note_id}")
async def delete_note(
    note_id: int,
    supabase: Client = Depends(get_supabase_client),
    user: UserResponse = Depends(get_current_user),
):
    query = supabase.table("notes").delete().eq("id", note_id).eq("user_id", user.id)
    response = query.execute()

    return response.data
