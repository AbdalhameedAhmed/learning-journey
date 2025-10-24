from typing import Any, Dict

from fastapi import HTTPException
from schemas.auth import UserResponse, UserRole
from services.course import (
    get_lesson_by_id,
    get_lesson_with_validation,
    update_progress_after_lesson_completion,
)
from supabase import Client


async def get_course_details_controller(course_id: int, supabase: Client):
    query = (
        supabase.table("courses")
        .select(
            """
            id,
            name,
            exams (
                id,
                course_id,
                created_at
            ),
            modules (
                id,
                name,
                lessons (
                    id,
                    name,
                    activity_id
                ),
                quizzes: exams (
                    id,
                    module_id,
                    created_at
                )
            )
            """
        )
        .eq("id", course_id)
        .order("created_at", desc=True, foreign_table="modules.exams")
        .order("created_at", foreign_table="modules.lessons")
        .single()
    )

    response = query.execute()

    if not response.data:
        raise HTTPException(status_code=404, detail="Course not found")

    return response.data


async def get_lesson_details_controller(
    lesson_id: int, student_user: UserResponse, supabase: Client
) -> Dict[str, Any]:
    try:
        result = await get_lesson_with_validation(
            lesson_id=lesson_id,
            user_role=student_user.role,
            user_progress=student_user.current_progress_data,
            supabase=supabase,
        )

        activity_id = result["lesson"]["activity_id"]

        # If there's an error, return it immediately
        if "error" in result:
            return result

        # If lesson is successfully accessed, update user progress
        # Only update if this is a new lesson (not already completed)

        should_update_progress = await should_update_lesson_progress(
            lesson_id, student_user, supabase
        )

        if should_update_progress:
            update_result = await update_progress_after_lesson_completion(
                activity_id=activity_id,
                user_id=student_user.id,
                user_role=student_user.role,
                completed_lesson_id=lesson_id,
                supabase=supabase,
            )

            # Add progress update info to the response
            if "success" in update_result:
                result["progress_updated"] = True
                result["progress_message"] = "Progress updated successfully"
            else:
                result["progress_updated"] = False
                result["progress_message"] = "Progress update failed"

        return result

    except Exception as e:
        return {"error": f"Error in lesson controller: {str(e)}"}


async def should_update_lesson_progress(
    lesson_id: int,
    student_user: UserResponse,
    supabase: Client,
) -> bool:
    user_progress = student_user.current_progress_data
    completed_lessons = user_progress.get("completed_lessons", [])
    next_available_lesson_id = user_progress.get("next_available_lesson_id")
    next_available_module_id = user_progress.get("next_available_module_id")

    # Don't update if lesson is already completed
    if lesson_id in completed_lessons:
        return False

    # For regular users: update if this is the next available lesson
    if student_user.role == UserRole.regular:
        return lesson_id == next_available_lesson_id

    # For pro users: update if lesson belongs to current module and not completed
    elif student_user.role == UserRole.pro:
        # Get lesson details to check module_id
        lesson = await get_lesson_by_id(lesson_id, supabase)
        if not lesson:
            return False

        return lesson.get("module_id") == next_available_module_id

    return False
