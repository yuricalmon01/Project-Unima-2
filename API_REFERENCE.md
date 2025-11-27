# 📡 Referência Completa de Endpoints da API

## Base URL
```
Desenvolvimento: http://localhost:3000
Produção: https://seu-backend-api.com
```

## Headers Obrigatórios

**Rotas Autenticadas:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
```

---

## 🔓 AUTENTICAÇÃO (Públicas)

### POST /api/auth/login
Fazer login no sistema

**Request:**
```json
{
  "username": "admin",
  "password": "123456"
}
```

**Response 200:**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "username": "admin",
      "email": "admin@unima.com",
      "first_name": "Admin",
      "last_name": "Sistema",
      "name": "Admin Sistema",
      "userType": "Admin",
      "user_type_id": 1
    }
  }
}
```

**Response 401:**
```json
{
  "success": false,
  "error": "Credenciais inválidas"
}
```

### POST /api/auth/register
Registrar novo usuário

**Request:**
```json
{
  "username": "novo_usuario",
  "email": "novo@example.com",
  "password": "senha123",
  "first_name": "João",
  "last_name": "Silva",
  "user_type_id": 5
}
```

**Response 201:** (Similar ao login)

---

## 🔐 AUTENTICAÇÃO (Protegidas)

### GET /api/auth/me
Obter dados do usuário autenticado

**Headers Requerido:** `Authorization: Bearer <token>`

**Response 200:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "username": "admin",
    "email": "admin@unima.com",
    "first_name": "Admin",
    "last_name": "Sistema",
    "name": "Admin Sistema",
    "userType": "Admin",
    "user_type_id": 1,
    "cpf": "000.000.000-00",
    "phone": "(82) 99999-9999",
    "birth_date": "1990-01-01",
    "gender": "M"
  }
}
```

---

## 👥 USUÁRIOS (Protegidas)

### GET /api/users
Listar todos os usuários

**Response 200:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "username": "admin",
      "email": "admin@unima.com",
      "first_name": "Admin",
      "last_name": "Sistema",
      "userType": "Admin",
      "cpf": "000.000.000-00",
      "phone": "(82) 99999-9999",
      "birth_date": "1990-01-01",
      "gender": "M",
      "active": true,
      "created_at": "2025-11-27T10:00:00Z"
    }
  ]
}
```

### GET /api/users/:id
Obter um usuário específico

**URL:** `/api/users/1`

**Response 200:** (Mesmo formato acima, um usuário)

**Response 404:**
```json
{
  "success": false,
  "error": "Usuário não encontrado"
}
```

---

## 🏥 PACIENTES (Protegidas)

### GET /api/pacientes
Listar todos os pacientes

**Query Parameters:**
```
?search=João    # Buscar por nome, email ou patient_number
```

**Response 200:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "user_id": 3,
      "patient_number": "PAT-00001",
      "first_name": "Maria",
      "last_name": "Santos",
      "email": "maria@unima.com",
      "blood_type": "O+",
      "sus_card": null,
      "health_plan": null,
      "allergies": null,
      "chronic_conditions": null,
      "cpf": "222.222.222-22",
      "phone": "(82) 97777-7777",
      "birth_date": "1995-08-20",
      "gender": "F",
      "active": true,
      "created_at": "2025-11-27T10:00:00Z"
    }
  ]
}
```

### GET /api/pacientes/:id
Obter um paciente específico

**URL:** `/api/pacientes/1`

**Response 200:** (Mesmo formato acima, um paciente)

### POST /api/pacientes
Criar novo paciente

**Request:**
```json
{
  "firstName": "João",
  "lastName": "Silva",
  "email": "joao@example.com",
  "cpf": "123.456.789-00",
  "phone": "(82) 98888-8888",
  "birth_date": "1990-01-01",
  "gender": "M",
  "symptoms": ["febre", "tosse"],
  "blood_type": "A+",
  "sus_card": null,
  "health_plan": "Unimed"
}
```

**Response 201:**
```json
{
  "success": true,
  "data": {
    "id": 42,
    "user_id": 123,
    "username": "paciente_1732707600000",
    "patient_number": "PAT-00042",
    "email": "joao@example.com",
    "first_name": "João",
    "last_name": "Silva",
    "blood_type": "A+"
  },
  "message": "Paciente criado com sucesso"
}
```

### PUT /api/pacientes/:id
Atualizar um paciente

**URL:** `/api/pacientes/1`

**Request:**
```json
{
  "firstName": "João",
  "lastName": "Silva",
  "email": "novo@example.com",
  "phone": "(82) 99999-9999",
  "blood_type": "B-",
  "health_plan": "Bradesco"
}
```

**Response 200:**
```json
{
  "success": true,
  "data": {},
  "message": "Paciente atualizado com sucesso"
}
```

### DELETE /api/pacientes/:id
Remover um paciente

**URL:** `/api/pacientes/1`

**Response 200:**
```json
{
  "success": true,
  "data": {},
  "message": "Paciente removido com sucesso"
}
```

---

## 📅 AGENDAMENTOS (Protegidas)

### GET /api/appointments
Listar agendamentos

**Query Parameters:**
```
?patientId=1        # Filtrar por paciente
?doctorId=1         # Filtrar por médico
?date=2025-11-28    # Filtrar por data
```

**Response 200:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "patient_id": 1,
      "professional_id": 1,
      "health_unit_id": 1,
      "appointment_date": "2025-11-28T14:00:00Z",
      "duration_minutes": 30,
      "type": "Consulta",
      "status": "Agendado",
      "notes": "Consulta de rotina",
      "created_at": "2025-11-27T10:00:00Z"
    }
  ]
}
```

### GET /api/appointments/:id
Obter um agendamento

### POST /api/appointments
Criar agendamento

**Request:**
```json
{
  "patient_id": 1,
  "professional_id": 1,
  "health_unit_id": 1,
  "appointment_date": "2025-11-28T14:00:00Z",
  "duration_minutes": 30,
  "type": "Consulta",
  "status": "Agendado",
  "notes": "Consulta de rotina"
}
```

### PUT /api/appointments/:id
Atualizar agendamento

### DELETE /api/appointments/:id
Remover agendamento

---

## 👨‍⚕️ MÉDICOS/PROFISSIONAIS (Protegidas)

### GET /api/doctors
Listar médicos

**Response 200:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "professional_number": "123456",
      "license_number": "789456",
      "full_name": "Dr. João Silva",
      "email": "joao@unima.com",
      "phone": "(82) 98888-8888",
      "specialty": "Cardiologia",
      "health_unit": "Hospital Central",
      "is_active": true,
      "consultation_fee": 150.00
    }
  ]
}
```

### GET /api/doctors/:id
Obter um médico

### GET /api/doctors/stats/:id
Obter estatísticas de um médico

**Response 200:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "total_consultas": 45,
    "consultas_concluidas": 43,
    "total_pacientes": 32
  }
}
```

### POST /api/doctors
Criar médico

### PUT /api/doctors/:id
Atualizar médico

### DELETE /api/doctors/:id
Remover médico

---

## 📋 PRONTUÁRIO MÉDICO (Protegidas)

### GET /api/medical-records
Listar prontuários

### GET /api/medical-records/:id
Obter um prontuário

### GET /api/medical-records/patient/:patientId
Obter prontuários de um paciente

### POST /api/medical-records
Criar prontuário

**Request:**
```json
{
  "patient_id": 1,
  "appointment_id": 1,
  "professional_id": 1,
  "chief_complaint": "Dor no peito",
  "history_present_illness": "Começou há 2 dias",
  "physical_examination": "PA: 120/80, FC: 72",
  "diagnosis": "Dor musculoesquelética",
  "treatment": "Repouso e dipirona",
  "medications": ["Dipirona 500mg"]
}
```

### PUT /api/medical-records/:id
Atualizar prontuário

### DELETE /api/medical-records/:id
Remover prontuário

---

## 💊 MEDICAMENTOS (Protegidas)

### GET /api/medicines
Listar medicamentos

### GET /api/medicines/:id
Obter um medicamento

### POST /api/medicines
Criar medicamento

### PUT /api/medicines/:id
Atualizar medicamento

### DELETE /api/medicines/:id
Remover medicamento

---

## 🚨 TRIAGEM (Protegidas)

### GET /api/triage/fila
Obter fila de triagem

**Response 200:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "patient_id": 1,
      "patient_name": "Maria Santos",
      "risk_score": "Alta",
      "symptoms": ["febre", "tosse"],
      "status": "Aguardando",
      "created_at": "2025-11-27T10:00:00Z"
    }
  ]
}
```

### GET /api/triage/tickets/:id
Obter um ticket de triagem

### POST /api/triage/tickets
Criar ticket de triagem

**Request:**
```json
{
  "patient_id": 1,
  "symptoms": ["febre", "tosse"],
  "risk_score": "Média"
}
```

### POST /api/triage/fila/proximo
Obter próximo paciente na fila

**Response 200:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "patient_id": 1,
    "patient_name": "Maria Santos"
  }
}
```

### PUT /api/triage/tickets/:id
Atualizar ticket

### DELETE /api/triage/tickets/:id
Remover ticket

---

## 🔑 SENHA (Protegidas)

### POST /api/password/change
Alterar senha

**Request:**
```json
{
  "old_password": "senha_atual",
  "new_password": "nova_senha"
}
```

### POST /api/password/reset
Reset de senha

---

## ✅ HEALTH CHECK (Pública)

### GET /health
Verificar se servidor está vivo

**Response 200:**
```json
{
  "status": "ok"
}
```

---

## ⚠️ Códigos de Status HTTP

| Código | Significado |
|--------|-------------|
| 200 | OK - Requisição bem-sucedida |
| 201 | Created - Recurso criado |
| 400 | Bad Request - Dados inválidos |
| 401 | Unauthorized - Token faltando ou inválido |
| 403 | Forbidden - Acesso negado (role) |
| 404 | Not Found - Recurso não encontrado |
| 500 | Server Error - Erro interno do servidor |

---

## 🔒 Segurança

- JWT válido por **8 horas**
- Rate limit: **100 requisições por 15 minutos**
- CORS: **Whitelist de origins**
- Headers obrigatórios:
  - `Content-Type: application/json`
  - `Authorization: Bearer <token>` (exceto endpoints públicos)

---

## 📚 Exemplos com cURL

### Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"123456"}'
```

### Listar pacientes (com token)
```bash
TOKEN="seu_token_jwt_aqui"
curl http://localhost:3000/api/pacientes \
  -H "Authorization: Bearer $TOKEN"
```

### Criar paciente
```bash
TOKEN="seu_token_jwt_aqui"
curl -X POST http://localhost:3000/api/pacientes \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "João",
    "lastName": "Silva",
    "email": "joao@example.com"
  }'
```

---

**Última atualização:** 27 de novembro de 2025
