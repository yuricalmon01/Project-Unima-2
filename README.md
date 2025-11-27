# 🏥 Sistema de Saúde UNIMA

Sistema completo de gestão de saúde desenvolvido com Node.js + Express + MySQL no backend e Next.js 14 no frontend.

## 📋 Características Principais

### Backend
- ✅ Autenticação JWT
- ✅ Sistema de roles (Admin, Doctor, Nurse, Receptionist, Patient)
- ✅ CRUD completo de usuários, pacientes e agendamentos
- ✅ Sistema de triagem com cálculo de risco automático
- ✅ Prontuário médico eletrônico
- ✅ Gestão de medicamentos
- ✅ Notificações em tempo real
- ✅ CORS configurado para frontend em dev e produção
- ✅ Rate limiting para segurança
- ✅ Docker support

### Frontend
- ✅ Interface moderna com Next.js 14 (App Router)
- ✅ TypeScript para type safety
- ✅ Tailwind CSS para estilização responsiva
- ✅ Autenticação protegida com Context API + JWT
- ✅ Controle de acesso baseado em roles
- ✅ Camada de API centralizada (apiService.ts)
- ✅ Toast notifications para feedback do usuário
- ✅ Design responsivo mobile-first

## ⚡ Início Rápido (5 minutos)

### Pré-requisitos
- Node.js 18+
- npm ou yarn
- MySQL 5.7+ (com banco `unima_health_system` criado)

### 1️⃣ Backend

```bash
# Entre na pasta do backend
cd sos_saude_backend/sos-saude-node

# Instale dependências
npm install

# Configure variáveis de ambiente
cp .env.example .env
# Edite .env com suas credenciais MySQL

# Execute o servidor
node src/app.js
```

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
