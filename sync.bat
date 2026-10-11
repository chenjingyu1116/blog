@echo off
cd /d "%~dp0"

echo.
echo ============================================
echo   XingHuiSama Blog - Sync to GitHub
echo ============================================
echo.

where git >nul 2>nul
if errorlevel 1 (
  echo [ERROR] git not found. Install Git for Windows first.
  pause
  exit /b 1
)

for /f "delims=" %%i in ('git branch --show-current') do set BRANCH=%%i
echo [INFO] Current branch: %BRANCH%
echo.

echo [INFO] Status:
git status --short
echo.

git status --porcelain > temp_status.txt
for %%A in (temp_status.txt) do set SIZE=%%~zA
del temp_status.txt

if "%SIZE%"=="0" (
  echo [INFO] No changes to commit.
  echo.
  pause
  exit /b 0
)

echo [1/3] Adding changes...
git add .
if errorlevel 1 (
  echo [ERROR] git add failed
  pause
  exit /b 1
)

set MSG=update: %date% %time%
echo [2/3] Committing: %MSG%
git commit -m "%MSG%"
if errorlevel 1 (
  echo [ERROR] git commit failed
  pause
  exit /b 1
)

echo [3/3] Pushing to GitHub...
git push origin %BRANCH%
if errorlevel 1 (
  echo.
  echo [ERROR] Push failed. Common reasons:
  echo   1. Network issue
  echo   2. Need Personal Access Token
  echo      Get one at: https://github.com/settings/tokens
  echo   3. Remote has new commits - run: git pull first
  echo.
  pause
  exit /b 1
)

echo.
echo ============================================
echo   SUCCESS!
echo ============================================
echo.
timeout /t 2 >nul
exit /b 0