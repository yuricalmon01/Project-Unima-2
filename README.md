# 🏥 Sistema de Saúde UNIMA

Sistema completo de gestão de saúde desenvolvido com Node.js + Express + MySQL no backend e Next.js 14 no frontend.

## 📋 Características

### Backend
- ✅ Autenticação JWT
- ✅ Sistema de roles (Admin, Doctor, Nurse, Receptionist, Patient)
- ✅ CRUD de usuários e pacientes
- ✅ Sistema de triagem com cálculo de risco automático
- ✅ Modo Mock para desenvolvimento rápido (sem banco de dados)
- ✅ Docker Compose para ambiente completo
- ✅ Testes automatizados
- ✅ CORS configurado para frontend

### Frontend
- ✅ Interface moderna com Next.js 14 (App Router)
- ✅ TypeScript para type safety
- ✅ Tailwind CSS para estilização
- ✅ Autenticação protegida com Context API
- ✅ Controle de acesso baseado em roles
- ✅ Design responsivo e mobile-first
- ✅ Toast notifications para feedback

## 🚀 Início Rápido

### Pré-requisitos

- Node.js 18+
- npm ou yarn
- Docker e Docker Compose (opcional, para banco de dados)
- MySQL 8+ (se não usar Docker ou Mock)

### Instalação

```bash
# Clone o repositório
git clone https://github.com/yuricalmon01/Project-Unima-2.git
cd Project-Unima-2

# Instale as dependências do backend
npm install

# Instale as dependências do frontend
cd frontend
npm install
cd ..
```

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
