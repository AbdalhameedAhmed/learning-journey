from pydantic import BaseModel
from typing import List
from datetime import datetime


class AssetResponse(BaseModel):
    id: int
    type: str
    url: str


class LessonResponse(BaseModel):
    id: int
    name: str
    module_id: int
    assets: List[AssetResponse]
    created_at: datetime
