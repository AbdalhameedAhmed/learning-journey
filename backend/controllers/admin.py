from typing import Any, Dict, List

from fastapi import HTTPException, status
from schemas.exam import ExamType
from supabase import Client
from utils.get_role import get_role_via_origin
from utils.headers import generate_question_headers
from utils.reports import generate_report
from fastapi.responses import StreamingResponse


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
            .select("id, user_id, exam_id, exam_type, score")
            .in_("user_id", user_ids)
            .execute()
        )

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
                    "score": sub["score"],
                }
                for sub in user_submissions
            ]

            pre_exam = next(
                (
                    sub
                    for sub in user_submissions
                    if sub["exam_type"] == ExamType.PRE_EXAM.value
                ),
                None,
            )
            final_exam = next(
                (
                    sub
                    for sub in user_submissions
                    if sub["exam_type"] == ExamType.FINAL_EXAM.value
                ),
                None,
            )

            has_pre_exam = pre_exam is not None
            pre_exam_score = pre_exam["score"] if pre_exam else None
            has_final_exam = final_exam is not None
            final_exam_score = final_exam["score"] if final_exam else None

            user_info = {
                "user_id": user_id,
                "email": user["email"],
                "first_name": user.get("first_name", ""),
                "last_name": user.get("last_name", ""),
                "profile_picture": user.get("profile_picture", ""),
                "completed_lessons_ids": completed_lessons_ids,
                "exam_submissions": exam_submissions,
                "pre_exam": {
                    "has_pre_exam": has_pre_exam,
                    "score": pre_exam_score,
                },
                "final_exam": {
                    "has_final_exam": has_final_exam,
                    "score": final_exam_score,
                },
            }

            users_with_info.append(user_info)

        return users_with_info

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error fetching user info and exams: {str(e)}",
        )


async def get_quiz_report_controller(
    quiz_id: int, supabase: Client, origin: str | None
):
    role = get_role_via_origin(origin)
    pre_question_headers = [
        "الاسم",
    ]
    after_question_headers = [
        "عدد الاجابات الصحيحة",
        "عدد اسئلة الاختبار",
        "النسبة المئوية للطالب",
        "النسبة المئوية للنجاح",
        "الحالة",
    ]
    report_data = []
    users_response = (
        supabase.table("users")
        .select("*,submissions!inner(*)")
        .eq("role", role.value)
        .eq("submissions.exam_id", quiz_id)
        .execute()
    )

    questions = (
        supabase.table("questions")
        .select("*")
        .eq("exam_id", quiz_id)
        .order("id")
        .execute()
    ).data

    question_headers = generate_question_headers(questions)
    headers = pre_question_headers + question_headers + after_question_headers

    # generate report data
    for user in users_response.data:
        user_data = []
        score = int(user["submissions"][0]["score"])
        passing_score = int(user["submissions"][0]["passing_score"])
        correct_answers = user["submissions"][0]["correct_answers"]
        number_of_questions = len(questions)

        user_data.append(user["first_name"] + " " + user["last_name"])
        for question in questions:
            question_id = question["id"]
            user_answer = next(
                (
                    answer
                    for answer in user["submissions"][0]["answers"]
                    if answer["question_id"] == question_id
                ),
                None,
            )
            if user_answer is None:
                user_data.append("0")
            else:
                is_correct = next(
                    (
                        option["is_correct"]
                        for option in question["options"]
                        if option["id"] == user_answer["selected_option_id"]
                    ),
                    False,
                )
                user_data.append("1" if is_correct else "0")
        user_data.append(correct_answers)
        user_data.append(number_of_questions)
        user_data.append(score)
        user_data.append(passing_score)
        user_data.append("ناجح" if score >= passing_score else "راسب")
        report_data.append(user_data)

    # generate report
    excel_file = await generate_report(headers, report_data, "Quiz Report")
    if not excel_file:
        return HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error generating report",
        )
    filename = "student_report.xlsx"
    return StreamingResponse(
        content=excel_file,
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        headers={
            "Content-Disposition": f'attachment; filename="{filename}"',
            "Cache-Control": "no-cache, no-store, must-revalidate",
        },
    )


async def get_exam_report_controller(
    exam_id: int, exam_type: ExamType, supabase: Client, origin: str | None
):
    role = get_role_via_origin(origin)
    pre_question_headers = [
        "الاسم",
    ]
    after_question_headers = [
        "عدد الاجابات الصحيحة",
        "عدد اسئلة الاختبار",
        "النسبة المئوية للطالب",
        "النسبة المئوية للنجاح",
        "الحالة",
    ]
    report_data = []
    users_response = (
        supabase.table("users")
        .select("*,submissions!inner(*)")
        .eq("role", role.value)
        .eq("submissions.exam_id", exam_id)
        .eq("submissions.exam_type", exam_type.value)
        .execute()
    )

    questions = (
        supabase.table("questions")
        .select("*")
        .eq("exam_id", exam_id)
        .order("id")
        .execute()
    ).data

    question_headers = generate_question_headers(questions)
    headers = pre_question_headers + question_headers + after_question_headers

    # generate report data
    for user in users_response.data:
        user_data = []
        score = int(user["submissions"][0]["score"])
        passing_score = int(user["submissions"][0]["passing_score"])
        correct_answers = user["submissions"][0]["correct_answers"]
        number_of_questions = len(questions)

        user_data.append(user["first_name"] + " " + user["last_name"])
        for question in questions:
            question_id = question["id"]
            user_answer = next(
                (
                    answer
                    for answer in user["submissions"][0]["answers"]
                    if answer["question_id"] == question_id
                ),
                None,
            )
            if user_answer is None:
                user_data.append("0")
            else:
                is_correct = next(
                    (
                        option["is_correct"]
                        for option in question["options"]
                        if option["id"] == user_answer["selected_option_id"]
                    ),
                    False,
                )
                user_data.append("1" if is_correct else "0")
        user_data.append(correct_answers)
        user_data.append(number_of_questions)
        user_data.append(score)
        user_data.append(passing_score)
        user_data.append("ناجح" if score >= passing_score else "راسب")
        report_data.append(user_data)

    # generate report
    excel_file = await generate_report(headers, report_data, "Quiz Report")
    if not excel_file:
        return HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error generating report",
        )
    filename = "student_report.xlsx"
    return StreamingResponse(
        content=excel_file,
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        headers={
            "Content-Disposition": f'attachment; filename="{filename}"',
            "Cache-Control": "no-cache, no-store, must-revalidate",
        },
    )
