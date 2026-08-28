# CitizenDoc Launcher for PowerShell
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "  Starting CitizenDoc Full-Stack Web Application" -ForegroundColor Cyan
Write-Host "========================================================" -ForegroundColor Cyan

# Reload Node.js into current session PATH
$env:PATH = "C:\Program Files\nodejs;" + $env:PATH

$nodePath = "C:\Program Files\nodejs\node.exe"

if (Test-Path $nodePath) {
    Write-Host "Starting CitizenDoc on http://localhost:5000 ..." -ForegroundColor Green
    & $nodePath backend/server.js
} elseif (Get-Command node -ErrorAction SilentlyContinue) {
    Write-Host "Starting CitizenDoc on http://localhost:5000 ..." -ForegroundColor Green
    node backend/server.js
} else {
    Write-Host "[ERROR] Node.js not found. Please verify Node.js installation." -ForegroundColor Red
}
