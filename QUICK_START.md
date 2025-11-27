# 🆘 GUIA RÁPIDO PARA INICIANTES

Se você é novo no projeto ou está com dúvidas, este é o lugar certo!

---

## ❓ O que é este projeto?

Sistema web de gestão de saúde (tipo hospital/clínica) com:
- **Backend:** Servidor que gerencia dados (Node.js + Express + MySQL)
- **Frontend:** Interface que você usa no navegador (Next.js + React)
- **Autenticação:** Sistema de login com diferentes perfis (Admin, Doctor, Patient)

---

## 🔴 Não funciona? Tente isto

### Erro: "Não conecta ao servidor"
```bash
# Verifique se o backend está rodando
# Terminal aberto? Porta 3000 aberta?
# Tente:
curl http://localhost:3000/health

# Se retornar {"status": "ok"} → Backend OK ✅
# Se der erro → Backend não está rodando ❌
```

### Erro: "Erro de conexão com banco de dados"
```bash
# Backend não consegue falar com MySQL
# Verifique:

# 1. MySQL está rodando?
mysql -u root -p -e "SELECT 1;"

# 2. Credenciais estão certas?
# Abra: sos_saude_backend/sos-saude-node/.env
# Verifique: DB_HOST, DB_USER, DB_PASSWORD

# 3. Banco existe?
mysql -u root -p -e "USE unima_health_system; SELECT 1;"
```

### Erro: "Falha no build do frontend"
```bash
# Limpar cache e tentar novamente
cd frontend
rm -rf node_modules .next
npm install
npm run build
```

### Erro: "CORS policy"
```
Mensagem: "Access to XMLHttpRequest... has been blocked by CORS"

Significa: Frontend tentando falar com backend mas foi bloqueado

Solução:
1. Verificar se backend está rodando
2. Verificar NEXT_PUBLIC_API_URL em frontend/.env.local
3. Deve ser exatamente: http://localhost:3000 (sem trailing slash)
```

---

## 📝 Tarefas Comuns

### "Quero testar o login"
1. Abrir http://localhost:3001
2. Digitar `admin` em username
3. Digitar `123456` em password
4. Clicar "Entrar"
5. Pronto! Você está logado

**Se não funciona:** Verificar console do navegador (F12 > Console)

### "Quero criar um novo paciente"
1. Fazer login com `admin` / `123456`
2. Clicar em "Pacientes" no menu
3. Clicar em "Novo Paciente"
4. Preencher: Nome, Sobrenome, Email
5. Clicar "Cadastrar Paciente"
6. Pronto! Novo paciente criado no banco

### "Quero resetar o banco de dados"
```bash
# Conectar ao MySQL
mysql -u root -p

# Dentro do MySQL:
DROP DATABASE unima_health_system;
EXIT;

# Depois:
# Executar arquivo SQL: "Banco de dados.sql"
# No MySQL Workbench ou:
mysql -u root -p unima_health_system < "Banco de dados.sql"
```

### "Quero rodar apenas o backend"
```bash
cd sos_saude_backend/sos-saude-node
node src/app.js

# Testar:
curl http://localhost:3000/health
# Deve retornar: {"status": "ok"}
```

### "Quero rodar apenas o frontend"
```bash
# IMPORTANTE: Backend precisa estar rodando!
cd frontend
npm run dev

# Vai abrir: http://localhost:3001
# Se tentar logar: vai precisar do backend
```

---

## 🔧 Configuração Inicial

### 1º vez rodando? Siga isto:

```bash
# 1. Clonar o repositório
git clone https://github.com/yuricalmon01/Project-Unima-2.git
cd Project-Unima-2

# 2. Criar banco de dados (uma vez)
mysql -u root -p < "Banco de dados.sql"

# 3. Terminal 1: Backend
cd sos_saude_backend/sos-saude-node
npm install
node src/app.js

# Aguarde a mensagem: "🚀 Servidor rodando na porta 3000"

# 4. Terminal 2: Frontend
cd frontend
npm install
npm run dev

# Aguarde a mensagem: "✓ Ready in XXXms"

# 5. Abrir navegador
# http://localhost:3001
```

---

## 📖 Onde Encontro Ajuda?

| Problema | Onde Procurar |
|----------|---------------|
| Como rodar? | README.md |
| Erro técnico? | DEPLOYMENT.md > Troubleshooting |
| Mudanças recentes? | CHANGES.md |
| Entender a arquitetura? | SUMMARY.md |
| Deploy em produção? | DEPLOYMENT.md |

---

## 🎮 Testando a API Diretamente

### Listar pacientes
```bash
curl -H "Authorization: Bearer SEU_TOKEN" \
     http://localhost:3000/api/pacientes
```

### Listar usuários
```bash
curl -H "Authorization: Bearer SEU_TOKEN" \
     http://localhost:3000/api/users
```

### Faz login (obter token)
```bash
curl -X POST http://localhost:3000/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"username":"admin","password":"123456"}'

# Resposta:
# {
#   "token": "eyJhbGciOiJIUzI1NiIs...",
#   "user": { "id": 1, "username": "admin", ... }
# }

# Copie o token (sem "eyJ" inicial) e use nos comandos acima
```

---

## 💾 Arquivos Importantes

```
Project-Unima-2/
├── README.md          ← Leia primeiro!
├── SUMMARY.md         ← Resumo do projeto
├── DEPLOYMENT.md      ← Deploy em produção
├── CHANGES.md         ← O que mudou
├── deploy.sh          ← Script de deploy
│
├── sos_saude_backend/sos-saude-node/
│   ├── src/app.js     ← Entrada do backend
│   ├── .env.example   ← Copiar para .env
│   └── Banco de dados.sql (ou ../Banco de dados.sql)
│
└── frontend/
    ├── lib/apiService.ts  ← Funções de API
    ├── .env.local         ← Configurações
    └── app/page.tsx       ← Home do frontend
```

---

## 🚨 Mensagens Comuns

### ✅ "Tudo funcionando"
```
Backend: 🚀 Servidor rodando na porta 3000
Frontend: ✓ Ready in 234ms
```

### ❌ "Erro: Cannot find module 'express'"
```
Solução: npm install
Causa: dependências não instaladas
```

### ❌ "Port 3000 already in use"
```
Solução: Mudar porta em .env (PORT=3001)
Ou: Encerrar outro processo na porta 3000
Windows: netstat -ano | findstr :3000
Linux:   lsof -i :3000
```

### ❌ "ECONNREFUSED 127.0.0.1:3000"
```
Solução: Backend não está rodando
Verificar se executou: node src/app.js
```

---

## 🎯 Fluxo Básico

```
1. Você acessa http://localhost:3001
   ↓
2. Frontend carrega página de login
   ↓
3. Você digita credenciais (admin / 123456)
   ↓
4. Frontend envia POST para http://localhost:3000/api/auth/login
   ↓
5. Backend valida credenciais e retorna token JWT
   ↓
6. Frontend salva token em localStorage
   ↓
7. Frontend redireciona para dashboard
   ↓
8. Qualquer requisição agora inclui: Authorization: Bearer <token>
   ↓
9. Backend valida token e retorna dados
   ↓
10. Frontend renderiza os dados
```

---

## 🔐 Segurança Básica

- **Não** compartilhe seu JWT_SECRET
- **Não** execute `npm install` de pacotes desconhecidos
- **Não** commite arquivo `.env` no Git
- **Sempre** use HTTPS em produção (não HTTP)

---

## 📚 Recursos Externos

- Node.js: https://nodejs.org
- Express: https://expressjs.com
- Next.js: https://nextjs.org
- MySQL: https://mysql.com
- JWT: https://jwt.io

---

## 🆘 Ainda com Problema?

1. Ler a mensagem de erro **com atenção**
2. Procurar em: README.md → DEPLOYMENT.md → CHANGES.md
3. Verificar Network tab do navegador (F12)
4. Ver os logs do terminal (backend e frontend)
5. Limpar cache: `rm -rf node_modules .next && npm install`

---

**Última atualização:** 27 de novembro de 2025

Se tiver mais dúvidas, leia: **README.md** ou **DEPLOYMENT.md**
