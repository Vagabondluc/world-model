Add-Type -AssemblyName System.Drawing
$bmp = New-Object System.Drawing.Bitmap(16,16)
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.Clear([System.Drawing.Color]::FromArgb(255,0,120,200))
$h = $bmp.GetHicon()
$icon = [System.Drawing.Icon]::FromHandle($h)
$fs = [System.IO.File]::OpenWrite('D:\coding\AI\Chat-Gpt-Agent\mythforge\src-tauri\icons\icon.ico')
$icon.Save($fs)
$fs.Close()
