# SOS Saúde - Guia de Desenvolvimento

## Requisitos
- Node.js >= 18
- MySQL 5.7+
- npm ou yarn

## Estrutura do Projeto

```
sos_saude_backend/sos-saude-node/  → Backend (Node.js + Express + MySQL)
frontend/                          → Frontend (Next.js 14 + React + TypeScript)
```

## Setup do Banco de Dados

### 1. Criar o banco de dados
Execute o script SQL com o schema completo:

```bash
mysql -u root -p < "Banco de dados.sql"
```

### 2. Inserir dados iniciais
Execute o script de seed com usuários de teste:

```bash
cd sos_saude_backend/sos-saude-node
mysql -u root -p unima_health_system < init-seed.sql
```

**Usuários de teste criados:**
- `admin` / `123456` (Administrador)
- `medico1` / `123456` (Médico)
- `paciente1` / `123456` (Paciente)

### 3. Verificar credenciais no .env
Arquivo: `sos_saude_backend/sos-saude-node/.env`

```env
DB_HOST=localhost        # ou 127.0.0.1
DB_USER=root            # seu usuário MySQL
DB_PASSWORD=root        # sua senha MySQL
DB_NAME=unima_health_system
PORT=3000
JWT_SECRET=unima_secret_key
```

## Executar o Projeto em Desenvolvimento

### Backend (Node.js + Express)

```bash
# Navegar até a pasta backend
cd sos_saude_backend/sos-saude-node

# Instalar dependências
npm install

# Rodar em modo desenvolvimento (com nodemon)
npm run dev
```

Esperado:
```
🚀 Servidor rodando na porta 3000
🗄️  Banco de dados: localhost
```

### Frontend (Next.js)

Em outro terminal:

```bash
# Navegar até a pasta frontend
cd frontend

# Instalar dependências (se não tiver instalado ainda)
npm install

# Rodar em modo desenvolvimento
npm run dev
```

Esperado:
```
> ready - started server on 0.0.0.0:3001, url: http://localhost:3001
```

## Acessar o Sistema

Abra `http://localhost:3001` no navegador.

**Tela de Login:**
- Username: `admin`
- Password: `123456`

Ou use os outros usuários de teste (medico1 ou paciente1).

## Endpoints da API

### Health Check
```
GET http://localhost:3000/
GET http://localhost:3000/health
```

### Autenticação (Público)
```
POST /api/auth/login
{
  "username": "admin",
  "password": "123456"
}

Resposta:
{
  "success": true,
  "data": {
    "token": "eyJhbGc...",
    "user": {
      "id": 1,
      "username": "admin",
      "email": "admin@unima.local",
      "name": "Admin SOS"
    }
  }
}
```

### Pacientes (Protegido - requer JWT)
```
GET /api/pacientes
GET /api/pacientes/:id
POST /api/pacientes
PUT /api/pacientes/:id
DELETE /api/pacientes/:id
```

### Usuários (Protegido - requer JWT)
```
GET /api/users
GET /api/users/:id
```

**Header obrigatório para rotas protegidas:**
```
Authorization: Bearer <token>
```

## Padronização de Respostas

### Sucesso
```json
{
  "success": true,
  "data": { /* objeto ou array */ },
  "message": "Operação realizada com sucesso"
}
```

### Erro
```json
{
  "success": false,
  "error": "Descrição do erro"
}
```

## Environment Variables

### Backend (.env na raiz do backend)
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

### Frontend (.env.local na raiz do frontend)
```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

## Módulos do Sistema

### ✅ Implementados e Funcionando
- **Autenticação**: Login com JWT, middleware de proteção
- **Usuários**: CRUD básico com tipos de usuário
- **Pacientes**: CRUD completo com criação automática de perfil de paciente

### 🔄 Em Desenvolvimento
- **Triagem**: Endpoints retornam 501 Not Implemented (estrutura pronta)
- **Agendamentos**: Endpoints retornam 501 Not Implemented
- **Médicos/Profissionais**: Endpoints retornam 501 Not Implemented
- **Prontuário**: Endpoints retornam 501 Not Implemented

### 📝 Notas Técnicas

#### ES Modules
O projeto usa ES Modules (import/export) em todo o backend. O package.json contém `"type": "module"`.

#### Senhas em Desenvolvimento
As senhas de teste estão em **texto plano** para facilitar desenvolvimento. Em produção, usar bcrypt!

#### JWT
- Secret: `unima_secret_key` (mudar em produção!)
- Expiração: `7d`
- Payload: `{ id, role }`

#### CORS
Configurado para aceitar:
- `http://localhost:3001` (Frontend)
- `http://localhost:3000` (Alternativo)
- Dominios em produção (configurar no app.js)

## Troubleshooting

### Erro: "Cannot find module 'dotenv'"
```bash
cd sos_saude_backend/sos-saude-node
npm install
```

### Erro: "listen EADDRINUSE :::3000"
Porta 3000 já está em uso. Ou:
1. Mate o processo na porta 3000
2. Mude a porta no .env (PORT=3001)

### Erro de conexão ao banco de dados
Verifique:
1. MySQL está rodando? `mysql -u root -p` (deve conectar)
2. Credenciais no .env (DB_USER, DB_PASSWORD)
3. Banco foi criado? `mysql -u root -p -e "SHOW DATABASES;"`

### Token inválido/expirado no Frontend
O token está sendo salvo em localStorage. Faça logout e login novamente.

## Próximas Etapas

1. Implementar endpoints comentados em app.js (triage, appointments, doctors, etc.)
2. Implementar validação de BCrypt para senhas
3. Adicionar mais validações com Zod no frontend
4. Implementar refresh token
5. Adicionar logs estruturados
6. Testes automatizados com Jest

---

**Dúvidas?** Verifique os logs no terminal do backend e do frontend para mais informações sobre erros.
