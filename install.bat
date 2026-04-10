@echo off
echo ==========================================
echo Mulai Instalasi Semua Dependencies...
echo Mohon tunggu, proses ini mungkin memakan waktu.
echo ==========================================

set BASE_DIR=%~dp0

echo.
echo [1/8] Instalasi Job Portal Backend (Node.js)...
cd /d "%BASE_DIR%job-portal-server-side"
call npm install

echo.
echo [2/8] Instalasi Job Portal Python Socket Server...
cd /d "%BASE_DIR%job-portal-server-side\python"
if exist requirements.txt (
    pip install -r requirements.txt
) else (
    echo requirements.txt tidak ditemukan, melewati tahap ini.
)

echo.
echo [3/8] Instalasi AI HTTP Server (Python)...
cd /d "%BASE_DIR%digitefa-python"
if exist requirements.txt (
    pip install -r requirements.txt
) else (
    echo requirements.txt tidak ditemukan, melewati tahap ini.
)

echo.
echo [4/8] Instalasi LMS Backend (Laravel)...
cd /d "%BASE_DIR%lms-server-side"
call composer install
if not exist .env (
    if exist .env.example (
        echo Membuat file .env dan men-generate key...
        copy .env.example .env
        call php artisan key:generate
    ) else (
        echo .env.example tidak ditemukan. Pastikan setting env manual nanti.
    )
)

echo.
echo [5/8] Instalasi Job Portal Client (Node.js)...
cd /d "%BASE_DIR%job-portal-client-side"
call npm install

echo.
echo [6/8] Instalasi Job Portal CMS (Node.js)...
cd /d "%BASE_DIR%job-portal-clientside-cms"
call npm install

echo.
echo [7/8] Instalasi LMS Client (Node.js)...
cd /d "%BASE_DIR%lms-client-side"
call npm install

echo.
echo [8/8] Instalasi LMS CMS (Node.js)...
cd /d "%BASE_DIR%lms-cms"
call npm install

echo.
echo ==========================================
echo SEMUA INSTALASI SELESAI!
echo Sekarang kamu bisa menjalankan start_services.bat
echo ==========================================
pause