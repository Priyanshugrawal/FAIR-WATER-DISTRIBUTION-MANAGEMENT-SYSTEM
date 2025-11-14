🌊 Fair Water Distribution Management System (FWDMS) RAIPUR

A complete digital solution for fair, transparent, and data-driven water distribution for Raipur Municipal Corporation.
Includes a Municipal Control Dashboard, Citizen Portal, Billing System, and Real-time Monitoring.

🚀 Features
🏛️ Municipal Dashboard

Interactive zone & ward map

Real-time pressure, flow & reservoir telemetry

AI-based pump scheduling

Demand forecasting & fairness score

Incident & leak tracking

Billing verification and supply control

👨‍💼 Citizen Portal

View current bill, due date & payment status

Pay bills & download invoices

Check supply status: Active, Limited, Suspended

Ward-wise supply timings

Water theft alerts & community reports

Personalized recommendations for water saving

🔧 Tech Stack

Frontend: React + Vite + Tailwind + Recharts + Leaflet
Backend: FastAPI + Pydantic + WebSockets + Mock DB

🛠️ How to Run
▶️ Backend
cd backend
python -m venv .venv
.\.venv\Scripts\activate     # On Windows
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000


API Docs:
http://localhost:8000/api/docs

▶️ Frontend
cd frontend
npm install
npm run dev


UI runs at:
http://localhost:5174

