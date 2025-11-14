# Water Distribution Management System — Quick Start Guide

This guide provides all the commands you need to run the **Backend** (FastAPI) and **Frontend** (React + Vite) on Windows PowerShell.

---

## 📋 Prerequisites

- **Python 3.12+** (installed and on PATH)
- **Node.js 18+** with npm (installed and on PATH)
- **Git** (optional, for version control)

### Check installations

```powershell
python --version
node --version
npm --version
```

---

## 🚀 Quick Start (Two Terminals)

### Terminal 1: Backend Server

Open PowerShell and navigate to the backend folder:

```powershell
Set-Location "C:\Users\aggra\Downloads\Water Distribution Management System\Water Distribution Management System\backend"
```

Create and activate virtual environment (first time only):

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -U pip
pip install -r requirements.txt
```

Start the FastAPI server:

```powershell
uvicorn app.main:app --reload --port 8000 --host 127.0.0.1
```

Expected output:
```
INFO:     Uvicorn running on http://127.0.0.1:8000 (Press CTRL+C to quit)
INFO:     Application startup complete.
```

✅ **Backend is ready at:** `http://127.0.0.1:8000`
📖 **API Docs available at:** `http://127.0.0.1:8000/api/docs`

---

### Terminal 2: Frontend Server

Open a **new PowerShell window** and navigate to the frontend folder:

```powershell
Set-Location "C:\Users\aggra\Downloads\Water Distribution Management System\Water Distribution Management System\frontend"
```

Install dependencies (first time only):

```powershell
npm install
```

Start the Vite development server:

```powershell
npm run dev
```

Expected output:
```
VITE v7.2.2  ready in 123 ms

➜  Local:   http://localhost:5173/
➜  press h + enter to show help
```

✅ **Frontend is ready at:** `http://localhost:5173`

---

## 📁 Project Structure

```
Water Distribution Management System/
├── backend/                    # FastAPI server (Python)
│   ├── app/
│   │   ├── main.py            # FastAPI app entry point
│   │   ├── routers/           # API endpoints
│   │   ├── schemas/           # Pydantic models
│   │   ├── services/          # Business logic
│   │   └── core/
│   │       └── config.py      # Settings
│   ├── .venv/                 # Python virtual environment
│   ├── requirements.txt        # Python dependencies
│   └── start_server.ps1       # Startup script
│
└── frontend/                   # React + Vite (TypeScript)
    ├── src/
    │   ├── main.tsx           # React entry point
    │   ├── App.tsx            # Main component
    │   ├── pages/             # Page components
    │   ├── components/        # UI components
    │   └── services/          # API client
    ├── package.json           # Node.js dependencies
    ├── vite.config.ts         # Vite configuration
    └── node_modules/          # Node.js packages
```

---

## 🔧 Detailed Setup Instructions

### Backend Setup (Detailed)

**Option A: Using the PowerShell startup script (if execution policy allows)**

```powershell
Set-Location "C:\Users\aggra\Downloads\Water Distribution Management System\Water Distribution Management System\backend"
powershell -ExecutionPolicy Bypass -File .\start_server.ps1
```

**Option B: Manual activation and run (recommended)**

```powershell
# Navigate to backend
Set-Location "C:\Users\aggra\Downloads\Water Distribution Management System\Water Distribution Management System\backend"

# Create virtual environment (first time)
python -m venv .venv

# Activate virtual environment
.\.venv\Scripts\Activate.ps1

# Upgrade pip and install dependencies
pip install -U pip
pip install -r requirements.txt

# Start server with auto-reload
uvicorn app.main:app --reload --port 8000 --host 127.0.0.1
```

**Option C: Run without activation**

```powershell
Set-Location "C:\Users\aggra\Downloads\Water Distribution Management System\Water Distribution Management System\backend"
.\.venv\Scripts\python.exe -m uvicorn app.main:app --reload --port 8000 --host 127.0.0.1
```

### Frontend Setup (Detailed)

**First-time setup:**

```powershell
# Navigate to frontend
Set-Location "C:\Users\aggra\Downloads\Water Distribution Management System\Water Distribution Management System\frontend"

# Install all Node.js dependencies
npm install

# Start Vite dev server
npm run dev
```

**After first setup (subsequent runs):**

```powershell
Set-Location "C:\Users\aggra\Downloads\Water Distribution Management System\Water Distribution Management System\frontend"
npm run dev
```

**Build for production:**

```powershell
npm run build
npm run preview
```

---

## 🌐 Available Endpoints

### Backend (FastAPI)

| Endpoint | Description |
|----------|-------------|
| `GET /` | Health check |
| `GET /api/docs` | Interactive Swagger UI |
| `GET /api/redoc` | ReDoc documentation |
| `GET /api/zones` | List water zones |
| `GET /api/telemetry` | Get telemetry data |
| `GET /api/incidents` | List incidents |
| `GET /api/pumps` | List pumps |
| `GET /api/insights` | Get insights |
| `GET /api/stream` | WebSocket stream (Swagger compatible) |

### Frontend (React)

| Route | Page |
|-------|------|
| `/` | Municipal Dashboard |
| `/citizen-portal` | Citizen Portal |

---

## 🐛 Troubleshooting

### Backend won't start

**Error: "ModuleNotFoundError: No module named 'uvicorn'"**
- Solution: Activate venv and reinstall: `.\.venv\Scripts\Activate.ps1` then `pip install -r requirements.txt`

**Error: "Address already in use :8000"**
- Solution: Change port: `uvicorn app.main:app --reload --port 8001`

**Error: "Cannot run scripts because execution policy"**
- Solution: Use Option B/C above, or run: `powershell -ExecutionPolicy Bypass -File .\start_server.ps1`

### Frontend won't start

**Error: "npm ERR! missing script"**
- Solution: Make sure you're in the `/frontend` folder and `node_modules` exists. Run `npm install` first.

**Error: "EACCES: permission denied"** (rare on Windows)
- Solution: Run PowerShell as Administrator and try again.

**Port 5173 already in use:**
- Solution: Change port: `npm run dev -- --port 3000`

### Connection issues

**Frontend can't reach backend:**
- Ensure backend is running on `http://127.0.0.1:8000`
- Check CORS settings in `backend/app/core/config.py` (currently allows all origins `["*"]`)
- Check browser console (F12) for network errors

---

## 📦 Installing New Dependencies

### Python (Backend)

```powershell
Set-Location "C:\Users\aggra\Downloads\Water Distribution Management System\Water Distribution Management System\backend"
.\.venv\Scripts\Activate.ps1
pip install <package-name>
pip freeze > requirements.txt  # Update requirements.txt
```

### Node.js (Frontend)

```powershell
Set-Location "C:\Users\aggra\Downloads\Water Distribution Management System\Water Distribution Management System\frontend"
npm install <package-name>
npm install -D <dev-package-name>  # For dev dependencies
```

---

## 📚 Useful Commands

### Backend

```powershell
# Deactivate virtual environment
deactivate

# Run tests (if available)
pytest

# Format code
black app/

# Lint code
pylint app/

# Stop server
# Press Ctrl+C in the backend terminal
```

### Frontend

```powershell
# Lint code
npm run lint

# Format code (if Prettier configured)
npm run format

# Production build
npm run build

# Preview production build
npm run preview

# Clean node_modules and reinstall
Remove-Item -Recurse node_modules; npm install
```

---

## ✅ Verification Checklist

- [ ] Backend running on `http://127.0.0.1:8000`
- [ ] Frontend running on `http://localhost:5173`
- [ ] API docs accessible at `http://127.0.0.1:8000/api/docs`
- [ ] Can navigate to `/` and `/citizen-portal` on frontend
- [ ] Network requests from frontend to backend succeed (check console)
- [ ] Both terminals show "ready" or "running" messages

---

## 🆘 Need Help?

1. Check the [Backend README](./backend/README.md)
2. Check the [Frontend README](./frontend/README.md)
3. Review error messages in the terminal carefully
4. Use browser DevTools (F12) to inspect network requests and console logs
5. Check that ports 8000 (backend) and 5173 (frontend) are not in use

---

**Happy developing!** 🎉

---

## ⚙️ Environment variables & mock mode

You can control whether the frontend calls the real backend or uses bundled mock data via Vite env variables.

Create these files under `frontend/` (already added):

- `frontend/.env` — development defaults
- `frontend/.env.development` — development
- `frontend/.env.production` — production values
- `frontend/.env.mock` — quick mock-only mode

Key variables:

```env
VITE_API_BASE="http://127.0.0.1:8000/api"   # backend base URL
VITE_USE_MOCK="false"                       # set to "true" to force mock-only mode
```

Run frontend in mock-only mode (uses `frontend/.env.mock`):

```powershell
cd frontend
vite --mode mock
```

Run frontend with the real backend (development):

```powershell
cd frontend
# ensure VITE_USE_MOCK is false in your env files
npm run dev
```

This setup allows the team to switch between mock and real APIs without editing source files.
