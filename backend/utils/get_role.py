from config import settings
from fastapi import HTTPException, status
from schemas.auth import UserRole


def get_role_via_origin(origin):
    role = None
    if origin == settings.PRO_ORIGIN:
        role = UserRole.pro
    elif origin == settings.REGULAR_ORIGIN:
        role = UserRole.regular
    print(settings.REGULAR_ORIGIN, origin, "🚨🚨🚨🚨🚨🚨")
    if role is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Undetected Origin",
            headers={"WWW-Authenticate": "Bearer"},
        )

    return role
