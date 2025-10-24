from typing import Any, Dict

from schemas.auth import UserResponse, UserRole
from schemas.exam import (
    ExamSubmissionRequest,
    ExamSubmissionResponse,
    ExamType,
    PostExamRequest,
)
from services.auth import get_user_progress
from services.exam import (
    calculate_exam_score,
    get_exam_and_questions_by_id,
    insert_exam,
    insert_questions,
    is_exam_allowed_by_progress,
    is_exam_previously_submitted,
    save_exam_submission,
    update_progress_after_exam,
)
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
        return {"error": "الامتحان غير موجود"}

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
            # Exam was submitted previously, return the result
            submission = submission_response.data[0]

            # 1. Prepare detailed_review conditionally
            detailed_review = None
            if exam_type.value != ExamType.PRE_EXAM.value:
                # Retrieve the saved answers list
                user_saved_answers = submission.get("answers", [])

                score_recalc_result = await calculate_exam_score(
                    exam_id=submission["exam_id"],
                    answers=user_saved_answers,
                    supabase=supabase,
                )

                if "error" not in score_recalc_result:
                    detailed_review = score_recalc_result.get("detailed_review")

            # 2. Format the submission data into the ExamSubmissionResult structure
            return {
                "status": "already_submitted",
                "error": "لقد تم تقديم هذا الاختبار بالفعل.",
                "exam_type": submission["exam_type"],
                "result": {  # This object matches the ExamSubmissionResult interface
                    "success": True,
                    "score": submission["score"],
                    "total_questions": submission["total_questions"],
                    "correct_answers": submission["correct_answers"],
                    "passed": submission["passed"],
                    "message": "عرض نتائج الامتحان السابق.",
                    "next_available_exam_id": progress_data.get(
                        "next_available_exam_id"
                    ),
                    "next_available_lesson_id": progress_data.get(
                        "next_available_lesson_id"
                    ),
                    "next_available_module_id": progress_data.get(
                        "next_available_module_id"
                    ),
                    "progress_updated": True,
                    "detailed_review": detailed_review,
                },
            }

    if student_user.role == UserRole.pro:
        return await validate_pro_user_getting_exam(
            exam_data, progress_data, exam_type, supabase
        )
    elif student_user.role == UserRole.regular:
        return await validate_regular_user_getting_exam(
            exam_data, progress_data, exam_type, supabase
        )
    else:
        return {"error": "دور المستخدم غير صالح للوصول إلى الامتحان"}


async def validate_pro_user_getting_exam(
    exam_data: dict, progress_data: dict, exam_type: ExamType, supabase: Client
) -> Any:
    module_id = exam_data["module_id"]
    next_available_module_id = progress_data.get("next_available_module_id")
    next_available_exam_id = progress_data.get("next_available_exam_id")
    is_final_exam_available = progress_data.get("is_final_exam_available", False)

    if exam_type == ExamType.PRE_EXAM:
        # Pre-exam: must be course-level exam and no progress yet
        if not module_id and next_available_module_id is None:
            return await get_exam_and_questions_by_id(exam_data["id"], supabase)
        else:
            return {"error": "الاختبار القبلي غير متاح. لقد بدأت الكورس بالفعل."}

    elif exam_type == ExamType.QUIZ:
        # Quiz: match the next available exam ID
        if exam_data["id"] == next_available_exam_id:
            return await get_exam_and_questions_by_id(exam_data["id"], supabase)
        else:
            return {
                "error": "للوصول إلى هذا الامتحان، يرجى استكمال الدروس والوحدات السابقة أولاً."
            }
    elif exam_type == ExamType.FINAL_EXAM:
        # Final exam: must be course-level exam and final exam available
        if not module_id and is_final_exam_available:
            return await get_exam_and_questions_by_id(exam_data["id"], supabase)
        else:
            return {"error": "الامتحان النهائي غير متاح بعد. أكمل جميع الوحدات أولاً."}

    return {"error": "نوع الامتحان غير صالح"}


async def validate_regular_user_getting_exam(
    exam_data: dict, progress_data: dict, exam_type: ExamType, supabase: Client
) -> Any:
    module_id = exam_data["module_id"]
    next_available_lesson_id = progress_data.get("next_available_lesson_id")
    next_available_exam_id = progress_data.get("next_available_exam_id")
    is_final_exam_available = progress_data.get("is_final_exam_available", False)

    if exam_type == ExamType.PRE_EXAM:
        # Pre-exam: must be course-level exam and no progress yet
        if not module_id and next_available_lesson_id is None:
            return await get_exam_and_questions_by_id(exam_data["id"], supabase)
        else:
            return {"error": "الاختبار القبلي غير متاح. لقد بدأت الكورس بالفعل."}

    elif exam_type == ExamType.QUIZ:
        # Quiz: match the next available exam ID
        if exam_data["id"] == next_available_exam_id:
            return await get_exam_and_questions_by_id(exam_data["id"], supabase)
        else:
            return {
                "error": "للوصول إلى هذا الامتحان، يرجى استكمال الدروس والوحدات السابقة أولاً."
            }
    elif exam_type == ExamType.FINAL_EXAM:
        # Final exam: must be course-level exam and final exam available
        if not module_id and is_final_exam_available:
            return await get_exam_and_questions_by_id(exam_data["id"], supabase)
        else:
            return {"error": "الامتحان النهائي غير متاح بعد. أكمل جميع الوحدات أولاً."}

    return {"error": "نوع الامتحان غير صالح"}


async def submit_exam_controller(
    submission_data: ExamSubmissionRequest,
    user_id: int,
    user_role: UserRole,
    user_progress: Dict[str, Any],
    supabase: Client,
):
    try:
        # 1. Check if exam was previously submitted
        existing_submission = await is_exam_previously_submitted(
            exam_id=submission_data.exam_id,
            user_id=user_id,
            exam_type=submission_data.exam_type,
            supabase=supabase,
        )

        if existing_submission:
            return {"error": "تم تقديم الامتحان بالفعل. لا يمكنك تقديمه مرة أخرى."}

        if submission_data.exam_type != ExamType.ACTIVITY:
            # 2. Check if exam is allowed based on progress data
            is_exam_allowed = await is_exam_allowed_by_progress(
                exam_id=submission_data.exam_id,
                exam_type=submission_data.exam_type,
                user_progress=user_progress,
            )

            if not is_exam_allowed:
                return {
                    "error": "للوصول إلى هذا الامتحان، يرجى استكمال الدروس والوحدات السابقة أولاً."
                }

        # 2. Calculate score with detailed results
        score_result = await calculate_exam_score(
            submission_data.exam_id, submission_data.answers, supabase
        )

        if "error" in score_result:
            return {"error": "خطأ في احتساب النتيجة"}

        # 3. Save submission to database with all grade details
        await save_exam_submission(
            user_id=user_id,
            user_role=user_role,
            exam_id=submission_data.exam_id,
            exam_type=submission_data.exam_type,
            answers=submission_data.answers,
            score=score_result["score"],
            total_questions=score_result["total_questions"],
            correct_answers=score_result["correct_answers"],
            passing_score=score_result["passing_score"],
            passed=score_result["passed"],
            supabase=supabase,
        )

        # 4. Update user progress
        progress_update_result = await update_progress_after_exam(
            exam_id=submission_data.exam_id,
            user_id=user_id,
            user_role=user_role,
            exam_type=submission_data.exam_type,
            current_progress=user_progress,
            supabase=supabase,
        )
        progress_updated = "success" in progress_update_result

        # 5. Get updated progress for response
        updated_progress = await get_user_progress(user_id, supabase)

        # 6. Prepare the correct answers preview conditionally
        detailed_review = None
        if submission_data.exam_type != "pre_exam":
            detailed_review = score_result.get("detailed_review")

        return ExamSubmissionResponse(
            success=True,
            score=score_result["score"],
            total_questions=score_result["total_questions"],
            correct_answers=score_result["correct_answers"],
            passed=score_result["passed"],
            progress_updated=progress_updated,
            message="Exam submitted successfully",
            next_available_lesson_id=updated_progress.get("next_available_lesson_id"),
            next_available_module_id=updated_progress.get("next_available_module_id"),
            next_available_exam_id=updated_progress.get("next_available_exam_id"),
            detailed_review=detailed_review,
        )

    except Exception as e:
        return {"error": f"خطأ في تقديم الامتحان: {str(e)}"}
