from typing import Any

from schemas.auth import UserResponse, UserRole
from schemas.exam import ExamType, PostExamRequest
from services.exam import get_exam_and_questions_by_id, insert_exam, insert_questions
from supabase import Client


async def create_exam_controller(exam_data: PostExamRequest, supabase: Client) -> Any:
    exam_insert_data = {
        "module_id": exam_data.module_id,
        "course_id": exam_data.course_id,
    }
    exam_response = insert_exam(supabase, exam_insert_data)
    exam_id = exam_response.data[0]["id"]

    questions_to_insert = []
    for q in exam_data.questions:
        questions_to_insert.append(
            {
                "exam_id": exam_id,
                "question_text": q.question_text,
                "options": [option.model_dump(by_alias=True) for option in q.options],
            }
        )

    question_response = insert_questions(supabase, questions_to_insert)

    return {"exam_id": exam_id, "questions": question_response.data}


async def get_exam_controller(
    exam_id: str,
    exam_type: ExamType,
    student_user: UserResponse,
    supabase: Client,
) -> Any:
    exam_response = supabase.table("exams").select("*").eq("id", exam_id).execute()

    if not exam_response.data:
        return {"error": "Exam not found"}

    exam_data = exam_response.data[0]
    progress_data = student_user.current_progress_data

    # Check if this specific exam type is already submitted
    if exam_type:
        submission_response = (
            supabase.table("submissions")
            .select("*")
            .eq("exam_id", exam_id)
            .eq("user_id", student_user.id)
            .eq("exam_type", exam_type.value)
            .execute()
        )

        if submission_response.data:
            return {"status": "already_submitted", "exam_type": exam_type.value}

    # Validate exam access based on type and progress
    if student_user.role == UserRole.pro:
        return await handle_pro_user_exam(exam_data, progress_data, exam_type, supabase)
    elif student_user.role == UserRole.regular:
        return await handle_regular_user_exam(
            exam_data, progress_data, exam_type, supabase
        )
    else:
        return {"error": "Invalid user role for exam access"}


async def handle_pro_user_exam(
    exam_data: dict, progress_data: dict, exam_type: ExamType, supabase: Client
) -> Any:
    module_id = exam_data["module_id"]
    current_module_id = progress_data.get("current_module_id")

    if exam_type == ExamType.PRE_EXAM:
        # Pre-exam: must be course-level exam and no progress yet
        if not module_id and current_module_id is None:
            return await get_exam_and_questions_by_id(exam_data["id"], supabase)
        else:
            return {
                "error": "Pre-exam not available. You have already started the course."
            }

    elif exam_type == ExamType.QUIZ:
        # Quiz: must be module-level exam and match current module
        if module_id and current_module_id == module_id:
            return await get_exam_and_questions_by_id(exam_data["id"], supabase)
        else:
            return {"error": "Quiz not available for current progress"}

    elif exam_type == ExamType.FINAL_EXAM:
        # Final exam: must be course-level exam and all modules completed
        if not module_id and progress_data.get("is_final_exam_available"):
            return await get_exam_and_questions_by_id(exam_data["id"], supabase)
        else:
            return {
                "error": "Final exam not available yet. Complete all modules first."
            }

    return {"error": "Invalid exam type"}


async def handle_regular_user_exam(
    exam_data: dict, progress_data: dict, exam_type: ExamType, supabase: Client
) -> Any:
    module_id = exam_data["module_id"]
    current_lesson_id = progress_data.get("current_lesson_id")

    if exam_type == ExamType.PRE_EXAM:
        # Pre-exam: must be course-level exam and no progress yet
        if not module_id and current_lesson_id is None:
            return await get_exam_and_questions_by_id(exam_data["id"], supabase)
        else:
            return {
                "error": "Pre-exam not available. You have already started the course."
            }

    elif exam_type == ExamType.QUIZ:
        # Quiz: must be module-level exam and match current lesson
        if module_id and exam_data.get("previous_lesson") == current_lesson_id:
            return await get_exam_and_questions_by_id(exam_data["id"], supabase)
        else:
            return {"error": "Quiz not available for current progress"}

    elif exam_type == ExamType.FINAL_EXAM:
        # Final exam: must be course-level exam and all lessons completed
        if not module_id and progress_data.get("is_final_exam_available"):
            return await get_exam_and_questions_by_id(exam_data["id"], supabase)
        else:
            return {
                "error": "Final exam not available yet. Complete all lessons first."
            }

    return {"error": "Invalid exam type"}
