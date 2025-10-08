from enum import Enum
from typing import Any, Dict

from pydantic import BaseModel, EmailStr, field_validator


class UserRole(Enum):
    regular = "regular"
    pro = "pro"
    admin = "admin"


class TokenType(Enum):
    access = "access"
    refresh = "refresh"


class UserRegister(BaseModel):
    first_name: str
    last_name: str
    email: EmailStr
    password: str
    confirm_password: str

    @field_validator("confirm_password")
    def passwords_match(cls, v, values):
        if "password" in values.data and v != values.data["password"]:
            raise ValueError("Passwords do not match")
        return v


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class Token(BaseModel):
    access_token: str
    refresh_token: str


class UserResponse(BaseModel):
    id: int
    email: str
    first_name: str
    last_name: str
    role: UserRole
    current_progress_data: Dict[str, Any]
    profile_image: str | None = None


class LoginResponse(BaseModel):
    user: UserResponse
    tokens: Token


class RefreshTokenRequest(BaseModel):
    refresh_token: str


class TokenData(BaseModel):
    email: str
    user_id: int
    role: UserRole
    created_at: str
    exp: int
