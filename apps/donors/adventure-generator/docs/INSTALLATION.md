# Installation Guide

**Version:** 0.1.0
**Status:** Draft
**Owner:** TBD
**Last Updated:** 2026-02-04

This guide covers multiple installation methods for the D&D Adventure Generator.

## Prerequisites

Before installation, ensure you have:

- **Node.js** (v18+): [Download](https://nodejs.org/)
- **Python** (v3.11+): [Download](https://www.python.org/)
- **Git** (optional): [Download](https://git-scm.com/)

## Installation Methods

### Method 1: Automated Setup (Recommended)

The quickest way to get started:

```bash
npm run setup
```

This will:
- Install frontend dependencies
- Create Python virtual environment
- Install backend dependencies
- Verify all prerequisites

### Method 2: Visual Dashboard

For a guided, visual installation experience:

```bash
npm run setup:dashboard
```

The dashboard provides:
- ✅ System requirements checker
- 📦 One-click installation
- ⚙️ Service management (start/stop backend/frontend)
- 🔧 Configuration editor
- 📋 Real-time installation logs

### Method 3: Platform-Specific Scripts

#### Windows (PowerShell)

```powershell
.\scripts\setup-helpers.ps1
```

#### Linux/macOS (Bash)

```bash
chmod +x scripts/setup-helpers.sh
./scripts/setup-helpers.sh
```

### Method 4: Manual Installation

If you prefer manual control:

#### 1. Frontend Setup

```bash
npm install
```

#### 2. Backend Setup

**Windows:**
```powershell
cd python-backend
python -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt
```

**Linux/macOS:**
```bash
cd python-backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

## Running the Application

### Development Mode

Start both services:

```bash
# Terminal 1 - Frontend
npm run dev

# Terminal 2 - Backend
npm run backend
```

The frontend will be available at `http://localhost:5173`
The backend API will run on `http://localhost:8000`

### Using the Dashboard

Launch the management dashboard to control services:

```bash
npm run setup:dashboard
```

From the dashboard, you can start/stop services with one click.

## Building for Production

### Build Frontend

```bash
npm run build
```

### Build Backend Executable

To create a standalone backend executable:

```bash
npm run build:backend
```

This uses PyInstaller to bundle the Python backend into a single executable that can be distributed without requiring Python to be installed on the target system.

### Build Desktop App

To build the Tauri desktop application:

```bash
npm run build:desktop
```

This will create platform-specific installers in `src-tauri/target/release/bundle/`

## Configuration

### API Keys

Set your Gemini API key in `.env.local`:

```
GEMINI_API_KEY=your_key_here
```

Or use the dashboard's Configuration tab for a visual editor.

### Campaign Folder

On first launch, the app will prompt you to select a campaign folder where all your data will be stored.

## Troubleshooting

### Python Version Issues

If you get errors about Python version:

```bash
python --version  # Should be 3.11 or higher
```

On Linux/macOS, use `python3` instead of `python`.

### Virtual Environment Issues

If the virtual environment fails to activate:

**Windows:**
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

**Linux/macOS:**
```bash
# Ensure the script is executable
chmod +x python-backend/venv/bin/activate
```

### Port Conflicts

If ports 5173 (frontend) or 8000 (backend) are in use:

- Frontend: Edit `vite.config.ts` to change the port
- Backend: Edit `python-backend/main.py` to change the uvicorn port

### Missing Dependencies

If you encounter missing system dependencies:

**Ubuntu/Debian:**
```bash
sudo apt-get install python3-dev python3-venv build-essential
```

**macOS:**
```bash
xcode-select --install
```

### Dashboard Won't Launch

Ensure Tkinter is installed (it's usually included with Python):

**Ubuntu/Debian:**
```bash
sudo apt-get install python3-tk
```

**macOS:**
Tkinter comes with the official Python installer from python.org

## Next Steps

After installation:

1. **Launch the app**: Run `npm run dev`
2. **Select a campaign folder**: Choose where to store your data
3. **Configure AI provider**: Set up Ollama or Gemini in Settings
4. **Start creating**: Generate your first adventure!

## Getting Help

- Check the [README](../README.md) for project overview
- Review [CODEBASE.md](../CODEBASE.md) for architecture details
- File issues on GitHub for bugs or feature requests
