from pydantic import BaseModel


class NoteBase(BaseModel):
    note: str
    time: int


class AddNote(NoteBase):
    lesson_id: int


class NoteResponse(NoteBase):
    id: int
