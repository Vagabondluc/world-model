# Unified Verification Script for D&D Adventure Generator

Write-Host "Starting Unified Project Verification..." -ForegroundColor Cyan

$root = Get-Location
$failCount = 0

# 1. TypeScript Typechecking
Write-Host "`n[1/4] Running TypeScript Typecheck..." -ForegroundColor Yellow
npm run typecheck
if ($LASTEXITCODE -ne 0) {
    Write-Host "TypeScript Typecheck FAILED" -ForegroundColor Red
    $failCount++
}
else {
    Write-Host "TypeScript Typecheck PASSED" -ForegroundColor Green
}

# 2. Frontend Unit Tests (Vitest)
Write-Host "`n[2/4] Running Frontend Unit Tests (Vitest)..." -ForegroundColor Yellow
npm run test -- --run
if ($LASTEXITCODE -ne 0) {
    Write-Host "Frontend Unit Tests FAILED" -ForegroundColor Red
    $failCount++
}
else {
    Write-Host "Frontend Unit Tests PASSED" -ForegroundColor Green
}

# 3. Backend Tests (Pytest)
Write-Host "`n[3/4] Running Backend Tests (Pytest)..." -ForegroundColor Yellow
Set-Location "$root\python-backend"
pytest
if ($LASTEXITCODE -ne 0) {
    Write-Host "Backend Tests FAILED" -ForegroundColor Red
    $failCount++
}
else {
    Write-Host "Backend Tests PASSED" -ForegroundColor Green
}
Set-Location $root

# 4. E2E Baselines (Short Run)
Write-Host "`n[4/4] Running E2E Visual Regression (Baseline)..." -ForegroundColor Yellow
npm run test:e2e -- --project=chromium tests/visual-regression/baseline.spec.ts
if ($LASTEXITCODE -ne 0) {
    Write-Host "E2E Visual Regression FAILED" -ForegroundColor Red
    $failCount++
}
else {
    Write-Host "E2E Visual Regression PASSED" -ForegroundColor Green
}

Write-Host "`n-------------------------------------------"
if ($failCount -eq 0) {
    Write-Host "ALL VERIFICATIONS PASSED!" -ForegroundColor Green -BackgroundColor Black
    exit 0
}
else {
    Write-Host "VERIFICATION FAILED ($failCount component(s))" -ForegroundColor Red -BackgroundColor Black
    exit 1
}
