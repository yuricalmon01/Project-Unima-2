#!/bin/bash

# 🚀 SCRIPT DE DEPLOYMENT - SOS SAÚDE
# Executa este script para fazer deploy rápido

set -e  # Exit on error

echo "🚀 Iniciando deployment do SOS Saúde..."

# ============================================
# BACKEND
# ============================================
echo ""
echo "📦 Fazendo build do backend..."
cd sos_saude_backend/sos-saude-node

# Verificar se .env existe
if [ ! -f .env ]; then
    echo "⚠️  Arquivo .env não encontrado!"
    echo "   Criando a partir de .env.example..."
    cp .env.example .env
    echo "   ⚠️  IMPORTANTE: Edite .env com suas credenciais MySQL antes de continuar!"
    exit 1
fi

# Instalar dependências
npm install --production

# Testar conexão com banco
echo "🔗 Testando conexão com banco de dados..."
timeout 5 node -e "
const pool = require('./src/config/db');
pool.query('SELECT 1').then(() => {
    console.log('✅ Banco de dados conectado!');
    process.exit(0);
}).catch(err => {
    console.error('❌ Erro ao conectar ao banco:', err.message);
    process.exit(1);
});
" || echo "⚠️  Banco de dados não respondeu. Verifique credenciais."

cd ../..

# ============================================
# FRONTEND
# ============================================
echo ""
echo "🎨 Fazendo build do frontend..."
cd frontend

# Verificar se .env.local existe
if [ ! -f .env.local ]; then
    echo "⚠️  Arquivo .env.local não encontrado!"
    echo "   Criando a partir de .env.example..."
    cp .env.example .env.local
fi

# Mostrar URL da API configurada
API_URL=$(grep NEXT_PUBLIC_API_URL .env.local | cut -d'=' -f2)
echo "   API URL configurada: $API_URL"

# Instalar dependências
npm install --production

# Build
echo "   Compilando Next.js..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build do frontend bem-sucedido!"
else
    echo "❌ Build do frontend falhou!"
    exit 1
fi

cd ..

# ============================================
# RESUMO
# ============================================
echo ""
echo "============================================"
echo "✅ DEPLOYMENT CONCLUÍDO COM SUCESSO!"
echo "============================================"
echo ""
echo "📍 Próximos passos:"
echo ""
echo "1️⃣  Backend:"
echo "   cd sos_saude_backend/sos-saude-node"
echo "   npm start  # ou: node src/app.js"
echo ""
echo "2️⃣  Frontend:"
echo "   cd frontend"
echo "   npm start"
echo ""
echo "3️⃣  Acesse:"
echo "   Frontend: http://localhost:3001"
echo "   Backend:  http://localhost:3000"
echo "   API Docs: http://localhost:3000/api/docs (se disponível)"
echo ""
echo "🔐 Usuários de teste:"
echo "   admin / 123456 (Admin)"
echo "   medico1 / 123456 (Doctor)"
echo "   paciente1 / 123456 (Patient)"
echo ""
echo "📚 Documentação:"
echo "   README.md - Instruções gerais"
echo "   DEPLOYMENT.md - Guia completo de deploy"
echo "   CHANGES.md - Resumo das mudanças"
echo ""
echo "============================================"
