from fastapi import APIRouter, HTTPException, Query, status

from app.data import mock_store
from app.schemas.water import CitizenReportCreate, IncidentReport

router = APIRouter(prefix="/incidents", tags=["incidents"])


@router.get("/", response_model=list[IncidentReport], summary="List incidents")
async def list_incidents(
  zone_id: str | None = Query(default=None, description="Filter incidents by zone"),
  status_filter: str | None = Query(
    default=None,
    alias="status",
    description="Filter incidents by status (open, acknowledged, resolved)",
  ),
) -> list[IncidentReport]:
  return mock_store.list_incidents(zone_id=zone_id, status=status_filter)


@router.post(
  "/",
  response_model=IncidentReport,
  status_code=status.HTTP_201_CREATED,
  summary="Submit citizen incident report",
)
async def create_incident(payload: CitizenReportCreate) -> IncidentReport:
  if payload.zone_id not in {zone.id for zone in mock_store.list_zones()}:
    raise HTTPException(status_code=404, detail="Unknown zone")
  return mock_store.upsert_citizen_incident(payload)

