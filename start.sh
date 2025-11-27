#!/bin/bash

# ============================================
# SOS Saúde - Quick Start Script (Linux/Mac)
# ============================================

clear

echo "╔══════════════════════════════════════════════════════════════════╗"
echo "║          SOS SAÚDE - Sistema de Gestão de Saúde                 ║"
echo "║            Quick Start - Ambiente de Desenvolvimento             ║"
echo "╚══════════════════════════════════════════════════════════════════╝"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js não está instalado!"
    echo "Baixe em: https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js detectado:"
node --version
echo ""

# Check if MySQL is installed
if ! command -v mysql &> /dev/null; then
    echo "⚠️  MySQL não foi detectado no PATH"
    echo "Verifique se MySQL está instalado e no PATH do sistema"
fi

echo ""
echo "Escolha uma opção:"
echo ""
echo "1. ⚙️  Setup inicial (Dependências)"
echo "2. 🚀 Rodar Backend (Node.js)"
echo "3. 🎨 Rodar Frontend (Next.js)"
echo "4. 🔨 Rodar Backend + Frontend"
echo "5. 🧹 Limpar node_modules"
echo "6. 📖 Abrir documentação"
echo "7. 🚪 Sair"
echo ""

read -p "Escolha uma opção (1-7): " choice

case $choice in
    1)
        echo ""
        echo "📦 Iniciando setup..."
        echo ""
        
        echo "1. Instalando dependências do backend..."
        cd sos_saude_backend/sos-saude-node
        npm install
        echo "✅ Backend: dependências instaladas"
        echo ""
        
        echo "2. Instalando dependências do frontend..."
        cd ../../frontend
        npm install
        echo "✅ Frontend: dependências instaladas"
        echo ""
        
        echo ""
        echo "✨ Setup completo!"
        echo ""
        echo "📝 Próximas etapas:"
        echo "   1. Configure o MySQL com: mysql -u root -p < Banco de dados.sql"
        echo "   2. Insira dados iniciais: mysql -u root -p unima_health_system < init-seed.sql"
        echo "   3. Execute: npm run dev (para backend + frontend)"
        echo ""
        ;;
    2)
        echo ""
        echo "🚀 Iniciando Backend (SOS Saúde)..."
        echo ""
        cd sos_saude_backend/sos-saude-node
        npm run dev
        ;;
    3)
        echo ""
        echo "🎨 Iniciando Frontend (SOS Saúde)..."
        echo ""
        cd frontend
        npm run dev
        ;;
    4)
        echo ""
        echo "🔨 Iniciando Backend + Frontend..."
        echo ""
        
        # Backend em background
        cd sos_saude_backend/sos-saude-node
        npm run dev &
        BACKEND_PID=$!
        echo "✅ Backend iniciado em background (PID: $BACKEND_PID, porta 3000)"
        
        sleep 2
        
        # Frontend em background
        cd ../../frontend
        npm run dev &
        FRONTEND_PID=$!
        echo "✅ Frontend iniciado em background (PID: $FRONTEND_PID, porta 3001)"
        
        echo ""
        echo "🌐 Acesse: http://localhost:3001"
        echo ""
        echo "Para parar, execute:"
        echo "  kill $BACKEND_PID $FRONTEND_PID"
        echo ""
        
        # Keep script running
        wait
        ;;
    5)
        echo ""
        echo "🧹 Limpando node_modules..."
        echo ""
        
        if [ -d "sos_saude_backend/sos-saude-node/node_modules" ]; then
            rm -rf "sos_saude_backend/sos-saude-node/node_modules"
            echo "✅ Backend node_modules removido"
        fi
        
        if [ -d "frontend/node_modules" ]; then
            rm -rf "frontend/node_modules"
            echo "✅ Frontend node_modules removido"
        fi
        
        echo "✨ Limpeza completa!"
        echo ""
        ;;
    6)
        echo ""
        echo "📖 Abrindo documentação..."
        echo ""
        
        if [ -f "RESUMO_CORREÇÕES_FINAL.md" ]; then
            if command -v open &> /dev/null; then
                open "RESUMO_CORREÇÕES_FINAL.md"
            elif command -v xdg-open &> /dev/null; then
                xdg-open "RESUMO_CORREÇÕES_FINAL.md"
            fi
            echo "✅ Documento aberto: RESUMO_CORREÇÕES_FINAL.md"
        else
            echo "❌ Documento não encontrado"
        fi
        
        if [ -f "SETUP_DESENVOLVIMENTO.md" ]; then
            if command -v open &> /dev/null; then
                open "SETUP_DESENVOLVIMENTO.md"
            elif command -v xdg-open &> /dev/null; then
                xdg-open "SETUP_DESENVOLVIMENTO.md"
            fi
            echo "✅ Documento aberto: SETUP_DESENVOLVIMENTO.md"
        fi
        
        echo ""
        ;;
    7)
        echo "Até logo! 👋"
        exit 0
        ;;
    *)
        echo "❌ Opção inválida!"
        exit 1
        ;;
esac
