from supabase import Client
from typing import List, Dict, Any


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
