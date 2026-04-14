@echo off
setlocal enabledelayedexpansion
title Digitefa Local Services Manager

echo ==========================================
echo Starting All Services Locally
echo ==========================================

set BASE_DIR=%~dp0

:: 1. Python AI Socket Server
echo [1/7] Starting AI Python Socket Server (5555)...
start "AI Socket Server" cmd /k "cd /d %BASE_DIR%job-portal-server-side\python && (python job_recommender_server.py || py job_recommender_server.py) || (echo ERROR: Failed to start Python Socket Server && pause)"

:: 2. AI HTTP Server
echo [2/7] Starting AI HTTP Server (9090)...
start "AI HTTP Server" cmd /k "cd /d %BASE_DIR%digitefa-python && (python -m uvicorn main:app --port 9090 --reload || py -m uvicorn main:app --port 9090 --reload) || (echo ERROR: Failed to start AI HTTP Server && pause)"

:: Give AI servers a moment to initialize
timeout /t 3 /nobreak > nul

:: 3. LMS Backend (PHP)
echo [3/7] Starting LMS Backend (8888)...
start "LMS Backend" cmd /k "cd /d %BASE_DIR%lms-server-side && php artisan serve --port=8888 || (echo ERROR: Failed to start LMS Backend. Check .env and PHP status. && pause)"

:: 4. Job Portal Backend (NestJS)
echo [4/7] Starting Job Portal Backend (3000)...
:: Clean dist to ensure Prisma relative paths are correctly generated
start "Job Portal Backend" cmd /k "cd /d %BASE_DIR%job-portal-server-side && (if exist dist rd /s /q dist) && npm run start:dev || (echo ERROR: Failed to start Job Portal Backend && pause)"

:: 5. Job Portal Client
echo [5/7] Starting Job Portal Client (Vite)...
start "Job Portal Client" cmd /k "cd /d %BASE_DIR%job-portal-client-side && npm run dev || (echo ERROR: Failed to start Client && pause)"

:: 6. Job Portal CMS
echo [6/7] Starting Job Portal CMS (Vite)...
start "Job Portal CMS" cmd /k "cd /d %BASE_DIR%job-portal-clientside-cms && npm run dev || (echo ERROR: Failed to start CMS && pause)"

:: 7. LMS Client & CMS
echo [7/7] Starting LMS Client/CMS...
start "LMS Client" cmd /k "cd /d %BASE_DIR%lms-client-side && npm run serve -- --port 8800 || pause"
start "LMS CMS" cmd /k "cd /d %BASE_DIR%lms-cms && npm run serve -- --port 8880 || pause"

echo ==========================================
echo All services launched! Please check 
echo individual windows for status.
echo ==========================================
pause
