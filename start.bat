@echo off
echo.
echo 💎 DIAMCO — Diamond Market Platform
echo ====================================
echo.

where node >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo ❌ Node.js не найден!
    echo    Скачайте с https://nodejs.org (v18+)
    echo.
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('node --version') do set NODE_VER=%%i
echo ✅ Node.js: %NODE_VER%

if not exist "node_modules" (
    echo.
    echo 📦 Установка зависимостей...
    call npm install
)

echo.
echo 🚀 Запуск сервера...
echo.
echo    Откройте в браузере:  http://localhost:3000
echo    На телефоне (та же Wi-Fi): см. адрес Network ниже
echo.
echo    Для остановки нажмите Ctrl+C
echo.

call npm run dev
pause
