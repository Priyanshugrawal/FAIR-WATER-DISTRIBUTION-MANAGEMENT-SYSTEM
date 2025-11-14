from pydantic import BaseModel, EmailStr, Field


class CitizenRegisterRequest(BaseModel):
  """Citizen registration request."""
  full_name: str = Field(..., min_length=2, max_length=100)
  email: EmailStr
  password: str = Field(..., min_length=8)  # validation done in backend
  district: str = Field(..., min_length=1, max_length=100)
  tehsil: str = Field(..., min_length=1, max_length=100)
  block: str = Field(..., min_length=1, max_length=100)
  house_no: str = Field(..., min_length=1, max_length=50)


class CitizenLoginRequest(BaseModel):
  """Citizen login request."""
  email: EmailStr
  password: str


class CitizenResponse(BaseModel):
  """Citizen info in response (no password)."""
  id: str
  full_name: str
  email: str
  district: str
  tehsil: str
  block: str
  house_no: str


class AuthTokenResponse(BaseModel):
  """Auth token response after successful login/register."""
  access_token: str
  token_type: str = "bearer"
  citizen: CitizenResponse


class PasswordResetRequest(BaseModel):
  """Request password reset link."""
  email: EmailStr


class PasswordResetConfirm(BaseModel):
  """Confirm new password after reset."""
  token: str
  new_password: str = Field(..., min_length=8)


