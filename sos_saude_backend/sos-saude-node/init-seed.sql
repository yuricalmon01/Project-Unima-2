-- ============================================
-- SEED DATA - SOS Saúde - Dados Iniciais
-- ============================================

USE unima_health_system;

-- ============================================
-- Limpar dados existentes (se necessário)
-- ============================================
-- TRUNCATE TABLE users;
-- TRUNCATE TABLE user_types;
-- TRUNCATE TABLE patients;

-- ============================================
-- Inserir Tipos de Usuário
-- ============================================
INSERT INTO user_types (id, name, description, permissions) VALUES
(1, 'Admin', 'Administrador do sistema', JSON_OBJECT('all', true)),
(2, 'Doctor', 'Médico/Profissional de saúde', JSON_OBJECT('patients', true, 'appointments', true)),
(3, 'Nurse', 'Enfermeiro', JSON_OBJECT('patients', true, 'triage', true)),
(4, 'Receptionist', 'Recepcionista', JSON_OBJECT('appointments', true, 'patients', true)),
(5, 'Patient', 'Paciente', JSON_OBJECT('appointments', true, 'medical_records', true))
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- ============================================
-- Criar Usuários de Teste
-- ============================================

-- Admin user (senha: 123456 em texto plano para desenvolvimento)
INSERT INTO users (id, user_type_id, username, email, password_hash, first_name, last_name, cpf, phone, birth_date, gender, active) VALUES
(1, 1, 'admin', 'admin@unima.local', '123456', 'Admin', 'SOS', '12345678901234', '11999999999', '1990-01-01', 'M', TRUE)
ON DUPLICATE KEY UPDATE username=VALUES(username);

-- Doctor user
INSERT INTO users (id, user_type_id, username, email, password_hash, first_name, last_name, cpf, phone, birth_date, gender, active) VALUES
(2, 2, 'medico1', 'medico1@unima.local', '123456', 'João', 'Silva', '12345678901235', '11988888888', '1985-05-15', 'M', TRUE)
ON DUPLICATE KEY UPDATE username=VALUES(username);

-- Patient user
INSERT INTO users (id, user_type_id, username, email, password_hash, first_name, last_name, cpf, phone, birth_date, gender, active) VALUES
(3, 5, 'paciente1', 'paciente1@unima.local', '123456', 'Maria', 'Santos', '12345678901236', '11987654321', '1992-03-20', 'F', TRUE)
ON DUPLICATE KEY UPDATE username=VALUES(username);

-- ============================================
-- Criar Pacientes Associados aos Usuários
-- ============================================

INSERT INTO patients (id, user_id, patient_number, sus_card, health_plan, blood_type, allergies, chronic_conditions, active) VALUES
(1, 3, 'PAT-00001', '123456789012345', 'Unimed', 'O+', 'Penicilina', 'Hipertensão', TRUE)
ON DUPLICATE KEY UPDATE patient_number=VALUES(patient_number);

-- ============================================
-- Inserir Especialidades
-- ============================================
INSERT INTO specialties (id, name, description, code, active) VALUES
(1, 'Clínica Geral', 'Clínico Geral', 'CG', TRUE),
(2, 'Cardiologia', 'Cardiologia', 'CA', TRUE),
(3, 'Pediatria', 'Pediatra', 'PE', TRUE),
(4, 'Ginecologia', 'Ginecologista', 'GI', TRUE),
(5, 'Ortopedia', 'Ortopedista', 'OR', TRUE)
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- ============================================
-- Inserir Unidades de Saúde
-- ============================================
INSERT INTO health_units (id, name, type, cnpj, phone, email, address, city, state, zip_code, active) VALUES
(1, 'Clínica Central', 'Clínica', '12345678901234', '1133334444', 'central@unima.local', 'Rua Central, 100', 'São Paulo', 'SP', '01234567', TRUE),
(2, 'UBS Zona Leste', 'UBS', '12345678901235', '1144445555', 'ubs-leste@unima.local', 'Rua Leste, 200', 'São Paulo', 'SP', '01234568', TRUE)
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- ============================================
-- Inserir Healthcare Professionals (Médicos)
-- ============================================
INSERT INTO healthcare_professionals (id, user_id, professional_number, license_number, specialty_id, health_unit_id, is_active, consultation_fee) VALUES
(1, 2, 'PROF-00001', '123456/SP', 1, 1, TRUE, 150.00)
ON DUPLICATE KEY UPDATE professional_number=VALUES(professional_number);

-- ============================================
-- NOTAS IMPORTANTES
-- ============================================
-- 1. Todos os usuários de teste usam senha: 123456
-- 2. Tipos de usuário: 1=Admin, 2=Doctor, 3=Nurse, 4=Receptionist, 5=Patient
-- 3. Credenciais de teste:
--    - admin / 123456 (Administrator)
--    - medico1 / 123456 (Doctor)
--    - paciente1 / 123456 (Patient)
-- 4. Para produção, usar bcrypt para senhas

