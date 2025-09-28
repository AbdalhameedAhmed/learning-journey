from datetime import datetime
from typing import Any, Dict, List

from schemas.auth import UserRole
from schemas.exam import ExamType
from supabase import Client

from services.course import (
    get_first_exam_for_module,
    get_next_lesson_id,
    is_last_module,
)


def insert_exam(supabase: Client, exam_data: Dict[str, Any]):
    return supabase.table("exams").insert(exam_data).execute()


def insert_questions(supabase: Client, questions_to_insert: List[Dict[str, Any]]):
    return supabase.table("questions").insert(questions_to_insert).execute()


async def get_exam_and_questions_by_id(
    exam_id: str, supabase: Client
) -> Dict[str, Any]:
    exam_response = supabase.table("exams").select("*").eq("id", exam_id).execute()

    if not exam_response.data:
        return {}

    exam_data = exam_response.data[0]

    questions_response = (
        supabase.table("questions").select("*").eq("exam_id", exam_id).execute()
    )

    # Sanitize the questions data to remove the 'is_correct' key
    sanitized_questions = []
    for question in questions_response.data:
        sanitized_options = []
        for option in question["options"]:
            sanitized_option = {
                key: value for key, value in option.items() if key != "is_correct"
            }
            sanitized_options.append(sanitized_option)

        question["options"] = sanitized_options
        sanitized_questions.append(question)

    exam_data["questions"] = sanitized_questions

    return exam_data


async def calculate_exam_score(
    exam_id: int, answers: List[Dict[str, Any]], supabase: Client
) -> Dict[str, Any]:
    try:
        # Get exam questions with correct answers
        response = (
            supabase.table("questions")
            .select("id, options")
            .eq("exam_id", exam_id)
            .execute()
        )

        if not response.data:
            return {"error": "Exam questions not found"}

        questions = response.data
        total_questions = len(questions)
        correct_answers_count = 0

        # Calculate score
        for answer in answers:
            question_id = answer.get("question_id")
            selected_option_id = answer.get("selected_option_id")

            # Find the question
            question = next((q for q in questions if q["id"] == question_id), None)
            if not question:
                continue

            # Find the correct option
            correct_option = next(
                (opt for opt in question["options"] if opt.get("is_correct")), None
            )
            if correct_option and correct_option["id"] == selected_option_id:
                correct_answers_count += 1

        # Calculate percentage
        score = (
            (correct_answers_count / total_questions) * 100
            if total_questions > 0
            else 0
        )
        passing_score = 60

        return {
            "score": round(score, 2),
            "total_questions": total_questions,
            "correct_answers": correct_answers_count,
            "passing_score": passing_score,
            "passed": score >= passing_score,
        }

    except Exception as e:
        return {"error": f"Error calculating score: {str(e)}"}


async def save_exam_submission(
    user_id: int,
    user_role: UserRole,
    exam_id: int,
    exam_type: str,
    answers: List[Dict[str, Any]],
    score: float,
    total_questions: int,
    correct_answers: int,
    passing_score: float,
    passed: bool,
    supabase: Client,
) -> int:
    submission_data = {
        "user_id": user_id,
        "exam_id": exam_id,
        "user_role": user_role.value,
        "exam_type": exam_type,
        "answers": answers,
        "score": score,
        "total_questions": total_questions,
        "correct_answers": correct_answers,
        "passing_score": passing_score,
        "passed": passed,
        "created_at": "now()",
    }

    response = supabase.table("submissions").insert(submission_data).execute()

    return response.data[0]["id"] if response.data else 0


async def update_progress_after_exam(
    user_id: int,
    user_role: UserRole,
    exam_type: str,
    current_progress: Dict[str, Any],
    supabase: Client,
) -> Dict[str, Any]:
    try:
        progress_data = current_progress.copy()

        if exam_type == "pre_exam":
            # Pre-exam passed - start the course
            return await update_progress_after_pre_exam(user_id, user_role, supabase)

        elif exam_type == "quiz":
            # Module quiz passed - progress to next module/lesson
            if user_role == UserRole.pro:
                return await update_pro_progress_after_module_quiz(
                    user_id, progress_data, supabase
                )
            else:
                return await update_regular_progress_after_module_quiz(
                    user_id, progress_data, supabase
                )

        elif exam_type == "final_exam":
            # Final exam passed - course completed
            return await update_progress_after_final_exam(
                user_id, progress_data, supabase
            )

        else:
            return {"error": "Unknown exam type"}

    except Exception as e:
        return {"error": f"Error updating progress: {str(e)}"}


async def update_progress_after_pre_exam(
    user_id: int, user_role: UserRole, supabase: Client
) -> Dict[str, Any]:
    progress_data = {
        "is_final_exam_available": False,
        "completed_modules": [],
        "completed_lessons": [],
    }

    if user_role == UserRole.pro:
        progress_data.update(
            {
                "next_available_module_id": 1,
                "next_available_exam_id": await get_first_exam_for_module(1, supabase),
            }
        )
    else:
        progress_data.update(
            {
                "next_available_lesson_id": 1,
                "next_available_exam_id": None,
            }
        )

    # Save to database
    supabase.table("users").update({"current_progress_data": progress_data}).eq(
        "id", user_id
    ).execute()

    return {"success": True}


async def update_pro_progress_after_module_quiz(
    user_id: int,
    progress_data: Dict[str, Any],
    supabase: Client,
) -> Dict[str, Any]:
    current_module_id = progress_data.get("next_available_module_id")

    if current_module_id:
        # Move to next module
        next_module_id = current_module_id + 1
        progress_data["next_available_module_id"] = next_module_id
        progress_data["completed_modules"] = progress_data.get(
            "completed_modules", []
        ) + [current_module_id]

        # Set next available exam
        progress_data["next_available_exam_id"] = await get_first_exam_for_module(
            next_module_id, supabase
        )

        # Check if this was the last module
        if await is_last_module(current_module_id, supabase):
            progress_data["is_final_exam_available"] = True

    # Save progress
    supabase.table("users").update({"current_progress_data": progress_data}).eq(
        "id", user_id
    ).execute()

    return {"success": True}


async def update_regular_progress_after_module_quiz(
    user_id: int,
    progress_data: Dict[str, Any],
    supabase: Client,
) -> Dict[str, Any]:
    current_lesson_id = progress_data.get("next_available_lesson_id")

    if current_lesson_id:
        # Move to next lesson
        next_lesson_id = await get_next_lesson_id(current_lesson_id, supabase)
        progress_data["next_available_lesson_id"] = next_lesson_id

        # Set next available exam to None
        progress_data["next_available_exam_id"] = None

        # Check if this was the last lesson
        if not next_lesson_id:
            progress_data["is_final_exam_available"] = True

    # Save progress
    supabase.table("users").update({"current_progress_data": progress_data}).eq(
        "id", user_id
    ).execute()

    return {"success": True}


async def update_progress_after_final_exam(
    user_id: int, progress_data: Dict[str, Any], supabase: Client
) -> Dict[str, Any]:
    progress_data["is_final_exam_available"] = False
    progress_data["course_completed"] = True
    progress_data["completed_at"] = datetime.now().isoformat()

    # Save progress
    supabase.table("users").update({"current_progress_data": progress_data}).eq(
        "id", user_id
    ).execute()

    return {"success": True}


async def is_exam_previously_submitted(
    exam_id: int, user_id: int, exam_type: ExamType, supabase: Client
):
    exam_response = (
        supabase.table("submissions")
        .select("*")
        .eq("exam_id", exam_id)
        .eq("user_id", user_id)
        .eq("exam_type", exam_type.value)
        .execute()
    )

    if not exam_response.data:
        return {}

    exam_data = exam_response.data[0]

    return exam_data


async def is_exam_allowed_by_progress(
    exam_id: int, exam_type: ExamType, user_progress: Dict[str, Any]
):
    if exam_type == ExamType.FINAL_EXAM:
        return user_progress.get("is_final_exam_available", False)
    elif exam_type == ExamType.PRE_EXAM:
        return user_progress.get("next_available_module_id") is None
    else:
        next_available_exam_id = user_progress.get("next_available_exam_id")

        if next_available_exam_id is None:
            return False

        if exam_id == next_available_exam_id:
            return True

        return False
