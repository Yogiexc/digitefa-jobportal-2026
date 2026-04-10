@echo off
echo ==========================================
echo Starting All Services Locally
echo ==========================================

set BASE_DIR=%~dp0

echo Starting Job Portal AI Python Socket Server (Port 5555)...
start "Python Socket Server" cmd /k "cd /d %BASE_DIR%job-portal-server-side\python && py job_recommender_server.py || pause"

echo Starting AI HTTP Server (Port 9090)...
start "AI HTTP Server" cmd /k "cd /d %BASE_DIR%digitefa-python && py -m uvicorn main:app --port 9090 --reload || pause"

echo Starting LMS Backend (Port 8888)...
start "LMS Backend" cmd /k "cd /d %BASE_DIR%lms-server-side && php artisan serve --port=8888 || pause"

echo Starting Job Portal Backend (Port 3000)...
start "Job Portal Backend" cmd /k "cd /d %BASE_DIR%job-portal-server-side && npm run start:dev || pause"

echo Starting Job Portal Client...
start "Job Portal Client" cmd /k "cd /d %BASE_DIR%job-portal-client-side && npm run dev || pause"

echo Starting Job Portal CMS...
start "Job Portal CMS" cmd /k "cd /d %BASE_DIR%job-portal-clientside-cms && npm run dev || pause"

echo Starting LMS Client (Port 8800)...
start "LMS Client" cmd /k "cd /d %BASE_DIR%lms-client-side && npm run serve -- --port 8800 || pause"

echo Starting LMS CMS (Port 8880)...
start "LMS CMS" cmd /k "cd /d %BASE_DIR%lms-cms && npm run serve -- --port 8880 || pause"

echo All services launched in separate windows!
pause
