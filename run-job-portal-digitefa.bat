@echo off

REM Set paths dynamically based on current directory
set PROJECT1_PATH=%~dp0job-portal-server-side
set PROJECT2_PATH=%~dp0job-portal-clientside-cms
set PROJECT3_PATH=%~dp0job-portal-client-side
set PROJECT4_PATH=%~dp0digitefa-python

REM Jalankan project pertama (NestJS Server Side)
start cmd /k "cd /d %PROJECT1_PATH% && npm run start:dev"

REM Jalankan project kedua (Vite CMS)
start cmd /k "cd /d %PROJECT2_PATH% && npm run dev"

REM Jalankan project ketiga (Vite Client Side)
start cmd /k "cd /d %PROJECT3_PATH% && npm run dev"

REM Jalankan project keempat (FastAPI Python)
start cmd /k "cd /d %PROJECT4_PATH% && (if not exist venv (python -m venv venv)) && call .\venv\Scripts\activate && (uvicorn --version >nul 2>&1 || pip install -r requirements.txt) && uvicorn main:app --reload --host 0.0.0.0 --port 9090"

exit
