# D&D Adventure Generator - Windows Setup Helper

Write-Host "======================================"
Write-Host "D&D Adventure Generator Setup"
Write-Host "======================================"
Write-Host ""

# Check for Python
try {
    $pythonVersion = python --version 2>&1
    Write-Host "✅ Python found: $pythonVersion"
}
catch {
    Write-Host "❌ Python is not installed" -ForegroundColor Red
    Write-Host "Please install Python 3.11+ from https://www.python.org/"
    exit 1
}

# Check for Node.js
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js found: $nodeVersion"
}
catch {
    Write-Host "❌ Node.js is not installed" -ForegroundColor Red
    Write-Host "Please install Node.js from https://nodejs.org/"
    exit 1
}

Write-Host ""

# Install frontend dependencies
Write-Host "📦 Installing frontend dependencies..."
npm install

# Setup Python backend
Write-Host "🐍 Setting up Python backend..."
Set-Location python-backend

# Create virtual environment
if (-Not (Test-Path "venv")) {
    python -m venv venv
    Write-Host "✅ Virtual environment created"
}
else {
    Write-Host "✅ Virtual environment exists"
}

# Activate and install dependencies
.\venv\Scripts\activate
pip install -r requirements.txt

Set-Location ..

Write-Host ""
Write-Host "======================================"
Write-Host "🎉 Setup Complete!"
Write-Host "======================================"
Write-Host ""
Write-Host "To start development:"
Write-Host "  Frontend: npm run dev"
Write-Host "  Backend:  npm run backend"
Write-Host ""
