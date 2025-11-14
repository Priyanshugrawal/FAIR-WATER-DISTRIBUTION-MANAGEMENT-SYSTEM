# FastAPI Server Startup Script
Set-Location $PSScriptRoot
.\.venv\Scripts\Activate.ps1
Write-Host "Starting FastAPI server on http://localhost:8000" -ForegroundColor Green
Write-Host "API docs available at http://localhost:8000/api/docs" -ForegroundColor Cyan
uvicorn app.main:app --reload --port 8000 --host 0.0.0.0

