# D&D Adventure Generator Rebuild Script

Write-Host "--- Starting Rebuild Process ---" -ForegroundColor Cyan

# 1. Stop app.exe if running
$processName = "app"
$running = Get-Process -Name $processName -ErrorAction SilentlyContinue
if ($running) {
    Write-Host "Stopping running application instances..." -ForegroundColor Yellow
    Stop-Process -Name $processName -Force
    Start-Sleep -Seconds 2
}

# 2. Build the application
Write-Host "Executing Tauri Build..." -ForegroundColor Green
npm run tauri build

if ($LASTEXITCODE -eq 0) {
    Write-Host "Build Successful!" -ForegroundColor Green
}
else {
    Write-Host "Build Failed!" -ForegroundColor Red
    exit $LASTEXITCODE
}
