"""In-memory citizen user store for authentication."""
from datetime import datetime, timezone

from app.core.auth import hash_password, verify_password


class CitizenUser:
  """Citizen user model."""
  def __init__(
    self,
    id: str,
    full_name: str,
    email: str,
    password_hash: str,
    district: str,
    tehsil: str,
    block: str,
    house_no: str,
  ):
    self.id = id
    self.full_name = full_name
    self.email = email
    self.password_hash = password_hash
    self.district = district
    self.tehsil = tehsil
    self.block = block
    self.house_no = house_no
    self.created_at = datetime.now(timezone.utc)

  def to_dict(self):
    """Return citizen info (no password)."""
    return {
      "id": self.id,
      "full_name": self.full_name,
      "email": self.email,
      "district": self.district,
      "tehsil": self.tehsil,
      "block": self.block,
      "house_no": self.house_no,
    }


class CitizenStore:
  """In-memory store for citizen users."""
  def __init__(self):
    self._users: dict[str, CitizenUser] = {}
    self._email_index: dict[str, str] = {}  # email -> user_id
    self._next_id = 1000

  def create_user(
    self,
    full_name: str,
    email: str,
    password: str,
    district: str,
    tehsil: str,
    block: str,
    house_no: str,
  ) -> CitizenUser:
    """Register a new citizen. Raises ValueError if email exists."""
    if email in self._email_index:
      raise ValueError(f"Email {email} already registered")

    user_id = f"citizen-{self._next_id}"
    self._next_id += 1
    password_hash = hash_password(password)

    user = CitizenUser(
      id=user_id,
      full_name=full_name,
      email=email,
      password_hash=password_hash,
      district=district,
      tehsil=tehsil,
      block=block,
      house_no=house_no,
    )
    self._users[user_id] = user
    self._email_index[email] = user_id
    return user

  def get_user_by_email(self, email: str) -> CitizenUser | None:
    """Retrieve a citizen by email."""
    user_id = self._email_index.get(email)
    return self._users.get(user_id) if user_id else None

  def get_user_by_id(self, user_id: str) -> CitizenUser | None:
    """Retrieve a citizen by ID."""
    return self._users.get(user_id)

  def verify_citizen(self, email: str, password: str) -> CitizenUser | None:
    """Verify citizen credentials. Returns user if valid, None otherwise."""
    user = self.get_user_by_email(email)
    if not user:
      return None
    if not verify_password(password, user.password_hash):
      return None
    return user


# Global citizen store instance
_citizen_store = CitizenStore()


def get_citizen_store() -> CitizenStore:
  """Return the global citizen store."""
  return _citizen_store

