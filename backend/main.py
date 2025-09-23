import os
import sys

sys.path.insert(0, os.path.realpath(os.path.dirname(__file__)))

from fastapi import APIRouter, FastAPI
from routers.auth import auth_router
from routers.exam import exam_router


app = FastAPI()

api_router = APIRouter(prefix="/api")
api_router.include_router(auth_router)
api_router.include_router(exam_router)

app.include_router(api_router)
