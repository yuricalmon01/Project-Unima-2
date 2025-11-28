-- ============================================
-- DADOS INICIAIS PARA O BANCO DE DADOS
-- Execute este script no MySQL Workbench após criar as tabelas
-- ============================================

USE unima_health_system;

-- ============================================
-- INSERIR TIPOS DE USUÁRIO (se não existirem)
-- ============================================

INSERT IGNORE INTO user_types (id, name, description, permissions) VALUES
(1, 'Admin', 'Administrador do sistema', '{"all": true}'),
(2, 'Doctor', 'Médico', '{"patients": "read,write", "appointments": "read,write", "medical_records": "read,write"}'),
(3, 'Nurse', 'Enfermeiro(a)', '{"patients": "read,write", "appointments": "read", "vital_signs": "read,write"}'),
(4, 'Receptionist', 'Recepcionista', '{"patients": "read,write", "appointments": "read,write"}'),
(5, 'Patient', 'Paciente', '{"own_data": "read", "appointments": "read"}');

-- ============================================
-- INSERIR USUÁRIOS DE TESTE
-- Senha padrão para todos: 123456
-- Hash bcrypt: $2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy
-- ============================================

-- Usuário Admin
INSERT INTO users (
    user_type_id,
    username,
    email,
    password_hash,
    first_name,
    last_name,
    active,
    created_at
) VALUES (
    1, -- Admin
    'admin',
    'admin@unima.com',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', -- hash de '123456'
    'Admin',
    'Sistema',
    1,
    NOW()
) ON DUPLICATE KEY UPDATE username = username;

-- Usuário Médico
INSERT INTO users (
    user_type_id,
    username,
    email,
    password_hash,
    first_name,
    last_name,
    active,
    created_at
) VALUES (
    2, -- Doctor
    'medico1',
    'medico1@unima.com',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', -- hash de '123456'
    'Maria',
    'Souza',
    1,
    NOW()
) ON DUPLICATE KEY UPDATE username = username;

-- Usuário Paciente
INSERT INTO users (
    user_type_id,
    username,
    email,
    password_hash,
    first_name,
    last_name,
    active,
    created_at
) VALUES (
    5, -- Patient
    'paciente1',
    'paciente1@unima.com',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', -- hash de '123456'
    'João',
    'Silva',
    1,
    NOW()
) ON DUPLICATE KEY UPDATE username = username;

-- ============================================
-- VERIFICAÇÃO
-- ============================================

SELECT '✅ Dados iniciais inseridos com sucesso!' AS status;
SELECT id, username, email, user_type_id FROM users;

