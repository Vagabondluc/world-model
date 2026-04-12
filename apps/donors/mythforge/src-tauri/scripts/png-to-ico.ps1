$pngPath = 'D:\coding\AI\Chat-Gpt-Agent\mythforge\src-tauri\icons\icon.png'
$icoPath = 'D:\coding\AI\Chat-Gpt-Agent\mythforge\src-tauri\icons\icon.ico'

if (-not (Test-Path $pngPath)) {
  Write-Host "PNG not found: $pngPath"
  exit 1
}

$pngBytes = [System.IO.File]::ReadAllBytes($pngPath)
$fs = [System.IO.File]::OpenWrite($icoPath)
$bw = New-Object System.IO.BinaryWriter($fs)

# ICONDIR
$bw.Write([uint16]0) # reserved
$bw.Write([uint16]1) # type = icon
$bw.Write([uint16]1) # count = 1

# ICONDIRENTRY
$bw.Write([byte]0) # width (0 means 256)
$bw.Write([byte]0) # height (0 means 256)
$bw.Write([byte]0) # color count
$bw.Write([byte]0) # reserved
$bw.Write([uint16]0) # planes
$bw.Write([uint16]32) # bitCount
$bw.Write([uint32]($pngBytes.Length)) # bytesInRes
$bw.Write([uint32]22) # imageOffset (6 + 16)

# write PNG bytes
$bw.Write($pngBytes)
$bw.Close()
$fs.Close()

Write-Host "Wrote ICO to $icoPath"
