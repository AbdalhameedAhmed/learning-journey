from pydantic_settings import BaseSettings
from pydantic import Field


class Settings(BaseSettings):
    SUPABASE_URL: str = Field(validation_alias="SUPABASE_URL", default="")
    SUPABASE_KEY: str = Field(validation_alias="SUPABASE_KEY", default="")
    JWT_SECRET_KEY: str = Field(validation_alias="JWT_SECRET_KEY", default="")
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 90

    PRO_ORIGIN: str = Field(validation_alias="PRO_ORIGIN", default="")
    REGULAR_ORIGIN: str = Field(validation_alias="REGULAR_ORIGIN", default="")

    class Config:
        env_file = ".env"


settings = Settings()
