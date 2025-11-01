from typing import Any, Dict, List, Optional, Tuple

from schemas.auth import UserRole
from schemas.course import AssetResponse, LessonResponse
from supabase import Client
from utils.course_content import get_lesson_index, get_next_lesson_index

from services.auth import get_user_progress


async def get_lesson_by_id(
    lesson_id: int | None, supabase: Client
) -> Optional[Dict[str, Any]]:
    try:
        response = (
            supabase.table("lessons")
            .select("*, assets(id, type, url)")
            .eq("id", lesson_id)
            .execute()
        )
        return response.data[0] if response.data else None
    except Exception as e:
        raise Exception(f"Database error: {str(e)}")


async def get_first_lesson(supabase: Client) -> Optional[Dict[str, Any]]:
    try:
        response = (
            supabase.table("lessons").select("*").order("created_at").limit(1).execute()
        )
        return response.data[0] if response.data else None
    except Exception:
        return None


async def get_first_lesson_of_module(
    module_id: int, supabase: Client
) -> Optional[Dict[str, Any]]:
    try:
        response = (
            supabase.table("lessons")
            .select("*")
            .eq("module_id", module_id)
            .order("created_at")
            .limit(1)
            .execute()
        )
        return response.data[0] if response.data else None
    except Exception:
        return None


async def get_next_lesson(
    current_lesson_id: int | None, supabase: Client
) -> Optional[Dict[str, Any]]:
    try:
        current_lesson = await get_lesson_by_id(current_lesson_id, supabase)
        if not current_lesson:
            return None

        response = (
            supabase.table("lessons")
            .select("id")
            .gt("id", current_lesson_id)
            .order("id")
            .limit(1)
            .execute()
        )

        return response.data[0] if response.data else None
    except Exception:
        return None


async def check_pro_user_availability(
    lesson: Dict[str, Any], user_progress: Dict[str, Any]
) -> Tuple[bool, str]:
    next_available_module_id = user_progress.get("next_available_module_id")
    is_course_compleleted = user_progress.get("course_completed")
    completed_modules = user_progress.get("completed_modules", [])
    lesson_module_id = lesson.get("module_id")

    # If next_available_module_id is None, pre-exam not submitted
    if next_available_module_id is None and not is_course_compleleted:
        return False, "أكمل الاختبار القبلي للبدء في الكورس"
    # Lesson is available if it belongs to the next available module or completed modules
    if lesson_module_id in completed_modules:
        return True, "الدرس متاح - الوحدة مكتملة"

    if lesson_module_id == next_available_module_id:
        return True, "الدرس متاح - الوحدة الحالية"

    return False, "الدرس غير متاح. أكمل الوحدة الحالية أولاً."


async def check_regular_user_availability(
    lesson: Dict[str, Any], user_progress: Dict[str, Any]
) -> Tuple[bool, str]:
    next_available_lesson_id = user_progress.get("next_available_lesson_id")
    is_course_compleleted = user_progress.get("course_completed")
    completed_lessons = user_progress.get("completed_lessons", [])
    lesson_id = lesson["id"]

    # If next_available_lesson_id is None, pre-exam not submitted
    if next_available_lesson_id is None and not is_course_compleleted:
        return False, "أكمل الاختبار القبلي للبدء في الكورس"

    # Lesson is available if it's the next available lesson or already completed
    if lesson_id in completed_lessons:
        return True, "الدرس متاح - مكتمل مسبقاً"

    if lesson_id == next_available_lesson_id:
        return True, "الدرس متاح - الدرس الحالي"

    return False, "أكمل الدرس الحالي أولاً"


# async def is_lesson_available(
#     lesson: Dict[str, Any],
#     user_role: UserRole,
#     user_progress: Dict[str, Any],
# ) -> Tuple[bool, str]:
#     if user_role == UserRole.pro:
#         return await check_pro_user_availability(lesson, user_progress)
#     else:
#         return await check_regular_user_availability(lesson, user_progress)


async def is_lesson_available(
    lesson: Dict[str, Any],
    user_progress: Dict[str, Any],
) -> Tuple[bool, str]:
    current_progress = user_progress.get("current_progress")
    lesson_index = get_lesson_index(lesson["id"], "lesson")

    if lesson_index is None:
        return False, "الدرس غير موجود"

    if current_progress is None:
        return False, "أكمل الاختبار القبلي للبدء في الكورس"

    if lesson_index <= current_progress:
        return True, "الدرس متاح"
    else:
        return False, "الدرس غير متاح. أكمل الدروس السابقة أولاً."

    # if user_role == UserRole.pro:
    #     return await check_pro_user_availability(lesson, user_progress)
    # else:
    #     return await check_regular_user_availability(lesson, user_progress)


async def get_lesson_by_activity_id(activity_id: int, supabase: Client):
    try:
        response = (
            supabase.table("lessons")
            .select("id")
            .eq("activity_id", activity_id)
            .execute()
        )
        return response.data[0]["id"] if response.data else None
    except Exception:
        return None


async def is_last_activity_in_current_module(activity_id: int, supabase: Client):
    try:
        lesson_id = await get_lesson_by_activity_id(activity_id, supabase)

        if lesson_id is None:
            return {"lesson_id": lesson_id, "is_last": False}

        # Get the current lesson to find its module
        current_lesson = await get_lesson_by_id(lesson_id, supabase)
        if not current_lesson:
            return {"lesson_id": lesson_id, "is_last": False}

        module_id = current_lesson.get("module_id")
        if not module_id:
            return {"lesson_id": lesson_id, "is_last": False}

        # Get all lessons in this module ordered by creation
        response = (
            supabase.table("lessons")
            .select("id")
            .eq("module_id", module_id)
            .order("id")
            .execute()
        )

        if not response.data:
            return {"lesson_id": lesson_id, "is_last": False}

        lesson_ids = [lesson["id"] for lesson in response.data]

        # Check if this is the last lesson in the module
        if lesson_id == lesson_ids[-1]:
            return {"lesson_id": lesson_id, "is_last": True}
        else:
            return {"lesson_id": lesson_id, "is_last": False}

    except Exception:
        return {"lesson_id": None, "is_last": False}


async def get_exam_by_previous_lesson(
    lesson_id: int | None, supabase: Client
) -> Optional[int]:
    try:
        response = (
            supabase.table("exams")
            .select("id")
            .eq("previous_lesson", lesson_id)
            .execute()
        )

        return response.data[0]["id"] if response.data else None
    except Exception:
        return None


async def update_progress_after_lesson_completion(
    activity_id: int | None,
    user_id: int,
    user_role: UserRole,
    completed_lesson_id: int,
    supabase: Client,
    lesson_id: int,
) -> Dict[str, Any]:
    progress_data = await get_user_progress(user_id, supabase)
    # completed_lessons = progress_data.get("completed_lessons", [])

    # if user_role == UserRole.pro:
    #     # For PRO users, lessons within a module are freely accessible
    #     # Progress is mainly module-based
    #     if completed_lesson_id not in completed_lessons:
    #         completed_lessons.append(completed_lesson_id)
    #         progress_data["completed_lessons"] = completed_lessons

    # else:
    #     # For REGULAR users, linear progression
    #     if completed_lesson_id not in completed_lessons:
    #         completed_lessons.append(completed_lesson_id)
    #         progress_data["completed_lessons"] = completed_lessons

    #     # # Check if this is the last lesson in the current module
    #     # is_last_lesson_in_module = await is_last_lesson_in_current_module(
    #     #     completed_lesson_id, supabase
    #     # )

    #     # if is_last_lesson_in_module:
    #     #     # Don't update next_available_lesson_id
    #     #     # Set next_available_exam_id
    #     #     progress_data["next_available_exam_id"] = await get_exam_by_previous_lesson(
    #     #         completed_lesson_id, supabase
    #     #     )
    #     # TODO: Abdalhameed: (check the submission of activity)
    #     if activity_id:
    #         # in case the lesson has an activity
    #         progress_data["next_available_activity_id"] = activity_id
    #     else:
    #         # Normal progression - set next available lesson
    #         next_lesson_id = await get_next_lesson_id(completed_lesson_id, supabase)
    #         progress_data["next_available_lesson_id"] = next_lesson_id

    # update current_progress if this is a new lesson

    lesson_index = get_lesson_index(lesson_id, "lesson")
    next_lesson_index = get_next_lesson_index(lesson_id, "lesson")
    current_progress = progress_data.get("current_progress")

    if next_lesson_index is not None and lesson_index == current_progress:
        progress_data["current_progress"] = next_lesson_index

    # Save progress
    supabase.table("users").update({"current_progress_data": progress_data}).eq(
        "id", user_id
    ).execute()

    return {"success": True}


async def get_lesson_with_validation(
    lesson_id: int,
    user_role: UserRole,
    user_progress: Dict[str, Any],
    supabase: Client,
) -> Dict[str, Any]:
    try:
        # Get lesson details as dictionary from DB
        lesson_dict = await get_lesson_by_id(lesson_id, supabase)
        if not lesson_dict:
            return {"error": "الدرس غير موجود"}

        # Check if lesson is available
        is_available, message = await is_lesson_available(lesson_dict, user_progress)

        if not is_available:
            return {"error": message}

        # Convert assets to AssetResponse objects
        assets_data = lesson_dict.get("assets", [])
        assets = []
        for asset in assets_data:
            asset_response = AssetResponse(
                id=asset["id"], type=asset["type"], url=asset["url"]
            )
            assets.append(asset_response)

        # Convert to LessonResponse for final response
        lesson_obj = LessonResponse(
            id=lesson_dict["id"],
            name=lesson_dict["name"],
            module_id=lesson_dict["module_id"],
            assets=assets,
            created_at=lesson_dict["created_at"],
            activity_id=lesson_dict["activity_id"],
        )

        # Return lesson data
        return {"lesson": lesson_obj.model_dump(), "message": message}

    except Exception as e:
        return {"error": f"Error retrieving lesson: {str(e)}"}


async def is_module_completed(
    module_id: int, completed_lessons: List[int], supabase: Client
) -> bool:
    try:
        response = (
            supabase.table("lessons").select("id").eq("module_id", module_id).execute()
        )

        module_lesson_ids = (
            [lesson["id"] for lesson in response.data] if response.data else []
        )

        # Check if all module lessons are in completed_lessons
        return all(lesson_id in completed_lessons for lesson_id in module_lesson_ids)

    except Exception:
        return False


async def get_next_lesson_id(
    current_lesson_id: int | None, supabase: Client
) -> Optional[int]:
    try:
        next_lesson = await get_next_lesson(current_lesson_id, supabase)
        return next_lesson["id"] if next_lesson else None
    except Exception:
        return None


async def get_first_exam_for_module(module_id: int, supabase: Client) -> Optional[int]:
    try:
        response = (
            supabase.table("exams")
            .select("id")
            .eq("module_id", module_id)
            .order("created_at")
            .limit(1)
            .execute()
        )

        return response.data[0]["id"] if response.data else None
    except Exception:
        return None


async def get_first_exam_after_lesson(
    lesson_id: int, supabase: Client
) -> Optional[int]:
    """Get the first exam ID that comes after a lesson"""
    try:
        # This depends on your exam structure - you might need to adjust this
        # One approach: get exams that have this lesson as previous_lesson
        response = (
            supabase.table("exams")
            .select("id")
            .eq("previous_lesson", lesson_id)
            .order("created_at")
            .limit(1)
            .execute()
        )

        return response.data[0]["id"] if response.data else None
    except Exception:
        return None


async def is_last_module(module_id: int, supabase: Client) -> bool:
    try:
        response = supabase.table("modules").select("id").order("id").execute()

        if not response.data:
            return True  # No modules, so technically this is the "last"

        module_ids = [module["id"] for module in response.data]
        max_module_id = max(module_ids) if module_ids else 0

        return module_id >= max_module_id
    except Exception:
        return False
