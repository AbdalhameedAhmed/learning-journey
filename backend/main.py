import os
import sys

from fastapi.middleware.cors import CORSMiddleware

sys.path.insert(0, os.path.realpath(os.path.dirname(__file__)))

from fastapi import APIRouter, FastAPI
from routers.admin import admin_router
from routers.auth import auth_router
from routers.course import courses_router
from routers.exam import exam_router
from routers.favorites import favorites_router
from routers.notes import notes_router

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

api_router = APIRouter(prefix="/api")

api_router.include_router(auth_router)
api_router.include_router(exam_router)
api_router.include_router(courses_router)
api_router.include_router(notes_router)
api_router.include_router(favorites_router)
api_router.include_router(admin_router)


app.include_router(api_router)
