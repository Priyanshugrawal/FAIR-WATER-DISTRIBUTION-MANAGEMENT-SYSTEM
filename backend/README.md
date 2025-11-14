# FWDMS Backend (FastAPI)

This FastAPI service powers the Fair Water Distribution Management System (FWDMS) for Raipur. It exposes REST APIs, WebSocket streams, and AI insight stubs to support the municipal dashboard and citizen applications.

## Getting Started

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate  # On Windows
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

The OpenAPI schema is available at `http://localhost:8000/api/docs`.

## API Highlights

- `GET /api/zones`: Zone metadata, fairness scores, and GeoJSON boundaries.
- `GET /api/telemetry`: Live flow, pressure, and energy telemetry snapshots.
- `GET /api/telemetry/demand-forecast`: AI demand forecast time series.
- `GET /api/incidents`: Combined citizen + sensor incident feed with filters.
- `POST /api/incidents`: Citizen report submission endpoint.
- `GET /api/pumps/schedules`: AI-optimised pump schedules with operations context.
- `POST /api/pumps/schedules/{id}/approve`: Human-in-the-loop schedule approval.
- `GET /api/insights/summary`: Aggregated KPI summary for dashboards.
- `GET /api/pumps/reservoirs`: Tank levels powering sustainability decisions.
- `GET /api/pumps/stations`: Pump health and energy indicators.
- `GET /api/telemetry/fairness`: Historical fairness metrics.
- `GET /api/ws/telemetry`: WebSocket channel streaming telemetry updates every 5 seconds (mock data for now).

## Structure

```
app/
  core/         # Settings & configuration
  data/         # Mock data store for demo
  routers/      # API routers (zones, telemetry, incidents, pumps, insights, ws)
  schemas/      # Pydantic models shared across routers
  services/     # Domain services (AI summarisation stubs etc.)
  main.py       # FastAPI app wiring
```

Replace the in-memory `app/data/mock_store.py` with database repositories or external integrations when connecting to production systems (e.g., PostgreSQL/TimescaleDB, Redis, GIS layers, SCADA feeds).

## Next Steps

- Integrate TimescaleDB for telemetry and reservoir timeseries.
- Add SQLModel/SQLAlchemy ORM models for zone assets and incidents.
- Replace mock AI logic with actual demand forecasting and optimisation services.
- Connect to Raipur Smart City authentication (SAML/OAuth) for operator logins.
- Add background task queue (Celery/Huey) for scheduled AI refresh jobs.

