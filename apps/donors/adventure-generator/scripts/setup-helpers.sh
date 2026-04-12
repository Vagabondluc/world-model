#!/bin/bash
# D&D Adventure Generator - Linux/macOS Setup Helper

set -e

echo "======================================"
echo "D&D Adventure Generator Setup"
echo "======================================"
echo ""

# Check for Python 3
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed"
    echo "Please install Python 3.11+ from https://www.python.org/"
    exit 1
fi

# Check for Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed"
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi

echo "✅ Prerequisites found"
echo ""

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
npm install

# Setup Python backend
echo "🐍 Setting up Python backend..."
cd python-backend

# Create virtual environment
if [ ! -d "venv" ]; then
    python3 -m venv venv
    echo "✅ Virtual environment created"
else
    echo "✅ Virtual environment exists"
fi

# Activate and install dependencies
source venv/bin/activate
pip install -r requirements.txt

echo ""
echo "======================================"
echo "🎉 Setup Complete!"
echo "======================================"
echo ""
echo "To start development:"
echo "  Frontend: npm run dev"
echo "  Backend:  npm run backend"
echo ""
