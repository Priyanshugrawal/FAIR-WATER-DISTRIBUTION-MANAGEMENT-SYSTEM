from fastapi import APIRouter, HTTPException, status

from app.data import mock_store
from app.schemas.water import PumpSchedule, PumpStation, ReservoirStatus

router = APIRouter(prefix="/pumps", tags=["pump-operations"])


@router.get("/schedules", response_model=list[PumpSchedule], summary="Pump schedules")
async def list_schedules() -> list[PumpSchedule]:
  return mock_store.list_pump_schedules()


@router.post(
  "/schedules/{schedule_id}/approve",
  response_model=PumpSchedule,
  summary="Approve schedule for execution",
)
async def approve_schedule(schedule_id: str) -> PumpSchedule:
  schedule = mock_store.approve_pump_schedule(schedule_id)
  if schedule is None:
    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Schedule not found")
  return schedule


@router.get("/stations", response_model=list[PumpStation], summary="Pump station status")
async def list_pump_stations() -> list[PumpStation]:
  return mock_store.list_pump_stations()


@router.get("/reservoirs", response_model=list[ReservoirStatus], summary="Reservoir storage levels")
async def list_reservoirs() -> list[ReservoirStatus]:
  return mock_store.list_reservoirs()

