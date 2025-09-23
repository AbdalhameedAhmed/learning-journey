import os
import sys
from fastapi.middleware.cors import CORSMiddleware

sys.path.insert(0, os.path.realpath(os.path.dirname(__file__)))

from fastapi import APIRouter, FastAPI
from routers.auth import auth_router
from routers.course import courses_router

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

api_router = APIRouter(prefix="/api")
api_router.include_router(auth_router)
api_router.include_router(courses_router)


app.include_router(api_router)
