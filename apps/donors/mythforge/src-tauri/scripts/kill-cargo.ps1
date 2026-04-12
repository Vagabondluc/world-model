$procs = Get-Process cargo -ErrorAction SilentlyContinue
if ($procs) {
  foreach ($p in $procs) {
    $id = $p.Id
    Write-Host "Killing cargo PID: $id"
    try {
      Stop-Process -Id $id -Force -ErrorAction Stop
      Write-Host "Killed $id"
    } catch {
      Write-Host ("Failed to kill {0}: {1}" -f $id, $_.Exception.Message)
    }
  }
} else {
  Write-Host "No cargo processes found"
}
