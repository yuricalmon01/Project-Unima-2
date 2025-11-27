# 🚀 Guia de Deployment - SOS Saúde

## Resumo das Mudanças Realizadas

### ✅ Backend (Node.js + Express)

1. **Novos Endpoints Implementados:**
   - `GET /api/pacientes` - Listar pacientes
   - `GET /api/pacientes/:id` - Buscar paciente
   - `POST /api/pacientes` - Criar novo paciente
   - `PUT /api/pacientes/:id` - Atualizar paciente
   - `DELETE /api/pacientes/:id` - Remover paciente
   - `GET /api/users` - Listar usuários
   - `GET /api/users/:id` - Buscar usuário
   - `GET /api/auth/me` - Obter dados do usuário autenticado

2. **Novas Estruturas Criadas:**
   - `src/controllers/pacientesController.js` - Controller de pacientes
   - `src/controllers/usersController.js` - Controller de usuários
   - `src/services/pacientesService.js` - Service de pacientes
   - `src/routes/pacientesRoutes.js` - Rotas de pacientes
   - `src/routes/usersRoutes.js` - Rotas de usuários

3. **Melhorias:**
   - CORS configurado para aceitar requests do frontend local e de produção
   - Endpoint `GET /api/auth/me` para validar token JWT
   - Resposta padronizada em todos os endpoints: `{ success: boolean, data: any, message?: string, error?: string }`
   - Middleware de autenticação JWT em todas as rotas protegidas
   - Rate limiting (100 requests por 15 minutos)

### ✅ Frontend (Next.js 14)

1. **Nova Camada de API (`frontend/lib/apiService.ts`):**
   - Funções centralizadas para autenticação (login, getMe)
   - Funções para CRUD de pacientes
   - Funções para listar usuários
   - Funções para agendamentos, médicos, prontuários, medicamentos e triagem
   - Tratamento automático de erros 401 (logout)

2. **Componentes Atualizados:**
   - `LoginForm.tsx` - Usa `authAPI.login()`
   - `PacientesList.tsx` - Usa `pacientesAPI.getAll()` com estado React
   - `NovoPacienteForm.tsx` - Usa `pacientesAPI.create()`
   - `UsuariosList.tsx` - Usa `usersAPI.getAll()` com estado React

3. **Variáveis de Ambiente:**
   - Criado `.env.local` e `.env.example` com `NEXT_PUBLIC_API_URL`
   - Default para desenvolvimento: `http://localhost:3000`

---

## 🏃 Como Executar Localmente

### Pré-requisitos
- Node.js 16+ e npm/yarn
- MySQL 5.7+ rodando
- Banco de dados `unima_health_system` criado

### 1. Clonar Repositório
```bash
git clone https://github.com/yuricalmon01/Project-Unima-2.git
cd Project-Unima-2
```

### 2. Configurar e Rodar Backend

```bash
cd sos_saude_backend/sos-saude-node

# Instalar dependências
npm install

# Criar arquivo .env (copiar de .env.example)
cp .env.example .env

# Editar .env com suas credenciais MySQL
# DB_HOST=localhost
# DB_USER=root
# DB_PASSWORD=sua_senha
# DB_NAME=unima_health_system

# Rodar o servidor
node src/app.js
# ou para desenvolvimento com auto-reload
npm install -g nodemon
nodemon src/app.js
```

Backend estará disponível em: **http://localhost:3000**

### 3. Configurar e Rodar Frontend

```bash
cd frontend

# Instalar dependências
npm install

# Criar arquivo .env.local (já existe com valores padrão)
# NEXT_PUBLIC_API_URL=http://localhost:3000

# Rodar em desenvolvimento
npm run dev
```

Frontend estará disponível em: **http://localhost:3001**

### 4. Testar a Integração

**Usuários de Teste:**
- Username: `admin` | Senha: `123456` (Admin)
- Username: `medico1` | Senha: `123456` (Doctor)
- Username: `paciente1` | Senha: `123456` (Patient)

Acesse http://localhost:3001 e faça login!

---

## 📦 Variáveis de Ambiente Necessárias

### Backend (.env)
```env
# Servidor
PORT=3000
NODE_ENV=production

# Banco de dados
DB_HOST=seu-rds-endpoint.rds.amazonaws.com
DB_USER=admin
DB_PASSWORD=sua-senha-forte
DB_NAME=unima_health_system

# JWT
JWT_SECRET=sua-chave-secreta-muito-segura

# CORS
ALLOWED_ORIGINS=https://seu-frontend.vercel.app,https://seu-frontend.amplify.example.com
```

### Frontend (.env.local ou variáveis de build)
```env
NEXT_PUBLIC_API_URL=https://seu-backend.example.com
```

---

## 🚀 Deployment em Produção

### Opção 1: AWS (Backend + Amplify/Vercel para Frontend)

#### Backend em EC2 com Docker

1. **Criar Dockerfile** (na raiz de `sos_saude_backend/sos-saude-node`):
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY . .

ENV NODE_ENV=production
EXPOSE 3000

CMD ["node", "src/app.js"]
```

2. **Build e deploy:**
```bash
# Build da imagem Docker
docker build -t sos-saude-backend:latest .

# Tag para ECR (AWS)
docker tag sos-saude-backend:latest 123456789.dkr.ecr.us-east-1.amazonaws.com/sos-saude-backend:latest

# Push para ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 123456789.dkr.ecr.us-east-1.amazonaws.com
docker push 123456789.dkr.ecr.us-east-1.amazonaws.com/sos-saude-backend:latest
```

3. **Em EC2:**
   - Instale Docker
   - Configure security group para porta 3000
   - Execute: `docker run -d -p 3000:3000 -e DB_HOST=seu-rds.amazonaws.com ... sos-saude-backend:latest`

#### Frontend em Vercel ou AWS Amplify

**Vercel (Recomendado):**
1. Conectar repositório GitHub a https://vercel.com
2. Configurar variável de ambiente: `NEXT_PUBLIC_API_URL=https://seu-backend-api.com`
3. Deploy automático em cada push

**AWS Amplify:**
1. Conectar repositório em AWS Amplify Console
2. Configurar build settings:
```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - npm ci
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: .next
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*
env:
  NEXT_PUBLIC_API_URL: https://seu-backend-api.com
```

#### RDS para Banco de Dados
1. Criar instância RDS MySQL 5.7+
2. Segurança: Security Group permitindo porta 3306 apenas de EC2
3. Executar `Banco de dados.sql` para criar schema

### Opção 2: Outras Plataformas

**Railway.app:**
```bash
# Backend
npm install -g railway
railway init
railway link
railway up
```

**Render.com:**
- Conectar repositório
- Runtime: Node 18
- Build command: `npm install`
- Start command: `node src/app.js`

---

## ✅ Checklist de Deploy para Produção

- [ ] Banco de dados MySQL criado e acessível
- [ ] Variáveis de ambiente configuradas (.env backend, env vars frontend)
- [ ] JWT_SECRET alterado (não usar valor default)
- [ ] CORS configurado com URLs de produção
- [ ] SSL/HTTPS habilitado
- [ ] Rate limiting revisado
- [ ] Logs centralizados (CloudWatch, Papertrail, etc)
- [ ] Backup automático do banco configurado
- [ ] Monitoramento e alertas configurados
- [ ] Testes E2E executados
- [ ] Performance verificada (lighthouse, etc)
- [ ] Documentação de rollback criada

---

## 🔧 Troubleshooting

### "Erro de conexão com servidor"
- Verificar se backend está rodando: `curl http://localhost:3000/health`
- Verificar CORS: browser console mostra erro CORS?
- Verificar firewall: porta 3000 está aberta?

### "Erro 401 não autenticado"
- Token armazenado em localStorage?
- Token expirou? (JWT tem expiração de 8h)
- Header Authorization está sendo enviado? (verificar Network tab)

### "Erro de banco de dados"
- MySQL está rodando?
- Credenciais corretas no .env?
- Banco `unima_health_system` existe?
- Usuário MySQL tem permissões necessárias?

### Build Next.js falha
- Limpar cache: `rm -rf .next`
- Reinstalar: `rm -rf node_modules && npm install`
- Verificar tipos TypeScript: `npm run build`

---

## 📚 Estrutura de Pastas Final

```
Project-Unima-2/
├── sos_saude_backend/sos-saude-node/
│   ├── src/
│   │   ├── app.js (ATUALIZADO - CORS + novas rotas)
│   │   ├── config/db.js
│   │   ├── controllers/
│   │   │   ├── authController.js (ATUALIZADO - getMe)
│   │   │   ├── pacientesController.js (NOVO)
│   │   │   ├── usersController.js (NOVO)
│   │   │   └── ...
│   │   ├── services/
│   │   │   ├── pacientesService.js (NOVO)
│   │   │   └── ...
│   │   ├── routes/
│   │   │   ├── authRoutes.js (ATUALIZADO)
│   │   │   ├── pacientesRoutes.js (NOVO)
│   │   │   ├── usersRoutes.js (NOVO)
│   │   │   └── ...
│   │   ├── middleware/
│   │   └── utils/
│   ├── .env.example (NOVO)
│   └── package.json
├── frontend/
│   ├── lib/
│   │   ├── api.ts (Axios instance)
│   │   ├── apiService.ts (NOVO - camada API)
│   │   ├── auth.ts
│   │   └── utils.ts
│   ├── components/
│   │   ├── Auth/LoginForm.tsx (ATUALIZADO)
│   │   ├── Pacientes/ (ATUALIZADO)
│   │   ├── Usuarios/ (ATUALIZADO)
│   │   └── ...
│   ├── hooks/useApi.ts
│   ├── .env.local (NOVO)
│   ├── .env.example (NOVO)
│   ├── package.json
│   └── ...
└── ...
```

---

## 📝 Notas Importantes

1. **Não foi alterada a lógica de negócio** dos módulos de triagem, notificações e prontuário médico - eles continuam funcionando normalmente

2. **Frontend agora consome API real**, sem mocks (exceto dados de exemplo na tela de login)

3. **Token JWT é armazenado em localStorage** - considere usar httpOnly cookies em produção para maior segurança

4. **Rate limiting padrão é 100 requests por 15 minutos** - ajustar conforme necessário

5. **CORS está configurado para aceitar requests de**:
   - `http://localhost:3001` (dev local Next.js)
   - `http://localhost:3000` (dev local alternativo)
   - `https://front-sos-saude.example.com` (ALTERAR para seu domínio)
   - `https://*.vercel.app` (Vercel)

---

## 🆘 Suporte

Para dúvidas ou problemas:
1. Verificar logs do backend: `node src/app.js`
2. Verificar console do browser (F12 > Console)
3. Network tab para ver requisições HTTP
4. Verificar arquivo README.md do projeto

---

**Última atualização:** 27 de novembro de 2025
