$procIds = @()
try {
  $procIds = Get-NetTCPConnection -LocalPort 3000 -ErrorAction Stop | Select-Object -ExpandProperty OwningProcess -Unique
} catch {
  $procIds = netstat -aon | findstr ':3000' | ForEach-Object { ($_ -split '\s+')[-1].Trim() } | Sort-Object -Unique
}

if ($procIds) {
  foreach ($procId in $procIds) {
    $id = [int]$procId
    Write-Host "Killing PID $id"
    try {
      Stop-Process -Id $id -Force -ErrorAction Stop
      Write-Host "Killed $id"
    } catch {
      Write-Host ("Failed to kill {0}: {1}" -f $id, $_.Exception.Message)
    }
  }
} else {
  Write-Host "No process listening on port 3000"
}
