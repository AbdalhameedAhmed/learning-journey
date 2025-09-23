from datetime import datetime

from config import settings
from fastapi.security import HTTPBearer
import jwt
from passlib.context import CryptContext
from schemas.auth import (
    TokenType,
)

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


# JWT Bearer token
security = HTTPBearer()


def create_token(
    user_id: int,
    email: str,
    created_at: datetime,
    expires_at: datetime,
    type: TokenType,
):
    """Create access token with user_id, created_at, and expires_at embedded"""
    to_encode = {
        "sub": email,
        "user_id": user_id,
        "created_at": created_at.isoformat(),
        "exp": int(expires_at.timestamp()),
        "type": type.value,
    }
    encoded_jwt = jwt.encode(
        to_encode, settings.JWT_SECRET_KEY, algorithm=settings.JWT_ALGORITHM
    )
    return encoded_jwt


# Utility functions
def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)
