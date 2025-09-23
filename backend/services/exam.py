from supabase import Client
from typing import List, Dict, Any


def insert_exam(supabase: Client, exam_data: Dict[str, Any]):
    return supabase.table("exams").insert(exam_data).execute()


def insert_questions(supabase: Client, questions_to_insert: List[Dict[str, Any]]):
    return supabase.table("questions").insert(questions_to_insert).execute()
