# Create compact export of DnD Adventure Generator - Fast Version
# Excludes node_modules, build artifacts, and other large files

$exportName = "dnd-adventure-generator-source-$(Get-Date -Format 'yyyy-MM-dd').zip"
$exportPath = Join-Path (Get-Location) $exportName

Write-Host "Creating compact export: $exportName" -ForegroundColor Cyan

# Remove old export if exists
if (Test-Path $exportPath) {
    Remove-Item $exportPath -Force
    Write-Host "Removed existing export" -ForegroundColor Yellow
}

# Define exclusion patterns
$excludePatterns = @(
    '*\node_modules\*',
    '*\dist\*',
    '*\dist-ssr\*',
    '*\.venv\*',
    '*\venv\*',
    '*\env\*',
    '*\__pycache__\*',
    '*\.pytest_cache\*',
    '*\src-tauri\target\*',
    '*\python-backend\build\*',
    '*\python-backend\dist\*',
    '*\temp_lazy_gm_tools\*',
    '*\srd_export\*',
    '*\rag\*',
    '*\.npm-cache\*',
    '*\playwright-report\*',
    '*\test-results\*',
    '*\.git\*',
    '*.exe',
    '*.dll',
    '*.bin',
    '*.pdb',
    '*_errors*.txt',
    'test_output*.txt',
    '*.log'
)

Write-Host "Collecting files to include..." -ForegroundColor Yellow

# Get all files, excluding the patterns
$filesToZip = Get-ChildItem -Path . -Recurse -File | Where-Object {
    $file = $_
    $shouldExclude = $false
    
    foreach ($pattern in $excludePatterns) {
        if ($file.FullName -like $pattern) {
            $shouldExclude = $true
            break
        }
    }
    
    -not $shouldExclude
}

$fileCount = $filesToZip.Count
Write-Host "Found $fileCount files to include" -ForegroundColor Cyan

# Create the zip
Write-Host "Creating zip archive..." -ForegroundColor Yellow

# Use .NET compression for better performance
Add-Type -Assembly System.IO.Compression.FileSystem
$compressionLevel = [System.IO.Compression.CompressionLevel]::Optimal
$archive = [System.IO.Compression.ZipFile]::Open($exportPath, 'Create')

$i = 0
foreach ($file in $filesToZip) {
    $i++
    if ($i % 100 -eq 0) {
        Write-Host "  Progress: $i / $fileCount files..." -ForegroundColor Gray
    }
    
    $relativePath = $file.FullName.Substring((Get-Location).Path.Length + 1)
    [System.IO.Compression.ZipFileExtensions]::CreateEntryFromFile($archive, $file.FullName, $relativePath, $compressionLevel) | Out-Null
}

$archive.Dispose()

# Show results
$zipSize = (Get-Item $exportPath).Length / 1MB
Write-Host "`nExport complete!" -ForegroundColor Green
Write-Host "File: $exportPath" -ForegroundColor Cyan
Write-Host "Size: $([math]::Round($zipSize, 2)) MB" -ForegroundColor Cyan
Write-Host "Files included: $fileCount" -ForegroundColor Cyan
