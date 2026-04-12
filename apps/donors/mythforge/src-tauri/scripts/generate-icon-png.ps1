Add-Type -AssemblyName System.Drawing
$bmp = New-Object System.Drawing.Bitmap(256,256)
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.Clear([System.Drawing.Color]::FromArgb(255,0,120,200))
$fs = 'D:\coding\AI\Chat-Gpt-Agent\mythforge\src-tauri\icons\icon.png'
$bmp.Save($fs, [System.Drawing.Imaging.ImageFormat]::Png)
$g.Dispose()
$bmp.Dispose()
