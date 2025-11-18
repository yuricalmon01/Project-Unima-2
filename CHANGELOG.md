# Changelog

## [1.1.0] - 2025-01-XX

### ✨ Adicionado
- Sistema de dados mockados para desenvolvimento rápido
- Scripts `dev:mock` e `start:mock` para rodar sem banco de dados
- README.md principal com documentação completa
- README_MOCK.md com guia do modo mock
- Configuração centralizada do banco em `config/db.js`
- Suporte a alternância automática entre modo mock e real

### 🗑️ Removido
- Diretório `mvp-mocado/` (código antigo não utilizado)
- Arquivo `requirements.txt` (projeto Python antigo)
- Código de upload (multer) não utilizado
- Dependências não utilizadas (`multer`, `path`)

### 🔧 Otimizado
- Configuração do banco centralizada em `config/db.js`
- Rotas otimizadas para usar pool centralizado
- Imports organizados (bcrypt movido para topo)
- `.gitignore` atualizado com mais padrões

### 📝 Documentação
- README.md completo com instruções de uso
- README_MOCK.md com guia do modo mock
- Documentação de API endpoints
- Exemplos de uso

## [1.0.0] - Versão Inicial

### ✨ Funcionalidades
- API REST com Express
- Autenticação JWT
- CRUD de usuários e pacientes
- Sistema de triagem
- Docker Compose
- Testes automatizados

