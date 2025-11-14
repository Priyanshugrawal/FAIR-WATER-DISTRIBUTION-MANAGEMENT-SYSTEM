"""Authentication routes: register, login, and password reset."""
import re

from fastapi import APIRouter, HTTPException, status

from app.core.auth import create_access_token
from app.data.citizen_store import get_citizen_store
from app.schemas.auth import (
  AuthTokenResponse,
  CitizenLoginRequest,
  CitizenRegisterRequest,
  CitizenResponse,
  PasswordResetConfirm,
  PasswordResetRequest,
)

router = APIRouter(prefix="/auth", tags=["auth"])


def validate_password_strength(password: str) -> None:
  """Validate password meets complexity requirements.
  
  - At least 8 characters
  - At least 1 uppercase letter
  - At least 1 digit
  - At least 1 special character
  
  Raises ValueError if not met.
  """
  if len(password) < 8:
    raise ValueError("Password must be at least 8 characters long")
  if not re.search(r"[A-Z]", password):
    raise ValueError("Password must contain at least one uppercase letter")
  if not re.search(r"\d", password):
    raise ValueError("Password must contain at least one digit")
  if not re.search(r"[!@#$%^&*()_+\-=\[\]{};:'\",.<>?/\\|`~]", password):
    raise ValueError("Password must contain at least one special character")


@router.post(
  "/register",
  response_model=AuthTokenResponse,
  status_code=status.HTTP_201_CREATED,
  summary="Register a new citizen",
)
async def register(payload: CitizenRegisterRequest) -> AuthTokenResponse:
  """Register a new citizen account."""
  try:
    validate_password_strength(payload.password)
  except ValueError as e:
    raise HTTPException(status_code=400, detail=str(e))

  citizen_store = get_citizen_store()
  try:
    user = citizen_store.create_user(
      full_name=payload.full_name,
      email=payload.email,
      password=payload.password,
      district=payload.district,
      tehsil=payload.tehsil,
      block=payload.block,
      house_no=payload.house_no,
    )
  except ValueError as e:
    raise HTTPException(status_code=400, detail=str(e))

  token = create_access_token({"sub": user.id, "email": user.email})
  return AuthTokenResponse(
    access_token=token,
    citizen=CitizenResponse(**user.to_dict()),
  )


@router.post(
  "/login",
  response_model=AuthTokenResponse,
  summary="Login with email and password",
)
async def login(payload: CitizenLoginRequest) -> AuthTokenResponse:
  """Login with email and password."""
  citizen_store = get_citizen_store()
  user = citizen_store.verify_citizen(payload.email, payload.password)

  if not user:
    raise HTTPException(
      status_code=status.HTTP_401_UNAUTHORIZED,
      detail="Invalid email or password",
    )

  token = create_access_token({"sub": user.id, "email": user.email})
  return AuthTokenResponse(
    access_token=token,
    citizen=CitizenResponse(**user.to_dict()),
  )


@router.post(
  "/reset-request",
  status_code=status.HTTP_200_OK,
  summary="Request password reset link",
)
async def reset_password_request(payload: PasswordResetRequest) -> dict[str, str]:
  """Request a password reset link.
  
  NOTE: In production, this would send an email with a reset link.
  For now, this is a stub that returns a message.
  """
  citizen_store = get_citizen_store()
  user = citizen_store.get_user_by_email(payload.email)

  if not user:
    # Don't reveal if email exists (security best practice)
    return {"message": "If email exists, a reset link will be sent"}

  # TODO: In production, generate a reset token and send via email
  return {"message": "Password reset link sent to email"}


@router.post(
  "/reset-confirm",
  status_code=status.HTTP_200_OK,
  summary="Confirm password reset",
)
async def reset_password_confirm(payload: PasswordResetConfirm) -> dict[str, str]:
  """Confirm password reset with token.
  
  NOTE: Token validation would happen here in production.
  For now, this is a stub.
  """
  try:
    validate_password_strength(payload.new_password)
  except ValueError as e:
    raise HTTPException(status_code=400, detail=str(e))

  # TODO: Validate reset token and update password
  return {"message": "Password reset successful"}

