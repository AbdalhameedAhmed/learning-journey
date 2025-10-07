from pydantic import BaseModel


class Favorite(BaseModel):
    user_id: str
    lesson_id: str
