@echo off
setlocal
echo ========================================================
echo   Starting CitizenDoc Full-Stack Web Application
echo ========================================================

REM Ensure Node.js is in PATH
set "PATH=C:\Program Files\nodejs;%PATH%"

REM Check if Node is available
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Node.js was not found. Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo Starting Backend API & Frontend Server on http://localhost:5000 ...
node backend/server.js
pause
