import sys
import os

sys.path.insert(0, os.path.realpath(os.path.dirname(__file__)))

from fastapi import FastAPI, Depends
from supabase import Client

from db.database import get_supabase_client

app = FastAPI()


@app.get("/")
def read_root():
    return {"Hello": "World"}


@app.get("/items")
def read_item(supabase: Client = Depends(get_supabase_client)):
    response = supabase.table("users").select("*").execute()
    return response
