@echo off
echo Iniciando sistema WhatsApp...
cd /d %~dp0
start cmd /k node server.js
timeout /t 2
start cmd /k node bot.js
