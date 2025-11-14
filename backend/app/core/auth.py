"""Authentication utilities: password hashing and JWT token generation."""
import os
from datetime import datetime, timedelta, timezone
from typing import Any

import jwt
from passlib.context import CryptContext

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# JWT config
SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key-change-in-production")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_DAYS = 7


def hash_password(password: str) -> str:
  """Hash a plain-text password."""
  return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
  """Verify a plain-text password against a hash."""
  return pwd_context.verify(plain_password, hashed_password)


def create_access_token(data: dict[str, Any]) -> str:
  """Generate a JWT access token."""
  to_encode = data.copy()
  expire = datetime.now(timezone.utc) + timedelta(days=ACCESS_TOKEN_EXPIRE_DAYS)
  to_encode.update({"exp": expire})
  encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
  return encoded_jwt


def decode_access_token(token: str) -> dict[str, Any] | None:
  """Decode and verify a JWT token. Returns payload or None if invalid."""
  try:
    payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    return payload
  except jwt.PyJWTError:
    return None

