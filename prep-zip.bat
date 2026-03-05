@echo off
REM JAY JAY MD - Size Reduction Script for Zipping
REM This removes files that will bloat your zip file

echo.
echo 🗑️ CLEANUP FOR ZIP FILE
echo ═════════════════════════════
echo.

REM Delete node_modules
if exist node_modules (
    echo ❌ Removing node_modules (297 MB)...
    rmdir /s /q node_modules
    echo ✅ Done
)

REM Delete .git folder
if exist .git (
    echo ❌ Removing .git folder...
    rmdir /s /q .git
    echo ✅ Done
)

REM Delete .vscode
if exist .vscode (
    echo ❌ Removing .vscode...
    rmdir /s /q .vscode
    echo ✅ Done
)

REM Delete package-lock.json
if exist package-lock.json (
    echo ❌ Removing package-lock.json...
    del package-lock.json
    echo ✅ Done
)

REM Clean sessions
echo ❌ Cleaning sessions folder...
if exist sessions (
    del /q sessions\*.*
)

REM Remove temp/cache files
echo ❌ Removing temp files...
for /r . %%f in (*.tmp *.bak *.log) do (
    if exist "%%f" del "%%f"
)

echo.
echo ═════════════════════════════
echo ✅ CLEANUP COMPLETE!
echo.
echo 📊 Your folder is now ~50MB
echo.
echo 📝 NEXT STEPS:
echo 1. Zip the folder with 7-Zip or WinRAR
echo 2. After download/deployment, run: npm install
echo.
pause
