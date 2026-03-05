@echo off
REM =============================================
REM StackAI — Deploy Script for Windows
REM Double-click or run: deploy.bat
REM =============================================

echo.
echo ==========================================
echo      StackAI Windows Deploy Script
echo ==========================================
echo.

REM Step 1: Build frontend
echo [1/4] Building frontend...
cd frontend
call npm install
call npm run build
if errorlevel 1 ( echo BUILD FAILED & pause & exit /b 1 )
echo Frontend built successfully!
cd ..

REM Step 2: Git commit
echo.
echo [2/4] Committing to Git...
c
git commit -m "StackAI deploy"
echo Code committed!

REM Step 3: Instructions
echo.
echo [3/4] Push to GitHub:
echo   1. Create repo at https://github.com/new
echo   2. Run: git remote add origin YOUR_REPO_URL
echo   3. Run: git push -u origin main
echo.
pause

REM Step 4: Netlify
echo [4/4] Deploy to Netlify:
echo   Option A: Drag frontend\dist folder to https://app.netlify.com
echo   Option B: Connect GitHub repo at https://app.netlify.com/start
echo     - Base dir: frontend
echo     - Build cmd: npm run build
echo     - Publish dir: frontend/dist
echo.
echo Deploy backend to Railway:
echo   1. Go to https://railway.app
echo   2. New Project from GitHub repo
echo   3. Set root directory to: backend
echo   4. Add all env vars from backend\.env.example
echo.
echo Done! See README.md for full instructions.
pause
