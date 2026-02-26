@echo off

REM Ganti path berikut dengan path project Laravel kamu
set PROJECT1_PATH=C:\laragon\www\job-portal-server-side
set PROJECT2_PATH=C:\laragon\www\job-portal-clientside-cms
set PROJECT3_PATH=C:\laragon\www\job-portal-client-side
set PROJECT4_PATH=C:\laragon\www\job-portal-server-side\python

REM Jalankan project pertama
start cmd /k "cd /d %PROJECT1_PATH% && npm run start:dev"

REM Jalankan project kedua
start cmd /k "cd /d %PROJECT2_PATH% && npm run dev"

REM Jalankan project ketiga
start cmd /k "cd /d %PROJECT3_PATH% && npm run dev"

REM Jalankan project keempat
start cmd /k "cd /d %PROJECT4_PATH% && py job_recommender_server.py"

exit
