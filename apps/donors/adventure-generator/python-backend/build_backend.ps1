<#
.SYNOPSIS
    Builds the Python Backend into a standalone Windows Executable using PyInstaller.
.DESCRIPTION
    This script installs necessary build tools (PyInstaller) and bundles the FastAPI application,
    core framework, and all add-ons into a single .exe file located in the 'dist' folder.
#>

Write-Host "🚀 Starting Backend Build Process..." -ForegroundColor Cyan

# 1. Ensure requirements are installed
Write-Host "📦 Checking dependencies..."
pip install -r requirements.txt
pip install pyinstaller

# 2. Cleanup previous builds with Retries
function Force-Cleanup {
    param($Path)
    if (Test-Path $Path) {
        Write-Host "🧹 Cleaning $Path..."
        $maxRetries = 5
        $retryCount = 0
        while ($retryCount -lt $maxRetries) {
            try {
                Remove-Item -Path $Path -Recurse -Force -ErrorAction Stop
                break
            }
            catch {
                Write-Warning "Creating lock on $Path, retrying in 2 seconds... ($($retryCount+1)/$maxRetries)"
                Start-Sleep -Seconds 2
                $retryCount++
            }
        }
    }
}

Force-Cleanup "build"
Force-Cleanup "dist"
if (Test-Path "dnd-backend.spec") { Remove-Item -Path "dnd-backend.spec" -Force }

# 3. Execution PyInstaller
# --onefile: Bundle everything into one .exe
# --name: Name of the output file
# --clean: Clean cache
# --hidden-import: Explicitly import modules that might be missed (often needed for uvicorn/fastapi)
Write-Host "🔨 Compiling with PyInstaller..."

# Common hidden imports for FastAPI/Uvicorn/Instructor stack
$HiddenImports = @(
    "--hidden-import=uvicorn.logging",
    "--hidden-import=uvicorn.loops",
    "--hidden-import=uvicorn.loops.auto",
    "--hidden-import=uvicorn.protocols",
    "--hidden-import=uvicorn.protocols.http",
    "--hidden-import=uvicorn.protocols.http.auto",
    "--hidden-import=uvicorn.lifespan",
    "--hidden-import=uvicorn.lifespan.on",
    "--hidden-import=chromadb",
    "--hidden-import=tiktoken_ext.openai_public",
    "--hidden-import=tiktoken_ext",
    # EXCLUDE heavy libraries not needed for Ollama-only embedding
    "--exclude-module=torch",
    "--exclude-module=nvidia",
    "--exclude-module=cuda",
    "--exclude-module=cudnn",
    "--exclude-module=onnxruntime",
    "--exclude-module=sympy",
    "--exclude-module=scipy",
    "--exclude-module=matplotlib",
    "--exclude-module=pandas"
)

# Run PyInstaller via python module
# --noconsole: Hide the command prompt (since we have a Tkinter GUI now)
python -m PyInstaller --noconfirm --onefile --clean --noconsole --name "dnd-backend-gui" @HiddenImports launcher_gui.py

# 4. Success Check
if (Test-Path "dist/dnd-backend-gui.exe") {
    Write-Host "✅ Build Success!" -ForegroundColor Green
    Write-Host "📂 Executable created at: $(Get-Location)\dist\dnd-backend-gui.exe"
}
else {
    Write-Host "❌ Build Failed!" -ForegroundColor Red
    exit 1
}
