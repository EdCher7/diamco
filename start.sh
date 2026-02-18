#!/bin/bash
echo ""
echo "💎 DIAMCO — Diamond Market Platform"
echo "===================================="
echo ""

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js не найден!"
    echo "   Скачай с https://nodejs.org (v18+)"
    echo ""
    exit 1
fi

NODE_VER=$(node --version)
echo "✅ Node.js: $NODE_VER"

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo ""
    echo "📦 Установка зависимостей..."
    npm install
fi

echo ""
echo "🚀 Запуск сервера..."
echo ""
echo "   Откройте в браузере:  http://localhost:3000"
echo "   На телефоне (та же Wi-Fi): см. адрес Network ниже"
echo ""
echo "   Для остановки нажмите Ctrl+C"
echo ""

npm run dev
