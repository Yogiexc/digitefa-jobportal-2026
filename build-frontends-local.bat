@echo off
echo === BUILDING frontend_client LOCAL ===
cd job-portal-client-side
set VITE_APP_API_URL=http://103.253.213.183:3000/api
set VITE_IMAGE_API=http://103.253.213.183:3000
call npm run build
if %errorlevel% neq 0 exit /b %errorlevel%

echo === BUILDING lms_fe_app LOCAL ===
cd ../lms-client-side
set VUE_APP_API_URL=http://103.253.213.183:8888/api
set VUE_APP_STUDENT_PROFILE_URL=http://103.253.213.183:8888/uploads/Student/Student Profile
set VUE_APP_TEACHER_PROFILE_URL=http://103.253.213.183:8888/uploads/Teacher/Profile Picture
set VUE_APP_COURSE_THUMBNAIL_URL=http://103.253.213.183:8888/uploads/Courses/Thumbnail
set VUE_APP_TEACHER_ABOUT_URL=http://103.253.213.183:8888/uploads
set VUE_APP_TEACHER_MEDIA_PARTNER_URL=http://103.253.213.183:8888/uploads/media_partner
call npm run build
if %errorlevel% neq 0 exit /b %errorlevel%

echo === BUILDING lms_cms_app LOCAL ===
cd ../lms-cms
set VUE_APP_API_URL=http://103.253.213.183:8888/api
set VUE_APP_TEACHER_IDENTITY_URL=http://103.253.213.183:8888/uploads/Teacher/Identity
set VUE_APP_TEACHER_PORTOFOLIO_URL=http://103.253.213.183:8888/uploads/Teacher/Portofolio
set VUE_APP_TEACHER_PROFILE_URL=http://103.253.213.183:8888/uploads/Teacher/Profile Picture
set VUE_APP_TEACHER_CERTIFICATE_URL=http://103.253.213.183:8888/uploads/Teacher/Teacher Certificates
set VUE_APP_COURSE_THUMBNAIL_URL=http://103.253.213.183:8888/uploads/Courses/Thumbnail
call npm run build
if %errorlevel% neq 0 exit /b %errorlevel%

echo === ALL FRONTENDS BUILT SUCCESSFULLY ===
cd ..
