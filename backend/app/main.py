from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import get_settings
from app.routers import auth, incidents, insights, pumps, stream, telemetry, zones, billing, rewards_emergency

settings = get_settings()

app = FastAPI(
  title=settings.project_name,
  version="0.1.0",
  debug=settings.debug,
  docs_url=f"{settings.api_prefix}/docs",
  redoc_url=f"{settings.api_prefix}/redoc",
  openapi_url=f"{settings.api_prefix}/openapi.json",
)

app.add_middleware(
  CORSMiddleware,
  allow_origins=settings.allowed_hosts,
  allow_methods=["*"],
  allow_headers=["*"],
  allow_credentials=True,
)

app.include_router(auth.router, prefix=settings.api_prefix)
app.include_router(zones.router, prefix=settings.api_prefix)
app.include_router(telemetry.router, prefix=settings.api_prefix)
app.include_router(incidents.router, prefix=settings.api_prefix)
app.include_router(pumps.router, prefix=settings.api_prefix)
app.include_router(insights.router, prefix=settings.api_prefix)
app.include_router(stream.router, prefix=settings.api_prefix)
app.include_router(billing.router, prefix=settings.api_prefix)
app.include_router(rewards_emergency.router, prefix=settings.api_prefix)


@app.get("/", tags=["health"])
async def root() -> dict[str, str]:
  return {"status": "ok", "service": settings.project_name}

