from datetime import datetime, timezone

from app.data import mock_store


def summarize_network_health() -> dict[str, object]:
  telemetry = mock_store.latest_telemetry()
  fairness = mock_store.list_fairness_metrics()
  incidents = mock_store.list_incidents()
  schedules = mock_store.list_pump_schedules()

  return {
    "generated_at": datetime.now(timezone.utc).isoformat(),
    "pressure_psi": telemetry[-1].pressure_psi if telemetry else None,
    "energy_kw": telemetry[-1].energy_kw if telemetry else None,
    "citywide_fairness": fairness[-1].citywide_score if fairness else None,
    "underserved_wards": fairness[-1].underserved_wards if fairness else None,
    "open_incidents": len([incident for incident in incidents if incident.status != "resolved"]),
    "pending_schedules": len([schedule for schedule in schedules if schedule.status == "scheduled"]),
  }

