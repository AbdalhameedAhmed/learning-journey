from datetime import datetime
from typing import Optional

import jwt
from fastapi import HTTPException, status
from fastapi.security import HTTPBearer
from passlib.context import CryptContext

from config import settings
from schemas.auth import (
    TokenData,
    TokenType,
    UserRole,
)

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


# JWT Bearer token
security = HTTPBearer()


def create_token(
    user_id: int,
    email: str,
    role: UserRole,
    created_at: datetime,
    expires_at: datetime,
    type: TokenType,
):
    to_encode = {
        "sub": email,
        "user_id": user_id,
        "role": role,
        "created_at": created_at.isoformat(),
        "exp": int(expires_at.timestamp()),
        "type": type.value,
    }
    encoded_jwt = jwt.encode(
        to_encode, settings.JWT_SECRET_KEY, algorithm=settings.JWT_ALGORITHM
    )
    return encoded_jwt


def decode_token(token: str):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    payload = jwt.decode(
        token,
        settings.JWT_SECRET_KEY,
        algorithms=[settings.JWT_ALGORITHM],
    )

    email: Optional[str] = payload.get("sub")
    user_id: Optional[int] = payload.get("user_id")
    role: UserRole = payload.get("role")
    created_at: Optional[str] = payload.get("created_at")
    expires_at: Optional[int] = payload.get("exp")

    if email is None or user_id is None or created_at is None or expires_at is None:
        raise credentials_exception

    # Check if it's an access token
    if payload.get("type") != "access":
        raise credentials_exception

    token_data = TokenData(
        email=email,
        user_id=user_id,
        role=role,
        created_at=created_at,
        exp=expires_at,
    )
    return token_data


# Utility functions
def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)
