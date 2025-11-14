@echo off
REM FastAPI Backend Startup Script for Windows Command Prompt
REM This batch script sets up the virtual environment, installs dependencies, and runs the server

setlocal enabledelayedexpansion
cls

echo.
echo ========================================
echo Water Distribution Management System
echo Backend Server Startup
echo ========================================
echo.

REM Get the script's directory
cd /d "%~dp0"
set BACKEND_DIR=%CD%

echo 📁 Working directory: %BACKEND_DIR%
echo.

REM Step 1: Check if Python is available
echo 🔍 Checking Python installation...
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Python not found. Please install Python 3.12+ and add it to PATH
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('python --version') do set PYTHON_VERSION=%%i
echo ✅ Found: %PYTHON_VERSION%
echo.

REM Step 2: Create virtual environment if it doesn't exist
echo 🔧 Setting up virtual environment...
if not exist ".venv" (
    echo    Creating new virtual environment...
    python -m venv .venv
    if errorlevel 1 (
        echo ❌ Failed to create virtual environment
        pause
        exit /b 1
    )
    echo ✅ Virtual environment created
) else (
    echo ✅ Virtual environment already exists
)
echo.

REM Step 3: Activate virtual environment
echo 🚀 Activating virtual environment...
call .venv\Scripts\activate.bat
if errorlevel 1 (
    echo ❌ Failed to activate virtual environment
    pause
    exit /b 1
)
echo ✅ Virtual environment activated
echo.

REM Step 4: Upgrade pip
echo 📦 Upgrading pip...
python -m pip install -U pip --quiet
echo ✅ pip upgraded
echo.

REM Step 5: Install dependencies
echo 📥 Installing dependencies from requirements.txt...
if exist "requirements.txt" (
    pip install -r requirements.txt --quiet
    if errorlevel 1 (
        echo ❌ Failed to install dependencies
        pause
        exit /b 1
    )
    echo ✅ Dependencies installed
) else (
    echo ❌ requirements.txt not found
    pause
    exit /b 1
)
echo.

REM Step 6: Start the server
echo ========================================
echo 🌐 Starting FastAPI Server...
echo ========================================
echo.
echo 📖 API Documentation: http://127.0.0.1:8000/api/docs
echo 🏥 Health Check: http://127.0.0.1:8000/
echo.
echo Press CTRL+C to stop the server
echo.

REM Start uvicorn server
uvicorn app.main:app --reload --port 8000 --host 127.0.0.1

pause
