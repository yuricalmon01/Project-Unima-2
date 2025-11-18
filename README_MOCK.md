# 🚀 Modo Mock - Desenvolvimento Rápido

Este projeto suporta **modo mock** para desenvolvimento sem precisar configurar o banco de dados MySQL.

## Como Usar

### Opção 1: Variável de Ambiente
```bash
# Windows (PowerShell)
$env:USE_MOCK="true"; npm run dev

# Linux/Mac
USE_MOCK=true npm run dev
```

### Opção 2: Scripts NPM (Recomendado)
```bash
# Modo desenvolvimento com mock
npm run dev:mock

# Modo produção com mock
npm run start:mock
```

## Usuários Mockados

### Admin
- **Username:** `admin`
- **Email:** `admin@unima.com`
- **Senha:** `123456`
- **Tipo:** Admin

### Médico
- **Username:** `medico1`
- **Email:** `medico@unima.com`
- **Senha:** `123456`
- **Tipo:** Doctor

### Paciente
- **Username:** `paciente1`
- **Email:** `paciente@unima.com`
- **Senha:** `123456`
- **Tipo:** Patient

## Vantagens do Modo Mock

✅ **Sem configuração de banco** - Funciona imediatamente  
✅ **Desenvolvimento rápido** - Sem esperar por conexões  
✅ **Testes isolados** - Dados resetam a cada reinício  
✅ **Fácil debug** - Dados em memória, fácil de inspecionar  

## Quando Usar

- 🧪 **Desenvolvimento local** - Quando você só quer testar a API
- 🚀 **Demos rápidas** - Para mostrar funcionalidades sem setup
- 🐛 **Debug** - Para isolar problemas sem interferência do DB
- 📝 **Testes** - Para testes unitários e de integração

## Modo Real (MySQL)

Para usar o banco de dados real, simplesmente não defina `USE_MOCK`:

```bash
npm run dev
```

Ou configure as variáveis de ambiente no `.env`:
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=sua_senha
DB_NAME=unima_health_system
```

## Notas

- Os dados mockados são **resetados** a cada reinício do servidor
- O modo mock **não persiste** dados entre execuções
- Para produção, sempre use o **modo real** com MySQL

