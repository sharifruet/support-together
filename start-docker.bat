@echo off
REM Docker Startup Script for Support Together (Windows)
REM This script helps start the application in Docker

echo ==========================================
echo Support Together - Docker Setup
echo ==========================================
echo.

REM Check if Docker is running
docker info >nul 2>&1
if errorlevel 1 (
    echo Docker is not running. Please start Docker Desktop.
    exit /b 1
)

echo Docker is running
echo.

REM Stop existing containers if any
echo Stopping existing containers...
docker-compose down

echo.
echo Building Docker images...
docker-compose build

echo.
echo Starting services...
docker-compose up -d

echo.
echo Waiting for services to be ready...
timeout /t 10 /nobreak >nul

echo.
echo ==========================================
echo Services Status:
echo ==========================================
docker-compose ps

echo.
echo ==========================================
echo Application URLs:
echo ==========================================
echo Frontend:  http://localhost:3000
echo API:       http://localhost:5000/api
echo Database:  localhost:3306
echo.
echo To view logs: docker-compose logs -f
echo To stop:      docker-compose down
echo ==========================================
pause
