# 🏥 Sistema de Saúde UNIMA - API REST

API REST desenvolvida em Node.js + Express + MySQL para gerenciamento de sistema de saúde.

## 📋 Características

- ✅ Autenticação JWT
- ✅ Sistema de roles (Admin, Doctor, Patient)
- ✅ CRUD de usuários e pacientes
- ✅ Sistema de triagem com cálculo de risco
- ✅ Modo Mock para desenvolvimento rápido
- ✅ Docker Compose para ambiente completo
- ✅ Testes automatizados

## 🚀 Início Rápido

### Pré-requisitos

- Node.js 18+ 
- Docker e Docker Compose (opcional)
- MySQL 8+ (se não usar Docker)

### Instalação

```bash
# Clone o repositório
git clone https://github.com/yuricalmon01/Project-Unima-2.git
cd Project-Unima-2

# Instale as dependências
npm install
```

### Modo de Desenvolvimento

#### Opção 1: Modo Mock (Recomendado para começar)

Sem precisar configurar banco de dados:

```bash
npm run dev:mock
```

#### Opção 2: Modo Real com Docker

```bash
# Inicia MySQL e API em containers
docker-compose up
```

#### Opção 3: Modo Real (Local)

1. Configure o banco de dados MySQL
2. Crie um arquivo `.env`:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=sua_senha
DB_NAME=unima_health_system
JWT_SECRET=sua_chave_secreta
FRONTEND_URL=http://localhost:3000
```

3. Execute o script SQL em `initdb/init.sql` ou `Banco de dados.sql`
4. Inicie o servidor:

```bash
npm run dev
```

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

#### Registro
```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "novo_usuario",
  "email": "usuario@email.com",
  "password": "senha123",
  "firstName": "Nome",
  "lastName": "Sobrenome",
  "userTypeId": 5
}
```

### Usuários

#### Listar usuários (Admin)
```http
GET /api/users
Authorization: Bearer {token}
```

#### Buscar usuário por ID
```http
GET /api/users/:id
Authorization: Bearer {token}
```

#### Criar usuário (Admin)
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

#### Listar pacientes
```http
GET /api/pacientes
Authorization: Bearer {token}
```

#### Criar paciente
```http
POST /api/pacientes
Authorization: Bearer {token}
Content-Type: application/json

{
  "firstName": "Maria",
  "lastName": "Silva",
  "symptoms": ["febre", "tosse"]
}
```

## 🔧 Scripts Disponíveis

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

## 🎭 Modo Mock

O projeto suporta modo mock para desenvolvimento sem banco de dados. Veja [README_MOCK.md](./README_MOCK.md) para mais detalhes.

### Usuários Mockados

| Username | Email | Senha | Tipo |
|----------|-------|-------|------|
| `admin` | admin@unima.com | 123456 | Admin |
| `medico1` | medico@unima.com | 123456 | Doctor |
| `paciente1` | paciente@unima.com | 123456 | Patient |

## 🏗️ Estrutura do Projeto

```
Project-Unima-2/
├── config/
│   └── db.js              # Configuração do banco (suporta mock)
├── middleware/
│   └── auth.js            # Autenticação JWT
├── routes/
│   ├── users.js           # Rotas de usuários
│   └── pacientes.js       # Rotas de pacientes
├── tests/
│   ├── auth.test.js       # Testes de autenticação
│   └── health.test.js     # Testes de healthcheck
├── initdb/
│   └── init.sql           # Script de inicialização do banco
├── mockData.js            # Dados mockados para desenvolvimento
├── app.js                 # Aplicação Express
├── index.js              # Ponto de entrada
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
- ✅ JWT com expiração

## 📝 Variáveis de Ambiente

```env
# Banco de Dados
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=unima_health_system

# JWT
JWT_SECRET=sua_chave_secreta_aqui

# Frontend
FRONTEND_URL=http://localhost:3000

# Modo Mock (opcional)
USE_MOCK=false
```

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT.

## 👥 Autores

- **Yuri Calmon** - [GitHub](https://github.com/yuricalmon01)

## 🙏 Agradecimentos

- UNIMA - Universidade de Maceió
- Comunidade Node.js

---

⭐ Se este projeto foi útil, considere dar uma estrela!

