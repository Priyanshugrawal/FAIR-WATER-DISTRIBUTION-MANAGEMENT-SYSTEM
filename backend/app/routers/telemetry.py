from fastapi import APIRouter

from app.data import mock_store
from app.schemas.water import DemandForecastPoint, FairnessMetric, TelemetrySnapshot

router = APIRouter(prefix="/telemetry", tags=["telemetry"])


@router.get("/", response_model=list[TelemetrySnapshot], summary="Latest city telemetry")
async def get_citywide_telemetry() -> list[TelemetrySnapshot]:
  return mock_store.latest_telemetry()


@router.get("/fairness", response_model=list[FairnessMetric], summary="Fairness metrics history")
async def get_fairness_metrics() -> list[FairnessMetric]:
  return mock_store.list_fairness_metrics()


@router.get("/demand-forecast", response_model=list[DemandForecastPoint], summary="Demand forecast horizon")
async def get_demand_forecast() -> list[DemandForecastPoint]:
  return mock_store.list_demand_forecast()

