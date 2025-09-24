from typing import Any

from supabase import Client

from schemas.exam import PostExamRequest
from services.exam import insert_exam, insert_questions, get_exam_and_questions_by_id


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


def get_exam_controller(exam_id: str, supabase: Client) -> Any:
    return get_exam_and_questions_by_id(exam_id, supabase)
