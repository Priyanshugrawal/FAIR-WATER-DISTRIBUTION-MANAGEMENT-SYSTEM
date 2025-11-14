from fastapi import APIRouter, HTTPException

from app.data import mock_store
from app.schemas.water import IncidentReport, WaterZone

router = APIRouter(prefix="/zones", tags=["zones"])


@router.get("/", response_model=list[WaterZone], summary="List all distribution zones")
async def get_zones() -> list[WaterZone]:
  return mock_store.list_zones()


@router.get("/{zone_id}", response_model=WaterZone, summary="Get zone details by ID")
async def get_zone(zone_id: str) -> WaterZone:
  for zone in mock_store.list_zones():
    if zone.id == zone_id:
      return zone
  raise HTTPException(status_code=404, detail="Zone not found")


@router.get(
  "/{zone_id}/incidents",
  response_model=list[IncidentReport],
  summary="Incidents reported in this zone",
)
async def get_zone_incidents(zone_id: str) -> list[IncidentReport]:
  return mock_store.list_incidents(zone_id=zone_id)

