from pydantic import BaseModel
from typing import List, Optional


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
