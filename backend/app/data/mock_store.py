from __future__ import annotations

from datetime import datetime, timezone
from typing import Final

from dateutil import tz

from app.schemas.water import (
  CitizenReportCreate,
  DemandForecastPoint,
  FairnessMetric,
  IncidentReport,
  PumpSchedule,
  PumpStation,
  ReservoirStatus,
  TelemetrySnapshot,
  WaterZone,
)

IST = tz.gettz("Asia/Kolkata")
UTC = timezone.utc

_zones: Final[list[WaterZone]] = [
  WaterZone(
    id="zone-1",
    name="Telibandha",
    ward_number=15,
    population_served=52_000,
    supply_hours_per_day=6,
    pressure="medium",
    last_updated=datetime(2025, 11, 13, 9, 15, tzinfo=UTC),
    fairness_score=0.82,
    centroid_latitude=21.2514,
    centroid_longitude=81.6296,
    geojson={
      "type": "Feature",
      "properties": {"name": "Telibandha"},
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [81.6265, 21.2488],
            [81.6345, 21.2488],
            [81.6352, 21.2546],
            [81.6272, 21.2554],
            [81.6265, 21.2488],
          ]
        ],
      },
    },
  ),
  WaterZone(
    id="zone-2",
    name="Shankar Nagar",
    ward_number=25,
    population_served=47_000,
    supply_hours_per_day=7.5,
    pressure="high",
    last_updated=datetime(2025, 11, 13, 9, 15, tzinfo=UTC),
    fairness_score=0.9,
    centroid_latitude=21.2432,
    centroid_longitude=81.6641,
    geojson={
      "type": "Feature",
      "properties": {"name": "Shankar Nagar"},
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [81.6605, 21.2391],
            [81.6689, 21.2391],
            [81.6689, 21.2472],
            [81.6601, 21.2472],
            [81.6605, 21.2391],
          ]
        ],
      },
    },
  ),
  WaterZone(
    id="zone-3",
    name="Pandri",
    ward_number=12,
    population_served=61_000,
    supply_hours_per_day=5.5,
    pressure="low",
    last_updated=datetime(2025, 11, 13, 9, 15, tzinfo=UTC),
    fairness_score=0.68,
    centroid_latitude=21.2459,
    centroid_longitude=81.6311,
    geojson={
      "type": "Feature",
      "properties": {"name": "Pandri"},
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [81.6274, 21.2421],
            [81.6359, 21.2421],
            [81.6363, 21.2504],
            [81.6282, 21.2504],
            [81.6274, 21.2421],
          ]
        ],
      },
    },
  ),
]

_telemetry: Final[list[TelemetrySnapshot]] = [
  TelemetrySnapshot(
    timestamp=datetime(2025, 11, 13, 8, 0, tzinfo=UTC),
    flow_ml=42.3,
    pressure_psi=58,
    energy_kw=1240,
    incidents_today=2,
  ),
  TelemetrySnapshot(
    timestamp=datetime(2025, 11, 13, 9, 0, tzinfo=UTC),
    flow_ml=44.1,
    pressure_psi=60,
    energy_kw=1205,
    incidents_today=3,
  ),
  TelemetrySnapshot(
    timestamp=datetime(2025, 11, 13, 10, 0, tzinfo=UTC),
    flow_ml=46.7,
    pressure_psi=61,
    energy_kw=1278,
    incidents_today=3,
  ),
]

_fairness: Final[list[FairnessMetric]] = [
  FairnessMetric(
    timestamp=datetime(2025, 11, 11, tzinfo=UTC),
    citywide_score=0.74,
    underserved_wards=7,
    complaints_resolved_pct=0.71,
    average_supply_hours=5.8,
  ),
  FairnessMetric(
    timestamp=datetime(2025, 11, 12, tzinfo=UTC),
    citywide_score=0.79,
    underserved_wards=6,
    complaints_resolved_pct=0.77,
    average_supply_hours=6.1,
  ),
  FairnessMetric(
    timestamp=datetime(2025, 11, 13, tzinfo=UTC),
    citywide_score=0.83,
    underserved_wards=5,
    complaints_resolved_pct=0.82,
    average_supply_hours=6.5,
  ),
]

_incidents: list[IncidentReport] = [
  IncidentReport(
    id="incident-1",
    zone_id="zone-3",
    reported_by="sensor",
    type="leak",
    severity="critical",
    description="Rapid pressure drop detected near Pandri Flyover.",
    reported_at=datetime(2025, 11, 13, 9, 5, tzinfo=UTC),
    status="acknowledged",
    coordinates=(21.2469, 81.6342),
  ),
  IncidentReport(
    id="incident-2",
    zone_id="zone-1",
    reported_by="citizen",
    type="low_pressure",
    severity="moderate",
    description="Citizen-reported low pressure on Street 14.",
    reported_at=datetime(2025, 11, 13, 6, 40, tzinfo=UTC),
    status="resolved",
    coordinates=(21.2519, 81.6305),
  ),
  IncidentReport(
    id="incident-3",
    zone_id="zone-2",
    reported_by="sensor",
    type="over_pumping",
    severity="low",
    description="Automated alert: flow exceeded target by 12%.",
    reported_at=datetime(2025, 11, 13, 7, 50, tzinfo=UTC),
    status="open",
    coordinates=(21.2445, 81.6662),
  ),
]

_pump_schedules: list[PumpSchedule] = [
  PumpSchedule(
    id="sched-1",
    pump_id="pump-1",
    zone_id="zone-1",
    start_time_utc=datetime(2025, 11, 13, 5, tzinfo=UTC),
    end_time_utc=datetime(2025, 11, 13, 7, 30, tzinfo=UTC),
    flow_rate_lps=450,
    status="completed",
    recommendation_reason="Meet morning demand with moderate storage levels.",
  ),
  PumpSchedule(
    id="sched-2",
    pump_id="pump-2",
    zone_id="zone-2",
    start_time_utc=datetime(2025, 11, 13, 8, tzinfo=UTC),
    end_time_utc=datetime(2025, 11, 13, 10, tzinfo=UTC),
    flow_rate_lps=500,
    status="running",
    recommendation_reason="AI: Maintain high fairness score and replenish tank.",
  ),
  PumpSchedule(
    id="sched-3",
    pump_id="pump-3",
    zone_id="zone-3",
    start_time_utc=datetime(2025, 11, 13, 11, tzinfo=UTC),
    end_time_utc=datetime(2025, 11, 13, 13, tzinfo=UTC),
    flow_rate_lps=380,
    status="scheduled",
    recommendation_reason="AI: Catch up to meet evening demand and reduce leaks.",
  ),
]

_pump_stations: Final[list[PumpStation]] = [
  PumpStation(
    id="pump-1",
    name="Pandri Booster Station",
    connected_zones=["zone-1", "zone-3"],
    status="operational",
    energy_use_kw=420,
    health_score=0.92,
  ),
  PumpStation(
    id="pump-2",
    name="Raipur Central Station",
    connected_zones=["zone-2"],
    status="operational",
    energy_use_kw=365,
    health_score=0.88,
  ),
  PumpStation(
    id="pump-3",
    name="Industrial Estate Pump",
    connected_zones=["zone-3"],
    status="maintenance",
    energy_use_kw=150,
    health_score=0.65,
  ),
]

_reservoirs: Final[list[ReservoirStatus]] = [
  ReservoirStatus(
    id="reservoir-1",
    name="Kharun Reservoir",
    capacity_ml=32,
    current_level_ml=24.5,
    trend="falling",
    pumps_connected=["pump-1", "pump-2"],
  ),
  ReservoirStatus(
    id="reservoir-2",
    name="Budhapara Storage",
    capacity_ml=18,
    current_level_ml=16.1,
    trend="stable",
    pumps_connected=["pump-3"],
  ),
]

_demand_forecast: list[DemandForecastPoint] = [
  DemandForecastPoint(
    timestamp=datetime(2025, 11, 13, 0, 0, tzinfo=IST),
    demand_ml=35,
  ),
  DemandForecastPoint(
    timestamp=datetime(2025, 11, 13, 4, 0, tzinfo=IST),
    demand_ml=42,
  ),
  DemandForecastPoint(
    timestamp=datetime(2025, 11, 13, 8, 0, tzinfo=IST),
    demand_ml=55,
  ),
  DemandForecastPoint(
    timestamp=datetime(2025, 11, 13, 12, 0, tzinfo=IST),
    demand_ml=48,
  ),
  DemandForecastPoint(
    timestamp=datetime(2025, 11, 13, 16, 0, tzinfo=IST),
    demand_ml=52,
  ),
  DemandForecastPoint(
    timestamp=datetime(2025, 11, 13, 20, 0, tzinfo=IST),
    demand_ml=38,
  ),
  DemandForecastPoint(
    timestamp=datetime(2025, 11, 14, 0, 0, tzinfo=IST),
    demand_ml=32,
  ),
]


def list_zones() -> list[WaterZone]:
  return list(_zones)


def latest_telemetry() -> list[TelemetrySnapshot]:
  return list(_telemetry)


def list_fairness_metrics() -> list[FairnessMetric]:
  return list(_fairness)


def list_incidents(zone_id: str | None = None, status: str | None = None) -> list[IncidentReport]:
  incidents = _incidents
  if zone_id:
    incidents = [incident for incident in incidents if incident.zone_id == zone_id]
  if status:
    incidents = [incident for incident in incidents if incident.status == status]
  return list(incidents)


def upsert_citizen_incident(payload: CitizenReportCreate) -> IncidentReport:
  incident_id = f"citizen-{len(_incidents) + 1}"
  incident = IncidentReport(
    id=incident_id,
    zone_id=payload.zone_id,
    reported_by="citizen",
    type=payload.type,
    severity="moderate",
    description=payload.description,
    reported_at=datetime.now(tz=UTC),
    status="open",
    coordinates=(21.251, 81.63),
  )
  _incidents.append(incident)
  return incident


def list_pump_schedules() -> list[PumpSchedule]:
  return list(_pump_schedules)


def approve_pump_schedule(schedule_id: str) -> PumpSchedule | None:
  for schedule in _pump_schedules:
    if schedule.id == schedule_id:
      schedule.status = "running"
      return schedule
  return None


def list_pump_stations() -> list[PumpStation]:
  return list(_pump_stations)


def list_reservoirs() -> list[ReservoirStatus]:
  return list(_reservoirs)


def list_demand_forecast() -> list[DemandForecastPoint]:
  return list(_demand_forecast)

