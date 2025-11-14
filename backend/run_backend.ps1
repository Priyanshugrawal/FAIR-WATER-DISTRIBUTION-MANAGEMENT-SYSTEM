# FastAPI Backend Startup Script for Windows PowerShell
# This script sets up the virtual environment, installs dependencies, and runs the server

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Water Distribution Management System" -ForegroundColor Cyan
Write-Host "Backend Server Startup" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Get the script's directory
$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $scriptPath

Write-Host "📁 Working directory: $scriptPath" -ForegroundColor Yellow

# Step 1: Check if Python is available
Write-Host ""
Write-Host "🔍 Checking Python installation..." -ForegroundColor Yellow
$pythonCheck = python --version 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Python not found. Please install Python 3.12+ and add it to PATH" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Found: $pythonCheck" -ForegroundColor Green

# Step 2: Create virtual environment if it doesn't exist
Write-Host ""
Write-Host "🔧 Setting up virtual environment..." -ForegroundColor Yellow
if (-not (Test-Path ".\.venv")) {
    Write-Host "   Creating new virtual environment..."
    python -m venv .venv
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Failed to create virtual environment" -ForegroundColor Red
        exit 1
    }
    Write-Host "✅ Virtual environment created" -ForegroundColor Green
} else {
    Write-Host "✅ Virtual environment already exists" -ForegroundColor Green
}

# Step 3: Activate virtual environment
Write-Host ""
Write-Host "🚀 Activating virtual environment..." -ForegroundColor Yellow
& ".\.venv\Scripts\Activate.ps1"
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to activate virtual environment" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Virtual environment activated" -ForegroundColor Green

# Step 4: Upgrade pip
Write-Host ""
Write-Host "📦 Upgrading pip..." -ForegroundColor Yellow
python -m pip install -U pip --quiet
Write-Host "✅ pip upgraded" -ForegroundColor Green

# Step 5: Install dependencies
Write-Host ""
Write-Host "📥 Installing dependencies from requirements.txt..." -ForegroundColor Yellow
if (Test-Path "requirements.txt") {
    pip install -r requirements.txt --quiet
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Failed to install dependencies" -ForegroundColor Red
        exit 1
    }
    Write-Host "✅ Dependencies installed" -ForegroundColor Green
} else {
    Write-Host "❌ requirements.txt not found" -ForegroundColor Red
    exit 1
}

# Step 6: Start the server
Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "🌐 Starting FastAPI Server..." -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "📖 API Documentation: http://127.0.0.1:8000/api/docs" -ForegroundColor Cyan
Write-Host "🏥 Health Check: http://127.0.0.1:8000/" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press CTRL+C to stop the server" -ForegroundColor Yellow
Write-Host ""

# Start uvicorn server
uvicorn app.main:app --reload --port 8000 --host 127.0.0.1
