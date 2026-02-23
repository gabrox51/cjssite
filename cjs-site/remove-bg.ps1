Add-Type -AssemblyName System.Drawing
$img = [System.Drawing.Bitmap]::new('C:\Users\CJS\Desktop\cjs-site\logo-cjs.png')
$threshold = 240
for ($x = 0; $x -lt $img.Width; $x++) {
    for ($y = 0; $y -lt $img.Height; $y++) {
        $pixel = $img.GetPixel($x, $y)
        if ($pixel.R -gt $threshold -and $pixel.G -gt $threshold -and $pixel.B -gt $threshold) {
            $img.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(0, 255, 255, 255))
        }
    }
}
$img.Save('C:\Users\CJS\Desktop\cjs-site\logo-cjs-transparent.png', [System.Drawing.Imaging.ImageFormat]::Png)
$img.Dispose()
Write-Host 'Fundo branco removido com sucesso'
