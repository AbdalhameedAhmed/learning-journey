from pydantic import BaseModel
from typing import List, Optional


class Option(BaseModel):
    id: Optional[int] = None
    option_text: str
    is_correct: bool


class Question(BaseModel):
    question_text: str
    options: List[Option]


class ExamRequest(BaseModel):
    module_id: Optional[int] = None
    course_id: Optional[int] = None
    questions: List[Question]


class QuestionResponse(BaseModel):
    id: int
    exam_id: int
    question_text: str
    options: List[Option]


class ExamResponse(BaseModel):
    exam_id: int
    questions: List[QuestionResponse]
