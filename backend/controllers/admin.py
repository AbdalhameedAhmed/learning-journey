from typing import Any, Dict, List

from fastapi import HTTPException, status
from schemas.exam import ExamType
from supabase import Client
from utils.get_role import get_role_via_origin


async def get_users_basic_info_and_exams_controller(
    origin: str | None, supabase: Client
) -> List[Dict[str, Any]]:
    try:
        role = get_role_via_origin(origin)

        users_response = (
            supabase.table("users")
            .select("id, email, first_name, last_name, current_progress_data")
            .eq("role", role.value)
            .execute()
        )

        user_ids = [user["id"] for user in users_response.data]

        all_submissions_response = (
            supabase.table("submissions")
            .select("id, user_id, exam_id, exam_type")
            .in_("user_id", user_ids)
            .execute()
        )

        print(f"All Submissions: {all_submissions_response.data}")

        submissions_by_user = {}
        for submission in all_submissions_response.data:
            user_id = submission["user_id"]
            if user_id not in submissions_by_user:
                submissions_by_user[user_id] = []
            submissions_by_user[user_id].append(submission)

        users_with_info = []

        for user in users_response.data:
            user_id = user["id"]
            progress_data = user.get("current_progress_data", {})
            completed_lessons_ids = progress_data.get("completed_lessons", [])

            # Get user's exam submissions
            user_submissions = submissions_by_user.get(user_id, [])

            exam_submissions = [
                {
                    "exam_id": sub["exam_id"],
                    "exam_type": sub["exam_type"],
                }
                for sub in user_submissions
            ]

            user_info = {
                "user_id": user_id,
                "email": user["email"],
                "first_name": user.get("first_name", ""),
                "last_name": user.get("last_name", ""),
                "completed_lessons_ids": completed_lessons_ids,
                "exam_submissions": exam_submissions,
                "has_pre_exam": any(
                    sub["exam_type"] == ExamType.PRE_EXAM.value
                    for sub in exam_submissions
                ),
                "has_final_exam": any(
                    sub["exam_type"] == ExamType.FINAL_EXAM.value
                    for sub in exam_submissions
                ),
            }

            users_with_info.append(user_info)

        return users_with_info

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error fetching user info and exams: {str(e)}",
        )
