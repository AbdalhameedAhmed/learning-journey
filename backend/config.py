from pydantic_settings import BaseSettings
from pydantic import Field


class Settings(BaseSettings):
    SUPABASE_URL: str = Field(validation_alias="SUPABASE_URL", default="")
    SUPABASE_KEY: str = Field(validation_alias="SUPABASE_KEY", default="")

    class Config:
        env_file = ".env"


settings = Settings()
