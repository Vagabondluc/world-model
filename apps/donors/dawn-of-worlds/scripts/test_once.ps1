# test_once.ps1
# Runs tests in CI mode (single run, no watch) to prevent background process hangs.
# Usage: ./scripts/test_once.ps1 [optional-file-pattern]

param (
    [string]$Pattern = ""
)

Write-Host "Running tests in CI mode (Single Run)..." -ForegroundColor Cyan

# Use npx vitest run to force single execution
if ($Pattern) {
    npx vitest run $Pattern
} else {
    npx vitest run
}
