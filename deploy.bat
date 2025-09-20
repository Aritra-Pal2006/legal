@echo off
echo =============================================
echo   Legal AI Document Analyzer Deployment
echo =============================================
echo.

echo Step 1: You need to login to Vercel first
echo Please run: vercel login
echo (This will open a browser window for authentication)
echo.
pause

echo Step 2: Deploy the Backend
echo.
cd /d "d:\legal\backend"
echo Current directory: %cd%
echo Running: vercel --prod
vercel --prod
echo.
echo *** IMPORTANT: Copy the backend deployment URL from above ***
echo *** You'll need it for the frontend environment variables ***
echo.
pause

echo Step 3: Deploy the Frontend
echo.
cd /d "d:\legal\frontend"
echo Current directory: %cd%
echo Running: vercel --prod
vercel --prod
echo.

echo =============================================
echo   Deployment Complete!
echo =============================================
echo.
echo Next steps:
echo 1. Set environment variables in Vercel dashboard
echo 2. Update VITE_API_URL with your backend URL
echo 3. Test your deployed application
echo.
pause