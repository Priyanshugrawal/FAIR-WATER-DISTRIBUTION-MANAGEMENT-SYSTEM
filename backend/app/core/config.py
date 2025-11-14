from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
  """Application configuration sourced from environment variables."""

  project_name: str = "Fair Water Distribution Management System"
  api_prefix: str = "/api"
  debug: bool = True
  allowed_hosts: list[str] = ["*"]
  database_url: str = "postgresql+asyncpg://postgres:postgres@localhost:5432/fwdms"
  redis_url: str = "redis://localhost:6379/0"

  # AI/ML toggles
  enable_demand_forecast: bool = True
  enable_schedule_optimizer: bool = True
  enable_anomaly_detection: bool = True

  # WebSocket broadcasting
  telemetry_channel: str = "telemetry:updates"
  incident_channel: str = "incident:updates"

  model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")


@lru_cache
def get_settings() -> Settings:
  """Return cached application settings."""
  return Settings()

