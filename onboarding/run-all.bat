@echo off
REM Regenerate all three onboarding guides.
REM Prerequisites:
REM   1. Dev server running:  npm run dev   (from project root, in a separate terminal)
REM   2. Auth refreshed:      python onboarding\refresh_auth.py
REM
REM Then run this file from the project root:  onboarding\run-all.bat

echo.
echo === ABU-Materialplattform Onboarding — Regenerate all guides ===
echo.

cd /d "%~dp0scripts"

echo [1/3] Platform Overview (Einfuehrung und Rundgang)...
node capture.mjs run ../flows/platform-overview.json
if errorlevel 1 (echo FAILED & pause & exit /b 1)
echo   Done.

echo.
echo [2/3] Material einreichen...
node capture.mjs run ../flows/einreichen.json
if errorlevel 1 (echo FAILED & pause & exit /b 1)
echo   Done.

echo.
echo [3/3] Jahresplanung...
node capture.mjs run ../flows/jahresplanung.json
if errorlevel 1 (echo FAILED & pause & exit /b 1)
echo   Done.

echo.
echo === All guides regenerated. HTML + PDF deployed to public/onboarding/ ===
echo.
pause
