from datetime import datetime
from typing import Literal, Sequence

from pydantic import BaseModel, Field


PressureLevel = Literal['low', 'medium', 'high']
IncidentSeverity = Literal['low', 'moderate', 'critical']
IncidentSource = Literal['sensor', 'citizen']
IncidentType = Literal['leak', 'low_pressure', 'contamination', 'outage', 'over_pumping']
ScheduleStatus = Literal['scheduled', 'running', 'paused', 'completed']


class GeoJsonPolygon(BaseModel):
  type: Literal['Feature'] = 'Feature'
  properties: dict[str, str | int | float] = Field(default_factory=dict)
  geometry: dict[str, object]


class WaterZone(BaseModel):
  id: str
  name: str
  ward_number: int = Field(..., ge=1)
  population_served: int = Field(..., ge=0)
  supply_hours_per_day: float = Field(..., ge=0, le=24)
  pressure: PressureLevel
  last_updated: datetime
  fairness_score: float = Field(..., ge=0, le=1)
  centroid_latitude: float
  centroid_longitude: float
  geojson: GeoJsonPolygon


class TelemetrySnapshot(BaseModel):
  timestamp: datetime
  zone_id: str | None = None
  flow_ml: float = Field(..., ge=0)
  pressure_psi: float = Field(..., ge=0)
  energy_kw: float = Field(..., ge=0)
  incidents_today: int = Field(..., ge=0)


class DemandForecastPoint(BaseModel):
  timestamp: datetime
  demand_ml: float = Field(..., ge=0)
  zone_id: str | None = None


class PumpSchedule(BaseModel):
  id: str
  pump_id: str
  zone_id: str
  start_time_utc: datetime
  end_time_utc: datetime
  flow_rate_lps: float = Field(..., ge=0)
  status: ScheduleStatus
  recommendation_reason: str | None = None


class PumpStation(BaseModel):
  id: str
  name: str
  connected_zones: Sequence[str]
  status: Literal['operational', 'maintenance', 'offline']
  energy_use_kw: float = Field(..., ge=0)
  health_score: float = Field(..., ge=0, le=1)


class ReservoirStatus(BaseModel):
  id: str
  name: str
  capacity_ml: float = Field(..., ge=0)
  current_level_ml: float = Field(..., ge=0)
  trend: Literal['rising', 'falling', 'stable']
  pumps_connected: Sequence[str]


class IncidentReport(BaseModel):
  id: str
  zone_id: str
  reported_by: IncidentSource
  type: IncidentType
  severity: IncidentSeverity
  description: str
  reported_at: datetime
  status: Literal['open', 'acknowledged', 'resolved']
  coordinates: tuple[float, float]


class CitizenReportCreate(BaseModel):
  name: str
  phone: str
  ward_number: int = Field(..., ge=1)
  zone_id: str
  type: IncidentType
  description: str
  photo_url: str | None = None


class FairnessMetric(BaseModel):
  timestamp: datetime
  citywide_score: float = Field(..., ge=0, le=1)
  underserved_wards: int = Field(..., ge=0)
  complaints_resolved_pct: float = Field(..., ge=0, le=1)
  average_supply_hours: float = Field(..., ge=0, le=24)

