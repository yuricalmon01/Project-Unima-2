# 🏥 SOS SAÚDE - Sistema de Gestão de Saúde

![Status](https://img.shields.io/badge/Status-✅%20Funcional-brightgreen)
![Backend](https://img.shields.io/badge/Backend-Node.js%2BExpress-blue)
![Frontend](https://img.shields.io/badge/Frontend-Next.js%2014-cyan)
![Database](https://img.shields.io/badge/Database-MySQL-yellow)

## 📋 Descrição

Sistema de gestão de saúde completo com autenticação JWT, CRUD de pacientes, usuários, agendamentos e prontuário médico. Desenvolvido com backend Node.js/Express e frontend Next.js 14.

**IMPORTANTE:** Este projeto foi completamente refatorado para usar **ES Modules** de forma consistente. Todos os arquivos backend foram convertidos de CommonJS para import/export moderno.

---

## ⚡ Quick Start

### Opção 1: Script Automático (Recomendado)

**Windows:**

```cmd
start.bat
```

**Linux/Mac:**

```bash
chmod +x start.sh
./start.sh
```

### Opção 2: Manual

#### 1️⃣ Setup Banco de Dados

```bash
# Criar banco e tabelas
mysql -u root -p < "Banco de dados.sql"

# Inserir dados iniciais
cd sos_saude_backend/sos-saude-node
mysql -u root -p unima_health_system < init-seed.sql
```

#### 2️⃣ Rodar Backend

```bash
cd sos_saude_backend/sos-saude-node
npm install
npm run dev
```

#### 3️⃣ Rodar Frontend

```bash
cd frontend
npm install
npm run dev
```

#### 4️⃣ Acessar

Abra `http://localhost:3001` e faça login com:

- **Username:** `admin`
- **Password:** `123456`

---

## 🎯 Funcionalidades

### ✅ Implementado e Testado

- [x] **Autenticação JWT** - Login/logout seguro
- [x] **CRUD Pacientes** - Gerenciar pacientes com validação
- [x] **CRUD Usuários** - Gerenciar usuários por tipo
- [x] **Dashboard** - Página inicial pós-login
- [x] **CORS** - Integração backend ↔ frontend 100%
- [x] **Responsive Design** - Mobile-friendly
- [x] **ES Modules** - Backend 100% moderno (import/export)
- [x] **Middleware JWT** - Proteção de rotas
- [x] **Seed Data** - Dados iniciais para teste

### 🔄 Em Desenvolvimento

- [ ] Triagem e fila de espera
- [ ] Agendamentos
- [ ] Prontuário médico
- [ ] Prescrições
- [ ] Relatórios

---

## 👥 Usuários de Teste

| Username  | Password | Tipo     | Email                 |
| --------- | -------- | -------- | --------------------- |
| admin     | 123456   | Admin    | admin@unima.local     |
| medico1   | 123456   | Médico   | medico1@unima.local   |
| paciente1 | 123456   | Paciente | paciente1@unima.local |

---

## 📂 Estrutura do Projeto

```
SOS-Saúde/
├── sos_saude_backend/        # Backend (Node.js + ES Modules)
│   └── sos-saude-node/
│       ├── src/
│       │   ├── app.js        # Entry point (Express)
│       │   ├── config/db.js  # MySQL config
│       │   ├── controllers/  # Lógica de negócio
│       │   ├── routes/       # Endpoints API
│       │   ├── middleware/   # JWT, CORS, etc
│       │   ├── services/     # Banco de dados
│       │   └── utils/        # Utilities (JWT, responses)
│       ├── .env              # Config MySQL local
│       └── init-seed.sql     # Dados iniciais (admin, users, patients)
│
├── frontend/                 # Frontend (Next.js 14)
│   ├── app/                  # Páginas (login, dashboard, etc)
│   ├── components/           # Componentes React
│   ├── lib/                  # Utilities (API client, auth)
│   ├── hooks/                # Custom hooks (useAuth, useApi)
│   └── .env.local            # Config (NEXT_PUBLIC_API_URL)
│
├── Banco de dados.sql             # Schema MySQL completo
├── SETUP_DESENVOLVIMENTO.md        # Guia detalhado de setup
├── RESUMO_CORREÇÕES_FINAL.md      # Mudanças realizadas (IMPORTANTE!)
├── LISTA_ARQUIVOS_MODIFICADOS.md  # Detalhes técnicos de cada arquivo
├── start.bat                       # Script Windows
├── start.sh                        # Script Linux/Mac
└── README.md                       # Este arquivo
```

---

## 🔧 Endpoints da API

### Autenticação (Público)

```
POST /api/auth/login           → Login com username/password
GET  /api/auth/me              → Dados do usuário autenticado (requer JWT)
```

### Pacientes (Protegido com JWT)

```
GET    /api/pacientes           → Listar todos (com filtro search opcional)
GET    /api/pacientes/:id       → Buscar paciente por ID
POST   /api/pacientes           → Criar novo paciente
PUT    /api/pacientes/:id       → Atualizar dados do paciente
DELETE /api/pacientes/:id       → Remover paciente
```

### Usuários (Protegido com JWT)

```
GET  /api/users                → Listar todos os usuários
GET  /api/users/:id            → Buscar usuário específico
```

### Health Check (Público)

```
GET  /health                   → Status do servidor
GET  /                         → Mensagem de boas-vindas
```

---

## 🌐 Variáveis de Ambiente

### Backend (`.env` na raiz do backend)

```env
PORT=3000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=root
DB_NAME=unima_health_system
JWT_SECRET=unima_secret_key
JWT_EXP=7d
NODE_ENV=development
ALLOWED_ORIGINS=http://localhost:3001,http://localhost:3000
```

### Frontend (`.env.local` na raiz do frontend)

```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

---

## 📦 Tecnologias Utilizadas

### Backend

- **Runtime:** Node.js 18+
- **Framework:** Express 4.18
- **Modules:** ES Modules (import/export)
- **Database:** MySQL 5.7+ (mysql2/promise)
- **Auth:** JWT (jsonwebtoken 9.0)
- **Security:** Helmet, CORS, Rate Limiting
- **Async:** async/await nativa

### Frontend

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS 3.4
- **UI:** React 18.3
- **Forms:** React Hook Form 7.51 + Zod 3.23
- **HTTP:** Axios 1.7
- **Notifications:** react-hot-toast 2.4
- **Icons:** lucide-react 0.424

---

## 🚀 Como Rodar em Desenvolvimento

### ✅ Verificação Pré-requisitos

```bash
node --version   # Deve ser >= 18
npm --version    # Qualquer versão recente
mysql --version  # Deve estar instalado
```

### Passo 1: Configurar Banco de Dados

```bash
# Criar banco e tabelas
mysql -u root -p < "Banco de dados.sql"

# Entrar no MySQL e verificar
mysql -u root -p
mysql> USE unima_health_system;
mysql> SHOW TABLES;
mysql> SELECT COUNT(*) FROM users;

# Inserir dados de teste
cd sos_saude_backend/sos-saude-node
mysql -u root -p unima_health_system < init-seed.sql

# Verificar inserção
mysql -u root -p unima_health_system
mysql> SELECT username, email FROM users;
# Deve retornar: admin, medico1, paciente1
```

### Passo 2: Rodar Backend

```bash
cd sos_saude_backend/sos-saude-node

# Primeira vez: instalar dependências
npm install

# Rodar em modo desenvolvimento
npm run dev

# Esperado:
# 🚀 Servidor rodando na porta 3000
# 📍 CORS ativado para: http://localhost:3000,http://localhost:3001
# 🗄️  Banco de dados: localhost
```

### Passo 3: Rodar Frontend

```bash
cd frontend

# Primeira vez: instalar dependências
npm install

# Rodar em modo desenvolvimento
npm run dev

# Esperado:
# > ready - started server on 0.0.0.0:3001, url: http://localhost:3001
```

### Passo 4: Acessar e Testar

1. Abra `http://localhost:3001` no navegador
2. Faça login com `admin` / `123456`
3. Veja a lista de pacientes
4. Tente criar um novo paciente
5. Consulte os logs do backend para ver as requisições

---

## 📡 Exemplos de Requisições

### Login

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "123456"
  }'

# Resposta:
# {
#   "success": true,
#   "data": {
#     "token": "eyJhbGc...",
#     "user": {
#       "id": 1,
#       "username": "admin",
#       "email": "admin@unima.local",
#       "name": "Admin SOS"
#     }
#   }
# }
```

### Listar Pacientes (com Token)

```bash
curl -X GET http://localhost:3000/api/pacientes \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"

# Resposta:
# {
#   "success": true,
#   "data": [
#     {
#       "id": 1,
#       "patient_number": "PAT-00001",
#       "first_name": "Maria",
#       "last_name": "Santos",
#       ...
#     }
#   ]
# }
```

### Criar Paciente

```bash
curl -X POST http://localhost:3000/api/pacientes \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -d '{
    "firstName": "João",
    "lastName": "Silva",
    "email": "joao@example.com",
    "phone": "11987654321",
    "blood_type": "O+"
  }'
```

---

## 🔍 Validações Realizadas

✅ **ES Modules**

- Todo backend convertido de CommonJS para import/export
- `"type": "module"` habilitado no package.json
- Todos os imports incluem extensão `.js`

✅ **Autenticação JWT**

- Login funciona corretamente
- Token é gerado com ID e role do usuário
- Middleware valida token em rotas protegidas
- Retorna 401/403 apropriadamente

✅ **Padrão de Respostas**

- Todas as respostas: `{ success, data, message?, error? }`
- Status codes apropriados (200, 201, 400, 401, 404, 500)

✅ **CORS**

- Frontend em localhost:3001 pode acessar backend
- Métodos: GET, POST, PUT, DELETE, OPTIONS, PATCH

✅ **Banco de Dados**

- Schema está correto (todas as tabelas)
- Foreign keys e índices presentes
- Seed data com usuários de teste

---

## ⚠️ Notas Importantes

### Senhas em Texto Plano (Desenvolvimento)

**Aviso:** As senhas nos dados de teste estão em texto plano por conveniência de desenvolvimento.
**Para Produção:** Use bcrypt com salt >= 10.

### JWT Secret

**Aviso:** `JWT_SECRET=unima_secret_key` é apenas para desenvolvimento.
**Para Produção:** Use uma string aleatória forte de 32+ caracteres.

### Expiração do Token

Tokens expiram em 7 dias. Implemente refresh token para renovação automática.

---

## 🐛 Troubleshooting

### Erro: "Cannot find module"

```bash
cd sos_saude_backend/sos-saude-node
npm install
cd ../../frontend
npm install
```

### Erro: "ECONNREFUSED" (MySQL)

MySQL não está rodando:

```bash
# Windows
# Inicie MySQL via Services ou MySQL Workbench

# Mac
brew services start mysql

# Linux
sudo service mysql start
```

### Erro: "EADDRINUSE :::3000"

Porta 3000 em uso. Mude a porta no `.env`:

```env
PORT=3001
```

### Erro: CORS

Frontend não consegue acessar backend:

1. Verifique NEXT_PUBLIC_API_URL em .env.local
2. Verifique allowed origins em app.js
3. Verifique se backend está rodando

### Login não funciona

1. Verifique credenciais: `mysql unima_health_system -e "SELECT username, password_hash FROM users;"`
2. Verifique JWT_SECRET no .env
3. Verifique logs do backend (npm run dev)

---

## 📖 Documentação Completa

Para informações detalhadas, consulte:

1. **[SETUP_DESENVOLVIMENTO.md](./SETUP_DESENVOLVIMENTO.md)**
   - Guia passo a passo detalhado
   - Troubleshooting completo
   - Próximas etapas

2. **[RESUMO_CORREÇÕES_FINAL.md](./RESUMO_CORREÇÕES_FINAL.md)** ⭐ **LEIA ISTO PRIMEIRO**
   - O que foi mudado e por quê
   - Lista de endpoints com exemplos
   - Todos os pontos de melhoria

3. **[LISTA_ARQUIVOS_MODIFICADOS.md](./LISTA_ARQUIVOS_MODIFICADOS.md)**
   - Detalhes técnicos de cada arquivo
   - Linhas modificadas
   - Estrutura final

---

## ✨ O Que Foi Feito

### 🔄 Conversão para ES Modules (24 arquivos)

- ✅ app.js
- ✅ todos os controllers
- ✅ todas as rotas
- ✅ middleware
- ✅ utils
- ✅ services
- ✅ config

### 🔐 Segurança

- ✅ JWT authentication
- ✅ CORS configurado
- ✅ Rate limiting
- ✅ Helmet.js

### 🗄️ Banco de Dados

- ✅ Schema MySQL completo
- ✅ Seed data com usuários teste
- ✅ Relações FK

### 📚 Documentação

- ✅ 3 arquivos de documentação
- ✅ 2 scripts de inicialização
- ✅ Exemplos de API

---

## 🚀 Roadmap

### Fase 1: ✅ Concluído

- [x] Setup inicial
- [x] Autenticação JWT
- [x] CRUD básico
- [x] ES Modules
- [x] Documentação

### Fase 2: 🔄 Próxima

- [ ] Triagem
- [ ] Agendamentos
- [ ] Prontuário

### Fase 3: ⏳ Planejado

- [ ] Testes automatizados
- [ ] CI/CD (GitHub Actions)
- [ ] Docker
- [ ] Deployment (Vercel + Railway)

---

## 💡 Dicas

### Modo Debug

```bash
# Backend com nodemon (reload automático)
npm run dev

# Frontend com hot reload (automático)
npm run dev

# Console do navegador (F12)
```

### Testar com curl

```bash
# Health check
curl http://localhost:3000/health

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"123456"}'
```

---

## 📞 Suporte

Em caso de dúvidas:

1. Verifique os logs do terminal (backend: npm run dev)
2. Abra DevTools do navegador (F12) → Console e Network
3. Verifique os arquivos `.env`
4. Leia os documentos: SETUP_DESENVOLVIMENTO.md, RESUMO_CORREÇÕES_FINAL.md

---

## 📄 Licença

MIT - Projeto educacional para Universidade UNIMA

---

## 👨‍💻 Status Final

```
Backend:  ✅ 100% Funcional (ES Modules)
Frontend: ✅ 100% Funcional (Next.js 14)
Database: ✅ 100% Funcionando (MySQL)
Auth:     ✅ 100% JWT Implementado
CRUD:     ✅ Parcialmente Completo
Docs:     ✅ 100% Completa
```

**Versão:** 1.0.0  
**Data:** 27 de novembro de 2024  
**Status:** ✅ **PRONTO PARA DESENVOLVIMENTO**

---

🎉 **O projeto está 100% funcional e pronto para começar a desenvolver!** 🎉

✅ Backend rodando em: **http://localhost:3000**

### 2️⃣ Frontend

```bash
# Abra outra aba do terminal
cd frontend

# Instale dependências
npm install

# O .env.local já tem o default (http://localhost:3000)
# Se precisar alterar, edite o arquivo

# Execute
npm run dev
```

✅ Frontend rodando em: **http://localhost:3001**

### 3️⃣ Acesse e Teste

Abra http://localhost:3001 no navegador

**Usuários de teste:**
| Username | Senha | Tipo |
|----------|-------|------|
| `admin` | `123456` | Admin |
| `medico1` | `123456` | Doctor |
| `paciente1` | `123456` | Patient |

---

## 🏗️ Arquitetura e Fluxo

### Frontend → Backend (Fluxo de Dados)

```
Componente React
    ↓
apiService.ts (função específica)
    ↓
api.ts (Axios + JWT interceptor)
    ↓
Backend API (http://localhost:3000)
    ↓
Resposta: { success: true, data: {...} }
    ↓
Componente atualiza estado
```

### Exemplo: Listar Pacientes

```typescript
// 1. Componente chama a função
import { pacientesAPI } from '@/lib/apiService';

const pacientes = await pacientesAPI.getAll();

// 2. apiService faz requisição padronizada
// GET /api/pacientes
// Header: Authorization: Bearer <token>

// 3. Backend retorna
{
  "success": true,
  "data": [
    {
      "id": 1,
      "first_name": "Maria",
      "last_name": "Santos",
      "email": "maria@example.com",
      ...
    }
  ]
}

// 4. Componente renderiza os dados
```

---

## 🔑 Endpoints da API

Todos os endpoints protegidos requerem header: `Authorization: Bearer <token>`

### Autenticação (Pública)

- `POST /api/auth/login` - Login
- `POST /api/auth/register` - Registrar novo usuário
- `GET /api/auth/me` - Obter dados do usuário autenticado

### Pacientes

- `GET /api/pacientes` - Listar todos
- `GET /api/pacientes/:id` - Obter um paciente
- `POST /api/pacientes` - Criar novo
- `PUT /api/pacientes/:id` - Atualizar
- `DELETE /api/pacientes/:id` - Remover

### Usuários

- `GET /api/users` - Listar todos
- `GET /api/users/:id` - Obter um usuário

### Agendamentos

- `GET /api/appointments` - Listar
- `POST /api/appointments` - Criar
- `PUT /api/appointments/:id` - Atualizar
- `DELETE /api/appointments/:id` - Remover

### Médicos

- `GET /api/doctors` - Listar
- `GET /api/doctors/:id` - Obter um médico
- `GET /api/doctors/stats/:id` - Estatísticas

### Prontuário

- `GET /api/medical-records` - Listar
- `POST /api/medical-records` - Criar
- `PUT /api/medical-records/:id` - Atualizar

### Triagem

- `GET /api/triage/fila` - Fila de triagem
- `POST /api/triage/tickets` - Criar ticket
- `POST /api/triage/fila/proximo` - Próximo paciente

---

## 🌍 Variáveis de Ambiente

### Backend (.env)

```env
# Servidor
PORT=3000
NODE_ENV=development

# Banco de dados
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=unima_health_system

# JWT
JWT_SECRET=unima_secret_key

# CORS
ALLOWED_ORIGINS=http://localhost:3001,http://localhost:3000
```

### Frontend (.env.local)

```env
# API do backend
NEXT_PUBLIC_API_URL=http://localhost:3000

# Para produção:
# NEXT_PUBLIC_API_URL=https://seu-backend.com
```

---

## 📦 Build para Produção

### Frontend

```bash
cd frontend
npm run build
npm start
```

### Backend

```bash
cd sos_saude_backend/sos-saude-node
npm install --production
NODE_ENV=production node src/app.js
```

---

## 🐳 Docker (Opcional)

```bash
# Levantar tudo (MySQL + Backend)
docker-compose up -d

# Parar
docker-compose down
```

---

## 📖 Documentação Completa

Para informações sobre deployment, troubleshooting e checklist de produção:

👉 **[VER DEPLOYMENT.md](./DEPLOYMENT.md)**

---

## 🛠️ Estrutura de Pastas

```
Project-Unima-2/
├── sos_saude_backend/sos-saude-node/     # Backend Express
│   ├── src/
│   │   ├── app.js                         # Entrada principal
│   │   ├── config/db.js                   # Conexão MySQL
│   │   ├── controllers/                   # Lógica de negócio
│   │   ├── routes/                        # Definição de rotas
│   │   ├── services/                      # Camada de dados
│   │   ├── middleware/                    # Auth, CORS, etc
│   │   └── utils/                         # Funções auxiliares
│   ├── .env.example
│   └── package.json
│
├── frontend/                               # Frontend Next.js
│   ├── app/                               # Pages (App Router)
│   ├── components/                        # Componentes React
│   ├── lib/                               # Utilitários
│   │   ├── api.ts                         # Axios instance
│   │   ├── apiService.ts                  # Chamadas API
│   │   ├── auth.ts                        # Gerenciar token
│   │   └── utils.ts                       # Funções auxiliares
│   ├── hooks/                             # Custom hooks
│   ├── types/                             # TypeScript interfaces
│   ├── .env.local
│   └── package.json
│
├── Banco de dados.sql                     # Schema do banco
├── DEPLOYMENT.md                           # Guia completo de deploy
└── README.md                               # Este arquivo
```

---

## ✅ Checklist: Tudo Funcionando?

- [ ] Backend rodando em http://localhost:3000
- [ ] Frontend rodando em http://localhost:3001
- [ ] Consegue fazer login com `admin` / `123456`
- [ ] Consegue ver lista de pacientes
- [ ] Consegue criar novo paciente
- [ ] Consegue listar usuários
- [ ] Console do browser está limpo (sem erros)
- [ ] Network tab mostra requisições sendo feitas

Se algum item falhar, consulte **[DEPLOYMENT.md](./DEPLOYMENT.md)** na seção **Troubleshooting**.

---

## 🤝 Contribuindo

1. Crie uma branch: `git checkout -b feature/sua-funcionalidade`
2. Commit suas mudanças: `git commit -m 'Adicionar nova funcionalidade'`
3. Push: `git push origin feature/sua-funcionalidade`
4. Abra um Pull Request

---

## 📄 Licença

Este projeto está sob a licença MIT. Veja LICENSE para mais detalhes.

---

## 📞 Suporte

Para dúvidas ou problemas:

1. Verificar logs do backend: `node src/app.js`
2. Verificar console do navegador (F12)
3. Consultar seção **Troubleshooting** em **[DEPLOYMENT.md](./DEPLOYMENT.md)**

---

**Última atualização:** 27 de novembro de 2025 ✨

### Modo de Desenvolvimento

#### Opção 1: Modo Mock (Recomendado para começar)

Sem precisar configurar banco de dados:

```bash
# Terminal 1: Backend em modo mock
npm run dev:mock

# Terminal 2: Frontend
cd frontend
npm run dev
```

Acesse:

- Frontend: http://localhost:3001
- Backend API: http://localhost:3000

#### Opção 2: Modo Real com Docker

```bash
# Inicia MySQL e API em containers
docker-compose up -d

# Inicia o frontend
cd frontend
npm run dev
```

#### Opção 3: Modo Real (Local)

1. Configure o banco de dados MySQL
2. Crie um arquivo `.env` na raiz:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=sua_senha
DB_NAME=unima_health_system
JWT_SECRET=sua_chave_secreta
FRONTEND_URL=http://localhost:3001
```

3. Execute o script SQL em `initdb/init.sql` ou `Banco de dados.sql`
4. Inicie o servidor:

```bash
# Terminal 1: Backend
npm run dev

# Terminal 2: Frontend
cd frontend
npm run dev
```

## 👤 Usuários de Teste (Modo Mock)

| Username    | Email              | Senha  | Tipo    |
| ----------- | ------------------ | ------ | ------- |
| `admin`     | admin@unima.com    | 123456 | Admin   |
| `medico1`   | medico@unima.com   | 123456 | Doctor  |
| `paciente1` | paciente@unima.com | 123456 | Patient |

## 📚 Documentação da API

### Autenticação

#### Login

```http
POST /api/auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "123456"
}
```

**Resposta:**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "admin",
    "name": "Admin Sistema",
    "email": "admin@unima.com",
    "userType": "Admin"
  }
}
```

### Usuários

#### Listar usuários (Apenas Admin)

```http
GET /api/users
Authorization: Bearer {token}
```

#### Criar usuário (Apenas Admin)

```http
POST /api/users
Authorization: Bearer {token}
Content-Type: application/json

{
  "username": "usuario",
  "email": "email@exemplo.com",
  "password": "senha123",
  "first_name": "Nome",
  "last_name": "Sobrenome",
  "user_type_id": 5,
  "active": true
}
```

### Pacientes

#### Listar pacientes (Admin, Doctor, Nurse, Receptionist)

```http
GET /api/pacientes
Authorization: Bearer {token}
```

#### Criar paciente (Admin, Doctor, Nurse, Receptionist)

```http
POST /api/pacientes
Authorization: Bearer {token}
Content-Type: application/json

{
  "firstName": "Maria",
  "lastName": "Silva",
  "email": "maria@email.com",  // Opcional
  "symptoms": ["febre", "tosse", "dor de cabeça"]
}
```

**Resposta:**

```json
{
  "message": "Paciente registrado com sucesso",
  "firstName": "Maria",
  "lastName": "Silva",
  "riskScore": "Média",
  "username": "maria_silva",
  "email": "maria_silva@unima.com"
}
```

> **Nota:** A senha padrão para pacientes criados é `123456`. O username é gerado automaticamente baseado no email.

## 🔧 Scripts Disponíveis

### Backend

```bash
# Desenvolvimento com banco real
npm run dev

# Desenvolvimento com dados mockados
npm run dev:mock

# Produção
npm start

# Produção com mock
npm run start:mock

# Testes
npm test

# Lint
npm run lint
```

### Frontend

```bash
cd frontend

# Desenvolvimento
npm run dev

# Build para produção
npm run build

# Iniciar produção
npm start

# Lint
npm run lint
```

## 🎭 Modo Mock

O projeto suporta modo mock para desenvolvimento sem banco de dados. Ative usando a variável de ambiente:

```bash
USE_MOCK=true npm run dev
```

Ou use o script dedicado:

```bash
npm run dev:mock
```

No modo mock:

- Não é necessário banco de dados MySQL
- Dados são armazenados em memória
- Usuários de teste pré-configurados
- Perfeito para desenvolvimento rápido

## 🏗️ Estrutura do Projeto

```
Project-Unima-2/
├── config/
│   └── db.js              # Configuração do banco (suporta mock)
├── middleware/
│   └── auth.js            # Autenticação JWT e autorização
├── routes/
│   ├── users.js           # Rotas de usuários
│   └── pacientes.js       # Rotas de pacientes
├── tests/
│   ├── auth.test.js       # Testes de autenticação
│   └── health.test.js      # Testes de healthcheck
├── initdb/
│   └── init.sql           # Script de inicialização do banco
├── mockData.js            # Dados mockados para desenvolvimento
├── frontend/              # Aplicação Next.js
│   ├── app/               # App Router (Next.js 14)
│   ├── components/         # Componentes React
│   ├── hooks/             # Custom hooks
│   ├── lib/               # Utilitários e configurações
│   └── types/             # TypeScript types
├── app.js                 # Aplicação Express
├── index.js               # Ponto de entrada
└── package.json           # Dependências
```

## 🐳 Docker

### Iniciar ambiente completo

```bash
docker-compose up -d
```

### Parar ambiente

```bash
docker-compose down
```

### Ver logs

```bash
docker-compose logs -f api
```

## 🧪 Testes

```bash
# Executar todos os testes
npm test

# Executar testes em modo watch
npm test -- --watch
```

## 🔒 Segurança

- ✅ Helmet.js para headers de segurança
- ✅ Rate limiting (100 req/15min)
- ✅ CORS configurável
- ✅ Senhas hasheadas com bcrypt
- ✅ JWT com expiração (8 horas)
- ✅ Controle de acesso baseado em roles
- ✅ Validação de dados de entrada

## 📝 Variáveis de Ambiente

### Backend (.env na raiz)

```env
# Banco de Dados
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=unima_health_system

# JWT
JWT_SECRET=sua_chave_secreta_aqui

# Frontend
FRONTEND_URL=http://localhost:3001

# Modo Mock (opcional)
USE_MOCK=false
```

### Frontend (.env.local em frontend/)

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

## 🎨 Funcionalidades do Frontend

### Dashboard

- Estatísticas de pacientes (apenas para Admin/Doctor/Nurse/Receptionist)
- Visão geral do sistema
- Cards informativos

### Gestão de Pacientes

- Lista de pacientes com busca
- Cadastro de novos pacientes
- Visualização de sintomas e risco calculado
- Cores visuais para níveis de risco (Alta/Média/Baixa)

### Gestão de Usuários (Apenas Admin)

- Lista de usuários
- Cadastro de novos usuários
- Controle de tipos de usuário

### Controle de Acesso

- Pacientes não podem ver lista de pacientes
- Pacientes não podem cadastrar novos pacientes
- Apenas Admin pode gerenciar usuários
- Rotas protegidas com autenticação

## 🚀 Deploy no AWS Amplify

### Configuração do Frontend

O projeto já está configurado com `amplify.yml` para deploy no AWS Amplify.

#### Passos para Deploy:

1. **Conectar Repositório no AWS Amplify**
   - Acesse o console do AWS Amplify
   - Conecte o repositório GitHub: `Guilhermegg-06/Project-Unima-2`
   - Selecione o branch `main`

2. **Configurar Variáveis de Ambiente**

   No console do Amplify, vá em **App settings > Environment variables** e adicione:

   ```
   NEXT_PUBLIC_API_URL=https://seu-backend-url.com
   ```

   **Importante:** Substitua `https://seu-backend-url.com` pela URL real do seu backend em produção.

3. **Configurações de Build**

   O Amplify detectará automaticamente o arquivo `amplify.yml` na raiz do projeto. As configurações são:
   - **Base directory:** `frontend` (detectado automaticamente)
   - **Build command:** `npm run build` (executado dentro de `frontend/`)
   - **Output directory:** `.next` (gerado automaticamente pelo Next.js)

4. **Deploy do Backend**

   O AWS Amplify faz deploy apenas do frontend. O backend precisa ser deployado separadamente:

   **Opções recomendadas:**
   - **AWS Elastic Beanstalk** (mais simples para Node.js/Express)
   - **AWS EC2** (mais controle)
   - **AWS ECS/Fargate** (para containers Docker)

   Após fazer deploy do backend, atualize a variável `NEXT_PUBLIC_API_URL` no Amplify com a URL do backend.

### Variáveis de Ambiente no Amplify

| Variável              | Descrição                           | Exemplo                      |
| --------------------- | ----------------------------------- | ---------------------------- |
| `NEXT_PUBLIC_API_URL` | URL completa do backend em produção | `https://api.seudominio.com` |

**Nota:** Variáveis que começam com `NEXT_PUBLIC_` são expostas ao cliente e podem ser acessadas no código do frontend.

### Troubleshooting

- **Build falha:** Verifique os logs no console do Amplify
- **Erro 403:** Verifique se a URL do backend está correta e se o CORS está configurado
- **Página em branco:** Verifique se `NEXT_PUBLIC_API_URL` está configurada corretamente

## 🖥️ Deploy do Backend na AWS (Passo a Passo)

### O que é a URL do Backend em Produção?

A URL do backend em produção é o endereço onde sua API Node.js/Express estará rodando na AWS. Exemplos:

- `https://unima-api.us-east-1.elasticbeanstalk.com`
- `https://api.seudominio.com`
- `https://abc123.execute-api.us-east-1.amazonaws.com`

Essa URL será usada no frontend (via variável `NEXT_PUBLIC_API_URL`) para fazer requisições à API.

### Opções de Deploy

**Opção 1: AWS Elastic Beanstalk (RECOMENDADA - Mais Simples)**

- ✅ Gerenciamento automático de servidores
- ✅ Escalabilidade automática
- ✅ Fácil de configurar
- 💰 Custo: ~$15-30/mês

**Opção 2: AWS EC2**

- Mais controle, mas mais complexo
- 💰 Custo: ~$10-50/mês

**Opção 3: AWS ECS/Fargate**

- Para containers Docker
- 💰 Custo: ~$20-40/mês

---

## 📋 Guia Completo: Deploy no AWS Elastic Beanstalk

### Pré-requisitos

1. Conta AWS ativa
2. AWS CLI instalado ([Download aqui](https://aws.amazon.com/cli/))
3. EB CLI instalado (ferramenta do Elastic Beanstalk)

### Passo 1: Instalar EB CLI

**Windows (PowerShell):**

```powershell
pip install awsebcli
```

**Linux/Mac:**

```bash
pip3 install awsebcli
```

**Verificar instalação:**

```bash
eb --version
```

### Passo 2: Configurar Credenciais AWS

1. Acesse o [Console AWS](https://console.aws.amazon.com/)
2. Vá em **IAM > Users > Seu Usuário > Security Credentials**
3. Clique em **Create Access Key**
4. Baixe as credenciais (Access Key ID e Secret Access Key)

**Configurar no terminal:**

```bash
aws configure
```

Digite:

- AWS Access Key ID: [sua access key]
- AWS Secret Access Key: [sua secret key]
- Default region: `us-east-1` (ou a região mais próxima)
- Default output format: `json`

### Passo 3: Criar Banco de Dados RDS MySQL

1. **Acesse o Console AWS RDS:**
   - Vá em [RDS Console](https://console.aws.amazon.com/rds/)
   - Clique em **Create database**

2. **Configurar Banco:**
   - **Engine:** MySQL
   - **Version:** MySQL 8.0
   - **Template:** Free tier (para testes) ou Production
   - **DB instance identifier:** `unima-health-db`
   - **Master username:** `admin` (ou outro)
   - **Master password:** [crie uma senha forte]
   - **DB instance class:** `db.t3.micro` (free tier) ou maior
   - **Storage:** 20 GB (mínimo)
   - **VPC:** Default VPC
   - **Public access:** Yes (para facilitar conexão inicial)

3. **Criar e anotar:**
   - Anote o **Endpoint** (ex: `unima-health-db.abc123.us-east-1.rds.amazonaws.com`)
   - Anote o **Port** (padrão: 3306)
   - Anote o **Username** e **Password**

4. **Configurar Security Group:**
   - Vá em **VPC Security Groups**
   - Encontre o security group do RDS
   - Adicione regra de entrada:
     - Type: MySQL/Aurora
     - Port: 3306
     - Source: Seu IP ou 0.0.0.0/0 (apenas para testes)

5. **Importar Schema:**
   - Conecte ao banco usando MySQL Workbench ou linha de comando
   - Execute o arquivo `Banco de dados.sql` ou `initdb/init.sql`

### Passo 4: Preparar Projeto para Deploy

O projeto já está preparado com:

- ✅ `.ebextensions/nodecommand.config` - Configuração do Node.js
- ✅ `.ebignore` - Arquivos a ignorar no deploy
- ✅ CORS configurado para aceitar URLs do Amplify

**Verificar se está tudo certo:**

```bash
# Na raiz do projeto
ls -la .ebextensions/
ls -la .ebignore
```

### Passo 5: Inicializar Aplicação no Elastic Beanstalk

**Na raiz do projeto (onde está o package.json):**

```bash
eb init
```

**Responda as perguntas:**

1. **Select a region:** Escolha a mesma região do RDS (ex: `us-east-1`)
2. **Application name:** `unima-health-api` (ou outro nome)
3. **Platform:** Node.js
4. **Platform version:** Node.js 18 (ou a versão mais recente)
5. **SSH:** Yes (para debug se necessário)
6. **Keypair:** Crie um novo ou use existente

### Passo 6: Criar Ambiente e Fazer Deploy

```bash
eb create unima-health-env
```

Isso vai:

- Criar o ambiente no Elastic Beanstalk
- Fazer upload do código
- Instalar dependências
- Iniciar a aplicação

**Aguarde 5-10 minutos** enquanto o ambiente é criado.

### Passo 7: Configurar Variáveis de Ambiente

Após o deploy, configure as variáveis de ambiente:

```bash
eb setenv \
  DB_HOST=unima-health-db.abc123.us-east-1.rds.amazonaws.com \
  DB_USER=admin \
  DB_PASSWORD=sua_senha_aqui \
  DB_NAME=unima_health_system \
  JWT_SECRET=sua_chave_secreta_forte_aqui \
  NODE_ENV=production \
  PORT=8080 \
  FRONTEND_URL=https://main.d1234567890.amplifyapp.com
```

**OU configure pelo console:**

1. Acesse [Elastic Beanstalk Console](https://console.aws.amazon.com/elasticbeanstalk/)
2. Selecione sua aplicação e ambiente
3. Vá em **Configuration > Software > Environment properties**
4. Adicione as variáveis:
   - `DB_HOST`: Endpoint do RDS
   - `DB_USER`: Usuário do banco
   - `DB_PASSWORD`: Senha do banco
   - `DB_NAME`: `unima_health_system`
   - `JWT_SECRET`: [gere uma chave forte]
   - `NODE_ENV`: `production`
   - `PORT`: `8080`
   - `FRONTEND_URL`: URL do seu frontend no Amplify

### Passo 8: Obter URL do Backend

Após o deploy, você verá a URL no terminal ou no console:

```bash
eb status
```

A URL será algo como:

```
CNAME: unima-health-env.abc123.us-east-1.elasticbeanstalk.com
```

**URL completa:** `http://unima-health-env.abc123.us-east-1.elasticbeanstalk.com`

**Para HTTPS (recomendado):**

1. No console do Elastic Beanstalk
2. Vá em **Configuration > Load balancer**
3. Adicione certificado SSL (pode usar AWS Certificate Manager)

### Passo 9: Testar o Backend

```bash
# Testar healthcheck
curl http://unima-health-env.abc123.us-east-1.elasticbeanstalk.com/health

# Deve retornar: {"status":"ok"}
```

### Passo 10: Configurar Frontend no Amplify

1. Acesse o [Amplify Console](https://console.aws.amazon.com/amplify/)
2. Selecione sua aplicação
3. Vá em **App settings > Environment variables**
4. Adicione/Atualize:
   ```
   NEXT_PUBLIC_API_URL=http://unima-health-env.abc123.us-east-1.elasticbeanstalk.com
   ```
5. Faça um novo deploy (ou aguarde o próximo)

### Comandos Úteis do EB CLI

```bash
# Ver status do ambiente
eb status

# Ver logs
eb logs

# Abrir no navegador
eb open

# Fazer novo deploy após mudanças
eb deploy

# SSH no servidor (para debug)
eb ssh

# Listar ambientes
eb list

# Terminar ambiente (CUIDADO: apaga tudo)
eb terminate
```

### Troubleshooting

**Erro de conexão com banco:**

- Verifique se o Security Group do RDS permite conexões do Elastic Beanstalk
- Verifique se as credenciais estão corretas
- Verifique se o endpoint do RDS está correto

**Erro 502 Bad Gateway:**

- Verifique os logs: `eb logs`
- Verifique se a porta está configurada como 8080
- Verifique se o processo está rodando: `eb ssh` e depois `ps aux | grep node`

**CORS bloqueando requisições:**

- Verifique se `FRONTEND_URL` está configurada com a URL correta do Amplify
- O CORS já está configurado para aceitar URLs do Amplify automaticamente

**Aplicação não inicia:**

- Verifique os logs: `eb logs`
- Verifique se todas as variáveis de ambiente estão configuradas
- Verifique se o `package.json` tem o script `start` correto

### Custos Estimados

**Free Tier (primeiros 12 meses):**

- RDS: 750 horas/mês grátis (db.t3.micro)
- Elastic Beanstalk: Grátis (você paga apenas pelos recursos EC2)
- EC2: 750 horas/mês grátis (t2.micro)

**Após Free Tier:**

- RDS db.t3.micro: ~$15/mês
- EC2 t2.micro: ~$10/mês
- **Total estimado:** ~$25-30/mês

### Próximos Passos

1. ✅ Backend deployado
2. ✅ URL do backend obtida
3. ✅ Frontend configurado no Amplify com `NEXT_PUBLIC_API_URL`
4. ✅ Testar integração completa
5. 🔒 Configurar HTTPS (recomendado)
6. 📊 Configurar monitoramento (CloudWatch)

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT.

## 🙏 Agradecimentos

- UNIMA - Universidade de Maceió
- Comunidade Node.js
- Comunidade Next.js

---

⭐ Se este projeto foi útil, considere dar uma estrela!
