@echo off
echo ===================================================
echo   Sequential Docker Build Script (OOM / Memory Fix)
echo ===================================================
echo This script builds Docker containers one by one to
echo prevent Docker Desktop / WSL from running out of RAM.

echo.
echo [1/8] Building python_server (Heavy AI dependencies)...
docker compose build python_server
if %errorlevel% neq 0 exit /b %errorlevel%

echo.
echo [2/8] Building ai_http_server (Heavy AI dependencies)...
docker compose build ai_http_server
if %errorlevel% neq 0 exit /b %errorlevel%

echo.
echo [3/8] Building backend...
docker compose build backend
if %errorlevel% neq 0 exit /b %errorlevel%

echo.
echo [4/8] Building frontend_client...
docker compose build frontend_client
if %errorlevel% neq 0 exit /b %errorlevel%

echo.
echo [5/8] Building frontend_cms...
docker compose build frontend_cms
if %errorlevel% neq 0 exit /b %errorlevel%

echo.
echo [6/8] Building lms_be_app...
docker compose build lms_be_app
if %errorlevel% neq 0 exit /b %errorlevel%

echo.
echo [7/8] Building lms_fe_app...
docker compose build lms_fe_app
if %errorlevel% neq 0 exit /b %errorlevel%

echo.
echo [8/8] Building lms_cms_app...
docker compose build lms_cms_app
if %errorlevel% neq 0 exit /b %errorlevel%

echo.
echo ===================================================
echo All builds finished successfully! Starting services...
echo ===================================================
docker compose up -d
