# Changelogrom 'node:fs/promises';
  [string]$Source = "public/favicon-source.png"
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

Add-Type -AssemblyName System.Drawing

function Color-DistanceSq([System.Drawing.Color]$a, [System.Drawing.Color]$b) {
  $dr = [int]$a.R - [int]$b.R
  $dg = [int]$a.G - [int]$b.G
  $db = [int]$a.B - [int]$b.B
  return ($dr * $dr) + ($dg * $dg) + ($db * $db)
}

$root = Split-Path -Parent $PSScriptRoot
$srcPath = Join-Path $root $Source
if (-not (Test-Path -LiteralPath $srcPath)) {
  $fallback = Join-Path $root "public/favicon-96x96.png"
  if (Test-Path -LiteralPath $fallback) {
    $srcPath = $fallback
    $Source = "public/favicon-96x96.png"
  } else {
    throw "No se encontró el archivo fuente: $srcPath"
  }
}

$srcBytes = [System.IO.File]::ReadAllBytes($srcPath)
$srcStream = New-Object System.IO.MemoryStream(,$srcBytes)
$raw = [System.Drawing.Bitmap]::FromStream($srcStream)

# Asegurar formato modificable ARGB
$bmp = New-Object System.Drawing.Bitmap($raw.Width, $raw.Height, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$g0 = [System.Drawing.Graphics]::FromImage($bmp)
try {
  $g0.CompositingMode = [System.Drawing.Drawing2D.CompositingMode]::SourceCopy
  $g0.DrawImage($raw, 0, 0, $raw.Width, $raw.Height)
} finally {
  $g0.Dispose()
  $raw.Dispose()
}

try {
  $w = $bmp.Width
  $h = $bmp.Height

  # 1) Quitar fondo por flood-fill desde bordes (mantiene los "huecos" negros internos del logo)
  $bg = $bmp.GetPixel(0, 0)
  $alphaThreshold = 10
  # Umbral de color: tolera compresión/antialiasing del fondo
  $colorThresholdSq = 900  # 30^2

  $visited = New-Object 'System.Boolean[]' ($w * $h)
  $q = New-Object 'System.Collections.Generic.Queue[int]'

  function Enqueue-IfBg([int]$x, [int]$y) {
    if ($x -lt 0 -or $x -ge $w -or $y -lt 0 -or $y -ge $h) { return }
    $idx = $y * $w + $x
    if ($visited[$idx]) { return }
    $visited[$idx] = $true
    $p = $bmp.GetPixel($x, $y)
    if ($p.A -le $alphaThreshold) { return }
    if ((Color-DistanceSq $p $bg) -le $colorThresholdSq) {
      $q.Enqueue($idx)
    }
  }

  for ($x = 0; $x -lt $w; $x++) {
    Enqueue-IfBg $x 0
    Enqueue-IfBg $x ($h - 1)
  }
  for ($y = 0; $y -lt $h; $y++) {
    Enqueue-IfBg 0 $y
    Enqueue-IfBg ($w - 1) $y
  }

  while ($q.Count -gt 0) {
    $idx = $q.Dequeue()
    $x = $idx % $w
    $y = [int](($idx - $x) / $w)

    $p = $bmp.GetPixel($x, $y)
    # Hacer transparente el fondo (manteniendo RGB para evitar cambios de color en el borde)
    $bmp.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(0, $p.R, $p.G, $p.B))

    Enqueue-IfBg ($x - 1) $y
    Enqueue-IfBg ($x + 1) $y
    Enqueue-IfBg $x ($y - 1)
    Enqueue-IfBg $x ($y + 1)
  }

  # 2) Bounding box por alpha
  $minX = $w
  $minY = $h
  $maxX = -1
  $maxY = -1

  for ($yy = 0; $yy -lt $h; $yy++) {
    for ($xx = 0; $xx -lt $w; $xx++) {
      if ($bmp.GetPixel($xx, $yy).A -gt $alphaThreshold) {
        if ($xx -lt $minX) { $minX = $xx }
        if ($yy -lt $minY) { $minY = $yy }
        if ($xx -gt $maxX) { $maxX = $xx }
        if ($yy -gt $maxY) { $maxY = $yy }
      }
    }
  }

  if ($maxX -lt 0 -or $maxY -lt 0) {
    throw "No se detectó contenido (¿imagen vacía?)."
  }

  $cropW = $maxX - $minX + 1
  $cropH = $maxY - $minY + 1
  $side = [Math]::Max($cropW, $cropH)

  # 3) Canvas cuadrado con el logo centrado
  $square = New-Object System.Drawing.Bitmap($side, $side, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
  $g1 = [System.Drawing.Graphics]::FromImage($square)
  try {
    $g1.CompositingMode = [System.Drawing.Drawing2D.CompositingMode]::SourceCopy
    $g1.Clear([System.Drawing.Color]::Transparent)
    $g1.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g1.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $g1.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality

    $dstX = [int](($side - $cropW) / 2)
    $dstY = [int](($side - $cropH) / 2)
    $srcRect = New-Object System.Drawing.Rectangle $minX, $minY, $cropW, $cropH
    $dstRect = New-Object System.Drawing.Rectangle $dstX, $dstY, $cropW, $cropH
    $g1.DrawImage($bmp, $dstRect, $srcRect, [System.Drawing.GraphicsUnit]::Pixel)
  } finally {
    $g1.Dispose()
  }

  function Save-Png([System.Drawing.Bitmap]$src, [int]$size, [string]$outRel, [int]$snapAlphaThreshold = -1) {
    $outPath = Join-Path $root $outRel
    $dir = Split-Path -Parent $outPath
    if (-not (Test-Path -LiteralPath $dir)) { New-Item -ItemType Directory -Path $dir | Out-Null }

    $dest = New-Object System.Drawing.Bitmap($size, $size, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $g2 = [System.Drawing.Graphics]::FromImage($dest)
    try {
      $g2.CompositingMode = [System.Drawing.Drawing2D.CompositingMode]::SourceCopy
      $g2.Clear([System.Drawing.Color]::Transparent)
      $g2.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
      $g2.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
      $g2.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
      $g2.DrawImage($src, 0, 0, $size, $size)
    } finally {
      $g2.Dispose()
    }

    if ($snapAlphaThreshold -ge 0) {
      for ($yy = 0; $yy -lt $size; $yy++) {
        for ($xx = 0; $xx -lt $size; $xx++) {
          $p = $dest.GetPixel($xx, $yy)
          $a = [int]$p.A
          if ($a -eq 0 -or $a -eq 255) { continue }
          if ($a -lt $snapAlphaThreshold) {
            $dest.SetPixel($xx, $yy, [System.Drawing.Color]::FromArgb(0, $p.R, $p.G, $p.B))
          } else {
            $dest.SetPixel($xx, $yy, [System.Drawing.Color]::FromArgb(255, $p.R, $p.G, $p.B))
          }
        }
      }
    }

    $dest.Save($outPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $dest.Dispose()
  }

  # Favicons de pestaña: "snap" alpha para evitar el look deslavado
  Save-Png $square 16 "public/favicon-16x16.png" 140
  Save-Png $square 32 "public/favicon-32x32.png" 140
  Save-Png $square 32 "public/favicon.png" 140
  Save-Png $square 96 "public/favicon-96x96.png"

  # PWA / iOS
  Save-Png $square 180 "public/apple-touch-icon.png"
  Save-Png $square 192 "public/web-app-manifest-192x192.png"
  Save-Png $square 512 "public/web-app-manifest-512x512.png"

  $square.Dispose()

  # Regenerar favicon.ico multi-size si existe el script Node
  $icoScript = Join-Path $root "scripts/generate-favicon-ico.mjs"
  if (Test-Path -LiteralPath $icoScript) {
    try {
      node $icoScript | Out-Null
    } catch {
      # Ignorar si node no está disponible
    }
  }

  Write-Host "Favicons generados desde: $Source" -ForegroundColor Green
} finally {
  $bmp.Dispose()
  $srcStream.Dispose()
}
