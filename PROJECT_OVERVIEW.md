# Fair Water Distribution Management System (FWDMS)
## Project Overview for ChatGPT/AI Discussion

---

## 🎯 Problem Statement

**The Challenge:** Raipur Municipal Corporation struggles with fair and efficient water distribution across the city. Key issues include:

1. **Inequitable Distribution** – Some wards receive water consistently while others face chronic shortages, leading to public frustration and health risks.
2. **Lack of Real-Time Visibility** – Municipal operators have no unified dashboard showing live zone status, pressure, flow rates, and reservoir levels.
3. **Reactive Incident Management** – Citizens report issues through fragmented channels (phone, SMS, walk-ins) with no tracking, status updates, or accountability.
4. **Manual Pump Operations** – Pump schedules are created manually without data-driven optimization, leading to inefficiency and high energy costs.
5. **No Fairness Metrics** – There's no quantified way to measure or track equitable distribution across wards.
6. **Poor Citizen Experience** – Citizens don't know when water will arrive, creating uncertainty and emergency hoarding behavior.

**Solution Approach:** Build an end-to-end digital platform combining:
- A **Municipal Dashboard** for real-time monitoring and AI-driven scheduling
- A **Citizen Portal** for transparency, scheduled supply info, and easy incident reporting
- A scalable **FastAPI backend** with WebSocket streams and AI-ready service stubs
- Data-driven **fairness KPIs** tracking equitable access

---

## 🏗️ Technology Stack

### **Backend**
| Component | Technology | Purpose |
|-----------|-----------|---------|
| **Framework** | FastAPI 0.115.4 | REST API + WebSocket endpoints; automatic OpenAPI docs |
| **Async/ASGI** | Uvicorn 0.32.0 | High-performance async web server |
| **Data Validation** | Pydantic 2.9.2 | Strict schema validation for all requests/responses |
| **Config Management** | Pydantic-Settings 2.6.1 | Environment-driven config (debug, CORS, API prefix) |
| **Database Layer** | SQLAlchemy 2.0.36 | ORM (not yet in use; currently mock data) |
| **Async DB Driver** | asyncpg 0.30.0 | PostgreSQL async driver (ready for production DB) |
| **Migrations** | Alembic 1.14.0 | Database schema versioning |
| **HTTP Client** | httpx 0.27.2 | Async HTTP requests (for external integrations) |
| **Caching/Session** | redis 5.0.8 | Redis client (for WebSocket session & telemetry caching) |
| **Utilities** | python-dateutil 2.9.0 | Date/time parsing and manipulation |

### **Frontend**
| Component | Technology | Purpose |
|-----------|-----------|---------|
| **UI Framework** | React 19.2.0 | Component-based UI with hooks |
| **Language** | TypeScript 5.9.3 | Type-safe JavaScript |
| **Build Tool** | Vite 7.2.2 | Lightning-fast dev server & optimized production bundles |
| **Styling** | Tailwind CSS 3.4.13 | Utility-first CSS framework |
| **Data Fetching** | TanStack React Query 5.90.8 | Server state management, caching, sync |
| **Routing** | React Router 7.9.5 | Client-side navigation (2 main routes) |
| **Charts** | Recharts 3.4.1 | Interactive demand forecast & fairness charts |
| **Maps** | Leaflet 1.9.4 + react-leaflet | Interactive GeoJSON zone visualization |
| **HTTP Client** | Axios 1.13.2 | HTTP requests to backend API |
| **Notifications** | Sonner 2.0.7 | Toast notifications (success/error messages) |
| **State Management** | Zustand 5.0.8 | Lightweight store (context + theme) |
| **UI Components** | Radix UI + Custom | Badge, Button, Card (accessible primitives) |
| **Icons** | Lucide React 0.553.0 | 550+ high-quality SVG icons |

---

## 📂 Project Architecture

```
Fair Water Distribution Management System/
│
├── backend/                          # FastAPI application (Python)
│   ├── app/
│   │   ├── main.py                  # FastAPI app instantiation, middleware (CORS), router includes
│   │   ├── core/
│   │   │   └── config.py            # Settings: project name, API prefix, debug, DB/Redis URLs
│   │   ├── data/
│   │   │   └── mock_store.py        # In-memory mock data generator (zones, telemetry, incidents, etc.)
│   │   ├── routers/                 # API endpoint definitions
│   │   │   ├── zones.py             # GET /api/zones, GET /api/zones/{id}, GET /api/zones/{id}/incidents
│   │   │   ├── telemetry.py         # GET /api/telemetry, /demand-forecast, /fairness
│   │   │   ├── incidents.py         # GET/POST /api/incidents (citizen reports)
│   │   │   ├── pumps.py             # GET /api/pumps/{schedules,stations,reservoirs}, POST /approve
│   │   │   ├── insights.py          # GET /api/insights/summary (KPI aggregation)
│   │   │   └── stream.py            # WebSocket: GET /api/ws/telemetry (5s mock updates)
│   │   ├── schemas/
│   │   │   └── water.py             # Pydantic models: WaterZone, TelemetrySnapshot, IncidentReport, etc.
│   │   └── services/
│   │       └── insights.py          # AI service stubs (demand forecast, anomaly detection)
│   ├── requirements.txt              # Python dependencies
│   ├── run_backend.ps1              # PowerShell startup script
│   ├── run_backend.bat              # Windows batch startup script
│   ├── run_backend.py               # Cross-platform Python startup script
│   └── README.md
│
├── frontend/                         # React + Vite application (TypeScript)
│   ├── src/
│   │   ├── main.tsx                 # React entry point
│   │   ├── App.tsx                  # Root component, router setup
│   │   ├── pages/
│   │   │   ├── municipal-dashboard.tsx  # Operator view: map, telemetry, charts, pump schedules
│   │   │   └── citizen-portal.tsx       # Citizen view: ward selector, supply schedule, reporting form
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   │   └── app-layout.tsx      # Navbar, sidebar navigation
│   │   │   └── ui/
│   │   │       ├── badge.tsx
│   │   │       ├── button.tsx
│   │   │       └── card.tsx
│   │   ├── services/
│   │   │   └── mockApi.ts           # API client (fetchZones, fetchTelemetry, submitReport, etc.)
│   │   ├── types/
│   │   │   └── index.ts             # TypeScript interfaces (WaterZone, IncidentReport, etc.)
│   │   ├── providers/
│   │   │   ├── theme-context.ts
│   │   │   └── theme-provider.tsx
│   │   ├── hooks/
│   │   │   └── use-theme.ts
│   │   ├── data/
│   │   │   └── mockData.ts          # Mock data for frontend fallback
│   │   ├── lib/
│   │   │   └── utils.ts
│   │   ├── index.css
│   │   └── App.css
│   ├── package.json
│   ├── vite.config.ts
│   ├── tsconfig.json
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── eslint.config.js
│   └── README.md
│
├── README.md                        # Main project README
└── QUICKSTART.md                    # Quick-start guide with run commands
```

---

## ✅ Current Implementation Status

### **Backend (FastAPI) — COMPLETE**

#### **Core API Endpoints Implemented:**

1. **Zones Management** (`/api/zones`)
   - `GET /api/zones` – List all 10 mock Raipur zones with fairness scores, pressure levels, GeoJSON boundaries
   - `GET /api/zones/{zone_id}` – Single zone details
   - `GET /api/zones/{zone_id}/incidents` – Zone-specific incidents

2. **Telemetry Stream** (`/api/telemetry`)
   - `GET /api/telemetry` – Latest citywide flow (ML/s), pressure (PSI), energy (kW) snapshots
   - `GET /api/telemetry/fairness` – Historical fairness metrics (30-day window)
   - `GET /api/telemetry/demand-forecast` – AI demand forecast time series (24h horizon)

3. **Incident Management** (`/api/incidents`)
   - `GET /api/incidents` – List incidents with filters: `zone_id`, `status` (open/acknowledged/resolved)
   - `POST /api/incidents` – Citizen report submission (name, phone, ward, description, photo_url)
   - Returns: ID, coordinates, type (leak/low_pressure/contamination/outage/over_pumping), severity

4. **Pump Operations** (`/api/pumps`)
   - `GET /api/pumps/schedules` – AI-recommended schedules (pump ID, zone ID, time window, flow rate, status)
   - `POST /api/pumps/schedules/{id}/approve` – Human-in-the-loop approval workflow
   - `GET /api/pumps/stations` – Pump station health/energy status
   - `GET /api/pumps/reservoirs` – Tank levels (capacity, current, trend)

5. **Insights & Analytics** (`/api/insights`)
   - `GET /api/insights/summary` – Aggregated KPI dashboard (fairness index, underserved wards, alerts)

6. **WebSocket Streaming** (`/api/ws/telemetry`)
   - Live telemetry updates every 5 seconds (mock data, ready for Redis broadcast)

#### **Key Features:**
- ✅ Pydantic schema validation on all inputs/outputs
- ✅ CORS middleware configured (allows `*` for development)
- ✅ Mock in-memory data store (no DB required for demo)
- ✅ OpenAPI/Swagger documentation at `/api/docs` and `/api/redoc`
- ✅ Type-safe error handling (HTTPException)
- ✅ Environment-driven configuration (debug, API prefix, hosts)

#### **Not Yet Implemented (Production Readiness):**
- ❌ Database persistence (currently mock only)
- ❌ Authentication/authorization (SAML/OAuth for operators)
- ❌ Real AI models (demand forecast & optimization stubs only)
- ❌ Background task queue (Celery/Huey)
- ❌ Redis caching/session management
- ❌ Logging & monitoring
- ❌ Unit tests & integration tests

---

### **Frontend (React + Vite) — COMPLETE**

#### **Pages Implemented:**

**1. Municipal Dashboard** (`/`)
- **Interactive Map:** Leaflet map showing all 10 Raipur zones as GeoJSON polygons, color-coded by pressure (low=orange, medium=blue, high=green)
- **Telemetry Cards:** Display live flow, pressure, energy, and incident counts
- **Demand Forecast Chart:** Recharts area chart showing 24h demand predictions
- **Fairness Metrics:** Historical fairness trend (line chart), city-wide index
- **Active Incidents Table:** Severity-colored badges (low/moderate/critical), status filters, zone links
- **Pump Status Cards:** Station health, energy consumption, connected zones
- **Reservoir Levels:** Current capacity %, trend indicators (rising/falling/stable)
- **AI Schedule Approval Panel:** Pending pump schedules with human approval workflow
- **Real-Time Refresh:** React Query polling (5s default), manual refresh button

**2. Citizen Portal** (`/citizen-portal`)
- **Ward Selector:** Dropdown to select zone (user facing)
- **Supply Schedule Timeline:** Monday–Sunday selector, displays water availability windows per day
- **Fairness Indicator:** Snapshot of city fairness index, underserved ward alerts
- **Active Incidents Feed:** Zone-specific incidents with severity badges
- **Complaint Submission Form:** 
  - Name, phone, ward number, zone selection
  - Incident type (leak, low_pressure, contamination, outage, over_pumping)
  - Description, optional photo URL
  - Submit button with loading state
  - Toast confirmation (success/error)
- **Proactive Tips:** Water conservation suggestions, alert notifications

#### **Key Features:**
- ✅ Component-based architecture (Button, Card, Badge, Layout)
- ✅ TanStack React Query for server state (caching, automatic refetching)
- ✅ Leaflet map with GeoJSON rendering + interactive tooltips
- ✅ Recharts for demand forecast & fairness visualizations
- ✅ Form validation & submission with Sonner toast notifications
- ✅ TypeScript type safety (interfaces for WaterZone, IncidentReport, etc.)
- ✅ Responsive design (Tailwind CSS)
- ✅ Theme provider (light/dark mode ready)
- ✅ React Router for client-side routing

#### **Not Yet Implemented (Production Readiness):**
- ❌ Authentication UI (login/logout)
- ❌ Real API integration (currently using mockApi client)
- ❌ WebSocket telemetry updates on dashboard (built on backend, not connected)
- ❌ Map layer toggles (zones, incidents, pump stations)
- ❌ Export/reporting (PDF, CSV)
- ❌ Mobile app (web-only, responsive design ready)
- ❌ E2E tests (Cypress/Playwright)
- ❌ Accessibility audit (WCAG)

---

## 🔄 Data Flow

### **Typical Workflow:**

1. **Operator Views Municipal Dashboard**
   - Browser: `GET http://localhost:5173/`
   - React Query: `fetch /api/zones`, `/api/telemetry`, `/api/incidents`, `/api/pumps/stations`, `/api/pumps/reservoirs`
   - Leaflet renders zone map
   - Recharts renders demand forecast chart
   - Every 5s: optional WebSocket from `/api/ws/telemetry`

2. **AI System Recommends Pump Schedule**
   - Backend: `POST /api/pumps/schedules` (AI logic runs)
   - Status: "scheduled"
   - Frontend: Display in approval panel

3. **Operator Approves & Executes**
   - Frontend: `POST /api/pumps/schedules/{id}/approve`
   - Backend: Updates status to "running"
   - Pumps start per schedule

4. **Citizen Reports Water Issue**
   - Browser: `GET http://localhost:5173/citizen-portal`
   - Citizen fills form (ward, incident type, description)
   - Submits: `POST /api/incidents` (CitizenReportCreate)
   - Backend stores incident
   - Frontend shows toast success
   - Operator sees new incident on dashboard

---

## 🎨 Data Models (Pydantic Schemas)

### **Core Entities**

```python
# Water Zone
WaterZone(
  id: str                    # "zone-1"
  name: str                  # "Ward 1 – Central"
  ward_number: int           # 1–10
  population_served: int     # 50,000–200,000
  supply_hours_per_day: float  # 2–12 hours
  pressure: Literal['low', 'medium', 'high']
  fairness_score: float      # 0–1 (higher = more equitable)
  geojson: GeoJsonPolygon    # Leaflet polygon
)

# Incident Report
IncidentReport(
  id: str
  zone_id: str
  reported_by: Literal['sensor', 'citizen']
  type: Literal['leak', 'low_pressure', 'contamination', 'outage', 'over_pumping']
  severity: Literal['low', 'moderate', 'critical']
  description: str
  reported_at: datetime
  status: Literal['open', 'acknowledged', 'resolved']
  coordinates: tuple[float, float]
)

# Telemetry Snapshot
TelemetrySnapshot(
  timestamp: datetime
  zone_id: str | None
  flow_ml: float              # Milliliters per second
  pressure_psi: float         # Pounds per square inch
  energy_kw: float            # Kilowatts
  incidents_today: int
)

# Pump Schedule
PumpSchedule(
  id: str
  pump_id: str
  zone_id: str
  start_time_utc: datetime
  end_time_utc: datetime
  flow_rate_lps: float        # Liters per second
  status: Literal['scheduled', 'running', 'paused', 'completed']
  recommendation_reason: str  # Why AI recommended this schedule
)

# Fairness Metric
FairnessMetric(
  timestamp: datetime
  city_fairness_index: float  # 0–1 (aggregate fairness)
  underserved_wards: list[int]
  overserved_wards: list[int]
)
```

---

## 🚀 How to Run

### **Quick Start (Two Terminals)**

**Terminal 1 — Backend:**
```powershell
Set-Location "...\backend"
python run_backend.py
# Or: powershell -ExecutionPolicy Bypass -File .\run_backend.ps1
# Or: .\run_backend.bat
```
Backend ready at `http://127.0.0.1:8000`

**Terminal 2 — Frontend:**
```powershell
Set-Location "...\frontend"
npm install  # First time only
npm run dev
```
Frontend ready at `http://localhost:5173`

### **Access Points:**
- **Municipal Dashboard:** `http://localhost:5173/`
- **Citizen Portal:** `http://localhost:5173/citizen-portal`
- **API Docs:** `http://127.0.0.1:8000/api/docs` (Swagger UI)
- **API ReDoc:** `http://127.0.0.1:8000/api/redoc`

---

## 🔮 Next Steps (Roadmap)

### **Phase 2: Production-Ready Backend**
1. Replace `mock_store.py` with PostgreSQL + SQLAlchemy ORM
2. Add authentication (Raipur Smart City SSO / OAuth2)
3. Integrate real AI services (demand forecast ML model, optimizer)
4. Set up Redis for WebSocket broadcast & caching
5. Add background task queue (Celery) for scheduled AI runs
6. Logging, monitoring, APM integration

### **Phase 3: Production-Ready Frontend**
1. Connect to real backend API (replace mockApi)
2. Implement WebSocket live telemetry stream
3. Add login/authentication UI
4. Build mobile app (React Native / Flutter)
5. Add e-commerce/billing integration
6. SMS/WhatsApp notifications

### **Phase 4: Deployment & Scaling**
1. Containerize (Docker, Kubernetes)
2. CI/CD pipeline (GitHub Actions / GitLab CI)
3. Cloud hosting (AWS, Azure, GCP)
4. Database replication & backup strategy
5. Load testing & performance optimization

---

## 📞 Key Team Contacts & Responsibilities

| Component | Owner | Priority |
|-----------|-------|----------|
| Backend API | Backend Team | High |
| Frontend UI | Frontend Team | High |
| Database & ORM | Data Eng | Medium |
| AI/ML Services | Data Science | Medium |
| Authentication | DevOps/Security | High |
| Deployment & Infrastructure | DevOps | High |

---

## 📊 Mock Data Characteristics

The system ships with **10 mock Raipur zones** (wards 1–10):
- Population: 50,000–200,000 per zone
- Supply hours: 2–12 hours per day (variable fairness)
- Fairness score: 0.3–0.95 (simulates current inequity)
- Telemetry: 50–150 ML/s flow, 10–80 PSI, 5–50 kW energy
- Incidents: 20–50 across all zones (mix of sensor + citizen reported)
- Pump stations: 8 stations connecting to multiple zones
- Reservoirs: 5 tanks with varying levels (rising/falling/stable trends)

---

## 💡 Key Insights & Metrics

1. **Fairness Index** – Aggregated measure of equitable supply across wards (0–1, higher = better)
2. **Underserved Wards** – Wards with <8 hours supply per day flagged for priority attention
3. **Incident Response Time** – Gap between citizen report and operator acknowledgment
4. **Pump Efficiency** – Energy used per ML delivered (kW/ML) — lower is better
5. **Reservoir Trend** – Rising/falling/stable status to predict shortages proactively

---

## ❓ FAQs for ChatGPT Context

**Q: Is this production-ready?**
A: No. This is a **reference implementation** and **proof-of-concept**. Mock data only. Replace with real DB, auth, and AI models before deployment.

**Q: Can it scale to other cities?**
A: Yes. The architecture is generic (zones, telemetry, incidents, pumps). Parameterize for any city's geography, ward count, and supply infrastructure.

**Q: How does fairness get calculated?**
A: Currently a mock stub. Real calculation would compare supply hours vs. population demand, normalized across all zones, updated hourly/daily.

**Q: What's the WebSocket for?**
A: Real-time telemetry push from IoT sensors (pressure, flow, energy) every 5 seconds. Currently mock; ready for Redis pub/sub in production.

**Q: Why two separate frontends (dashboard + portal)?**
A: Operator needs high-level ops view (pump approval, alerts); citizens need transparency (schedule, fairness, complaints). Different UX patterns.

**Q: Can citizens access operator dashboard?**
A: No, by design. Portal has read-only fairness/schedule info. Dashboard (with approval controls) is operator-only, protected by auth.

---

**Last Updated:** November 14, 2025  
**Version:** 1.0 (Reference Implementation)
