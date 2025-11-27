@echo off
REM ============================================
REM SOS Saúde - Quick Start Script
REM ============================================

echo.
echo ╔══════════════════════════════════════════════════════════════════╗
echo ║          SOS SAÚDE - Sistema de Gestão de Saúde                 ║
echo ║            Quick Start - Ambiente de Desenvolvimento             ║
echo ╚══════════════════════════════════════════════════════════════════╝
echo.

setlocal enabledelayedexpansion

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js não está instalado!
    echo Baixe em: https://nodejs.org/
    pause
    exit /b 1
)

echo ✅ Node.js detectado: 
node --version
echo.

REM Check if MySQL is installed/running
mysql --version >nul 2>&1
if errorlevel 1 (
    echo ⚠️  MySQL não foi detectado no PATH
    echo Verifique se MySQL está instalado e no PATH do sistema
)

echo.
echo Escolha uma opção:
echo.
echo 1. ⚙️  Setup inicial (MySQL + Dependências)
echo 2. 🚀 Rodar Backend (Node.js)
echo 3. 🎨 Rodar Frontend (Next.js)
echo 4. 🔨 Rodar Backend + Frontend (2 janelas)
echo 5. 🧹 Limpar node_modules
echo 6. 📖 Abrir documentação
echo 7. 🚪 Sair
echo.

set /p choice="Escolha uma opção (1-7): "

if "%choice%"=="1" goto setup
if "%choice%"=="2" goto backend
if "%choice%"=="3" goto frontend
if "%choice%"=="4" goto both
if "%choice%"=="5" goto clean
if "%choice%"=="6" goto docs
if "%choice%"=="7" exit /b 0

echo ❌ Opção inválida!
pause
goto :eof

:setup
echo.
echo 📦 Iniciando setup...
echo.

echo 1. Instalando dependências do backend...
cd sos_saude_backend\sos-saude-node
npm install
echo ✅ Backend: dependências instaladas
echo.

echo 2. Instalando dependências do frontend...
cd ..\..\frontend
npm install
echo ✅ Frontend: dependências instaladas
echo.

echo.
echo ✨ Setup completo!
echo.
echo 📝 Próximas etapas:
echo    1. Configure o MySQL com: mysql -u root -p ^< Banco de dados.sql
echo    2. Insira dados iniciais: mysql -u root -p unima_health_system ^< init-seed.sql
echo    3. Execute: npm run dev (para backend + frontend)
echo.
pause
goto :eof

:backend
echo.
echo 🚀 Iniciando Backend (SOS Saúde)...
echo.
cd sos_saude_backend\sos-saude-node
npm run dev
goto :eof

:frontend
echo.
echo 🎨 Iniciando Frontend (SOS Saúde)...
echo.
cd frontend
npm run dev
goto :eof

:both
echo.
echo 🔨 Iniciando Backend + Frontend...
echo.
echo Abrindo 2 janelas de terminal...
echo.

start "Backend - SOS Saúde" cmd /k "cd sos_saude_backend\sos-saude-node && npm run dev"
echo ✅ Backend iniciado em nova janela (porta 3000)

timeout /t 2 /nobreak

start "Frontend - SOS Saúde" cmd /k "cd frontend && npm run dev"
echo ✅ Frontend iniciado em nova janela (porta 3001)

echo.
echo 🌐 Acesse: http://localhost:3001
echo.
pause
goto :eof

:clean
echo.
echo 🧹 Limpando node_modules...
echo.

if exist "sos_saude_backend\sos-saude-node\node_modules" (
    rmdir /s /q "sos_saude_backend\sos-saude-node\node_modules"
    echo ✅ Backend node_modules removido
)

if exist "frontend\node_modules" (
    rmdir /s /q "frontend\node_modules"
    echo ✅ Frontend node_modules removido
)

echo ✨ Limpeza completa!
echo.
pause
goto :eof

:docs
echo.
echo 📖 Abrindo documentação...
echo.
if exist "RESUMO_CORREÇÕES_FINAL.md" (
    start RESUMO_CORREÇÕES_FINAL.md
    echo ✅ Documento aberto: RESUMO_CORREÇÕES_FINAL.md
) else (
    echo ❌ Documento não encontrado
)

if exist "SETUP_DESENVOLVIMENTO.md" (
    start SETUP_DESENVOLVIMENTO.md
    echo ✅ Documento aberto: SETUP_DESENVOLVIMENTO.md
)

echo.
pause
goto :eof
