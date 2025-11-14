#!/usr/bin/env python3
"""
FastAPI Backend Startup Script
This script sets up the virtual environment, installs dependencies, and runs the server.
Works on Windows, macOS, and Linux.
"""

import os
import sys
import subprocess
import platform
from pathlib import Path

# Colors for terminal output
class Colors:
    CYAN = '\033[96m'
    GREEN = '\033[92m'
    RED = '\033[91m'
    YELLOW = '\033[93m'
    END = '\033[0m'

def print_header():
    """Print the startup header"""
    print(f"\n{Colors.CYAN}========================================{Colors.END}")
    print(f"{Colors.CYAN}Water Distribution Management System{Colors.END}")
    print(f"{Colors.CYAN}Backend Server Startup{Colors.END}")
    print(f"{Colors.CYAN}========================================{Colors.END}\n")

def check_python():
    """Check if Python is available"""
    print(f"{Colors.YELLOW}🔍 Checking Python installation...{Colors.END}")
    try:
        result = subprocess.run([sys.executable, '--version'], capture_output=True, text=True)
        version = result.stdout.strip() or result.stderr.strip()
        print(f"{Colors.GREEN}✅ Found: {version}{Colors.END}\n")
        return True
    except Exception as e:
        print(f"{Colors.RED}❌ Python not found: {e}{Colors.END}")
        return False

def setup_venv():
    """Create and activate virtual environment"""
    print(f"{Colors.YELLOW}🔧 Setting up virtual environment...{Colors.END}")
    venv_path = Path('.venv')
    
    if not venv_path.exists():
        print("   Creating new virtual environment...")
        try:
            subprocess.run([sys.executable, '-m', 'venv', '.venv'], check=True)
            print(f"{Colors.GREEN}✅ Virtual environment created{Colors.END}\n")
        except subprocess.CalledProcessError as e:
            print(f"{Colors.RED}❌ Failed to create virtual environment: {e}{Colors.END}")
            return False
    else:
        print(f"{Colors.GREEN}✅ Virtual environment already exists{Colors.END}\n")
    
    return True

def get_pip_executable():
    """Get the pip executable path"""
    if platform.system() == 'Windows':
        return '.venv\\Scripts\\pip.exe'
    else:
        return '.venv/bin/pip'

def get_python_executable():
    """Get the Python executable path"""
    if platform.system() == 'Windows':
        return '.venv\\Scripts\\python.exe'
    else:
        return '.venv/bin/python'

def upgrade_pip():
    """Upgrade pip"""
    print(f"{Colors.YELLOW}📦 Upgrading pip...{Colors.END}")
    pip_exec = get_pip_executable()
    try:
        subprocess.run([pip_exec, 'install', '-U', 'pip', '--quiet'], check=True)
        print(f"{Colors.GREEN}✅ pip upgraded{Colors.END}\n")
        return True
    except subprocess.CalledProcessError as e:
        print(f"{Colors.RED}❌ Failed to upgrade pip: {e}{Colors.END}")
        return False

def install_dependencies():
    """Install dependencies from requirements.txt"""
    print(f"{Colors.YELLOW}📥 Installing dependencies from requirements.txt...{Colors.END}")
    
    if not Path('requirements.txt').exists():
        print(f"{Colors.RED}❌ requirements.txt not found{Colors.END}")
        return False
    
    pip_exec = get_pip_executable()
    try:
        subprocess.run([pip_exec, 'install', '-r', 'requirements.txt', '--quiet'], check=True)
        print(f"{Colors.GREEN}✅ Dependencies installed{Colors.END}\n")
        return True
    except subprocess.CalledProcessError as e:
        print(f"{Colors.RED}❌ Failed to install dependencies: {e}{Colors.END}")
        return False

def start_server():
    """Start the FastAPI server"""
    print(f"{Colors.GREEN}========================================{Colors.END}")
    print(f"{Colors.GREEN}🌐 Starting FastAPI Server...{Colors.END}")
    print(f"{Colors.GREEN}========================================{Colors.END}\n")
    
    print(f"{Colors.CYAN}📖 API Documentation: http://127.0.0.1:8000/api/docs{Colors.END}")
    print(f"{Colors.CYAN}🏥 Health Check: http://127.0.0.1:8000/{Colors.END}\n")
    print(f"{Colors.YELLOW}Press CTRL+C to stop the server{Colors.END}\n")
    
    try:
        subprocess.run(['uvicorn', 'app.main:app', '--reload', '--port', '8000', '--host', '127.0.0.1'])
    except KeyboardInterrupt:
        print(f"\n{Colors.YELLOW}Server stopped by user{Colors.END}")
        sys.exit(0)
    except FileNotFoundError:
        print(f"{Colors.RED}❌ uvicorn not found. Make sure dependencies are installed.{Colors.END}")
        sys.exit(1)

def main():
    """Main execution"""
    # Change to script directory
    script_dir = Path(__file__).parent.absolute()
    os.chdir(script_dir)
    print(f"📁 Working directory: {script_dir}\n")
    
    print_header()
    
    # Execute steps
    if not check_python():
        sys.exit(1)
    
    if not setup_venv():
        sys.exit(1)
    
    if not upgrade_pip():
        sys.exit(1)
    
    if not install_dependencies():
        sys.exit(1)
    
    start_server()

if __name__ == '__main__':
    main()
