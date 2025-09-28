from enum import Enum
from typing import Any, Dict, List, Optional

from pydantic import BaseModel


class ExamType(str, Enum):
    PRE_EXAM = "pre_exam"
    QUIZ = "quiz"
    FINAL_EXAM = "final_exam"


# without is_correct
class OptionBase(BaseModel):
    id: Optional[int] = None
    option_text: str


# with is_correct
class Option(OptionBase):
    is_correct: bool


# in create exam request
class PostQuestionBase(BaseModel):
    question_text: str
    options: List[Option]


class GetQuestionBase(BaseModel):
    question_text: str
    options: List[OptionBase]


# in get exam response
class Question(GetQuestionBase):
    id: int
    exam_id: int


class PostExamRequest(BaseModel):
    module_id: Optional[int] = None
    course_id: Optional[int] = None
    questions: List[PostQuestionBase]


class QuestionResponse(BaseModel):
    id: int
    exam_id: int
    question_text: str
    options: List[Option]


class PostExamResponse(BaseModel):
    exam_id: int
    questions: List[QuestionResponse]


class GetExamResponse(BaseModel):
    id: int
    module_id: Optional[int]
    course_id: Optional[int]
    questions: List[Question]


class ExamSubmissionRequest(BaseModel):
    exam_id: int
    exam_type: ExamType
    answers: List[Dict[str, Any]]  # [{"question_id": 1, "selected_option_id": 3}, ...]


class ExamSubmissionResponse(BaseModel):
    success: bool
    score: int
    total_questions: int
    correct_answers: int
    passed: bool
    progress_updated: bool
    message: str
    next_available_lesson_id: int | None = None
    next_available_module_id: int | None = None
    next_available_exam_id: int | None = None
