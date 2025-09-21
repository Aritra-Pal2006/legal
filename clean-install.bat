@echo off
REM Clean installation script for Legal AI Document Analyzer (Windows)

echo Starting clean installation...

REM Remove node_modules and package-lock.json from root
echo Removing root node_modules and package-lock.json...
rmdir /s /q node_modules 2>nul
del package-lock.json 2>nul

REM Remove node_modules and package-lock.json from frontend
echo Removing frontend node_modules and package-lock.json...
rmdir /s /q frontend\node_modules 2>nul
del frontend\package-lock.json 2>nul

REM Remove node_modules and package-lock.json from backend
echo Removing backend node_modules and package-lock.json...
rmdir /s /q backend\node_modules 2>nul
del backend\package-lock.json 2>nul

REM Install dependencies in root
echo Installing root dependencies...
npm install

REM Install dependencies in backend
echo Installing backend dependencies...
cd backend
npm install
cd ..

REM Install dependencies in frontend with legacy peer deps
echo Installing frontend dependencies with legacy peer deps...
cd frontend
npm install --legacy-peer-deps
cd ..

echo Clean installation completed successfully!
echo You can now run the application with 'npm run dev'
pause