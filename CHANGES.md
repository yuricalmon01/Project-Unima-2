# 📝 Resumo das Mudanças - Frontend + Backend Integration

**Data:** 27 de novembro de 2025  
**Objetivo:** Remover mocks do frontend e conectar à API real do backend

---

## ✅ Mudanças Realizadas

### 🔧 BACKEND (sos_saude_backend/sos-saude-node)

#### Novos Arquivos Criados:

1. **src/controllers/pacientesController.js**
   - Implementa CRUD de pacientes
   - Usa PacientesService
   - Retorna respostas padronizadas

2. **src/controllers/usersController.js**
   - `getAll()` - Listar usuários
   - `getById()` - Obter usuário
   - `getMe()` - Obter dados do usuário autenticado (requer JWT)

3. **src/services/pacientesService.js**
   - Gerencia operações com pacientes
   - Cria usuário associado ao paciente
   - Gera patient_number e username únicos
   - Suporta transações no banco

4. **src/routes/pacientesRoutes.js**
   - Define rotas: GET, POST, PUT, DELETE para `/api/pacientes`

5. **src/routes/usersRoutes.js**
   - Define rotas: GET para `/api/users` e `/api/users/:id`

6. **.env.example**
   - Template com variáveis necessárias
   - Comentários explicativos

#### Arquivos Modificados:

1. **src/app.js** ⭐ IMPORTANTE
   ```javascript
   // Antes: CORS com cors() padrão
   // Depois: CORS configurável com URLs brancas
   
   // Antes: rotas básicas
   // Depois: incluindo /api/pacientes e /api/users
   ```

2. **src/controllers/authController.js**
   ```javascript
   // Antes: login retorna apenas { token, user: { id, username } }
   // Depois: login retorna user completo com { id, username, email, first_name, last_name, name, userType }
   
   // Novo: exports.getMe() para GET /api/auth/me
   ```

3. **src/routes/authRoutes.js**
   ```javascript
   // Antes: POST /api/auth/login, POST /api/auth/register
   // Depois: + GET /api/auth/me (com autenticação JWT)
   ```

#### Detalhes Técnicos:

- **Padrão de Resposta:**
  ```json
  {
    "success": true,
    "data": { ... },
    "message": "Operação bem-sucedida"
  }
  ```

- **CORS configurado para:**
  - http://localhost:3001 (Next.js dev)
  - http://localhost:3000 (dev alternativo)
  - https://front-sos-saude.example.com (produção - ALTERAR)
  - https://*.vercel.app (Vercel deployments)

- **JWT Middleware:** Aplicado a rotas protegidas
- **Rate Limiting:** 100 requisições por 15 minutos

---

### 🎨 FRONTEND (frontend)

#### Novos Arquivos Criados:

1. **lib/apiService.ts** ⭐ IMPORTANTE
   - Camada centralizada de API
   - Funções para: auth, pacientes, users, doctors, appointments, etc
   - Cada função cuida de parsing da resposta
   - Intercepta erros 401 para logout automático
   
   Funções principais:
   ```typescript
   authAPI.login()
   authAPI.getMe()
   pacientesAPI.getAll()
   pacientesAPI.create()
   pacientesAPI.getById()
   usersAPI.getAll()
   appointmentsAPI.getAll()
   doctorsAPI.getAll()
   medicalRecordsAPI.getAll()
   triageAPI.getQueue()
   ```

2. **.env.local**
   - `NEXT_PUBLIC_API_URL=http://localhost:3000`
   - Para produção, alterar para URL do backend real

3. **.env.example**
   - Template com instruções

#### Arquivos Modificados:

1. **components/Auth/LoginForm.tsx**
   ```typescript
   // Antes: import api from '@/lib/api'; api.post('/api/auth/login')
   // Depois: import { authAPI } from '@/lib/apiService'; authAPI.login()
   ```

2. **components/Pacientes/PacientesList.tsx**
   ```typescript
   // Antes: useApi hook com '/api/pacientes'
   // Depois: useEffect + pacientesAPI.getAll() com estado React
   ```

3. **components/Pacientes/NovoPacienteForm.tsx**
   ```typescript
   // Antes: api.post('/api/pacientes', payload)
   // Depois: pacientesAPI.create(payload)
   ```

4. **components/Usuarios/UsuariosList.tsx**
   ```typescript
   // Antes: useApi hook com '/api/users'
   // Depois: useEffect + usersAPI.getAll() com estado React
   ```

#### Removido:
- ❌ Dependência de `useApi` hook em algumas componentes (mantida em outras para compatibilidade)
- ❌ Uso de dados mock (foram substituídos por chamadas API)

---

## 🚀 O que Funciona Agora

### Fluxo Completo:

1. **Login:**
   - Usuario digita credenciais
   - Frontend chama `authAPI.login()`
   - Backend valida e retorna token + dados do usuário
   - Token armazenado em localStorage
   - Redireciona para dashboard

2. **Listar Pacientes:**
   - `PacientesList` carrega em useEffect
   - Chama `pacientesAPI.getAll()`
   - Header Authorization: Bearer <token> adicionado automaticamente
   - Backend retorna lista de pacientes
   - Componente renderiza em grid

3. **Criar Paciente:**
   - Form preenche dados
   - Chama `pacientesAPI.create()`
   - Backend cria user + patient (transação)
   - Retorna username para login do novo paciente
   - Redireciona para lista

4. **Listar Usuários:**
   - `UsuariosList` carrega
   - Chama `usersAPI.getAll()`
   - Exibe cards dos usuários

---

## 🔒 Segurança

### JWT (JSON Web Tokens)
- ✅ Gerado no login, válido por 8 horas
- ✅ Armazenado em localStorage
- ✅ Adicionado automaticamente em todas as requisições
- ✅ Validado no backend para rotas protegidas
- ✅ Logout automático se 401

### CORS
- ✅ Apenas origins whitelisted
- ✅ Credenciais permitidas
- ✅ Métodos limitados (GET, POST, PUT, DELETE, OPTIONS, PATCH)

### Rate Limiting
- ✅ 100 requisições por 15 minutos por IP

---

## 📋 Variáveis de Ambiente

### Backend (.env)
```env
PORT=3000
NODE_ENV=production
DB_HOST=seu-rds.amazonaws.com
DB_USER=admin
DB_PASSWORD=senha-forte
DB_NAME=unima_health_system
JWT_SECRET=chave-secreta-segura
ALLOWED_ORIGINS=https://seu-frontend.vercel.app
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=https://seu-backend-api.com
```

---

## 🧪 Teste Local

```bash
# Terminal 1: Backend
cd sos_saude_backend/sos-saude-node
npm install
node src/app.js

# Terminal 2: Frontend
cd frontend
npm install
npm run dev

# Acessar http://localhost:3001
# Login com: admin / 123456
```

---

## 📦 Build Produção

```bash
# Backend
NODE_ENV=production node src/app.js

# Frontend
npm run build
npm start
```

---

## ⚠️ Notas Importantes

1. **Não alteradas:**
   - Lógica de triagem
   - Lógica de notificações
   - Lógica de prontuário
   - Schema do banco de dados

2. **Compatibilidade:**
   - Todos os endpoints antigos continuam funcionando
   - Response padronizada em novos endpoints

3. **Próximos Passos (Opcional):**
   - Migrar useApi hook para funções específicas em outros componentes
   - Implementar refresh token para JWT
   - Adicionar httpOnly cookies (mais seguro que localStorage)
   - Testar E2E com Cypress/Playwright

---

## 🔗 Referências

- [DEPLOYMENT.md](./DEPLOYMENT.md) - Guia completo de deploy
- [README.md](./README.md) - Instruções gerais
- Docs Next.js: https://nextjs.org/docs
- Docs Express: https://expressjs.com
- JWT.io: https://jwt.io

---

**Desenvolvido com ❤️ em 27 de novembro de 2025**
