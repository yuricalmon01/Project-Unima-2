-- ============================================
-- BANCO DE DADOS SISTEMA DE SAÚDE UNIMA
-- Script automático de inicialização (Docker)
-- ============================================

-- Cria o banco (caso não exista)
CREATE DATABASE IF NOT EXISTS unima_health_system
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE unima_health_system;

-- ============================================
-- TABELAS DE CONFIGURAÇÃO
-- ============================================

CREATE TABLE IF NOT EXISTS user_types (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(50) NOT NULL UNIQUE,
  description TEXT,
  permissions JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS specialties (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  code VARCHAR(10) UNIQUE,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS health_units (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(200) NOT NULL,
  type ENUM('Hospital', 'UBS', 'Clínica', 'Laboratório', 'Farmácia') NOT NULL,
  cnpj VARCHAR(18) UNIQUE,
  phone VARCHAR(15),
  email VARCHAR(100),
  address TEXT,
  city VARCHAR(100),
  state VARCHAR(2),
  zip_code VARCHAR(10),
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ============================================
-- TABELAS DE USUÁRIOS
-- ============================================

CREATE TABLE IF NOT EXISTS users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_type_id INT NOT NULL,
  username VARCHAR(50) NOT NULL UNIQUE,
  email VARCHAR(100) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  cpf VARCHAR(14) UNIQUE,
  phone VARCHAR(15),
  birth_date DATE,
  gender ENUM('M', 'F', 'Other'),
  active BOOLEAN DEFAULT TRUE,
  last_login TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_type_id) REFERENCES user_types(id)
);

-- ============================================
-- PACIENTES E PROFISSIONAIS DE SAÚDE
-- ============================================

CREATE TABLE IF NOT EXISTS patients (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL UNIQUE,
  patient_number VARCHAR(20) NOT NULL UNIQUE,
  sus_card VARCHAR(15),
  health_plan VARCHAR(100),
  emergency_contact_name VARCHAR(150),
  emergency_contact_phone VARCHAR(15),
  allergies TEXT,
  chronic_conditions TEXT,
  blood_type ENUM('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'),
  weight DECIMAL(5,2),
  height DECIMAL(4,2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS healthcare_professionals (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL UNIQUE,
  professional_number VARCHAR(20) NOT NULL UNIQUE,
  license_number VARCHAR(20) NOT NULL UNIQUE,
  specialty_id INT,
  health_unit_id INT,
  is_active BOOLEAN DEFAULT TRUE,
  consultation_fee DECIMAL(10,2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (specialty_id) REFERENCES specialties(id),
  FOREIGN KEY (health_unit_id) REFERENCES health_units(id)
);

-- ============================================
-- DADOS INICIAIS
-- ============================================

-- Tipos de usuário
INSERT IGNORE INTO user_types (id, name, description, permissions) VALUES
(1, 'Admin', 'Administrador do sistema', '{"all": true}'),
(2, 'Doctor', 'Médico', '{"patients": "read,write", "appointments": "read,write", "medical_records": "read,write"}'),
(3, 'Nurse', 'Enfermeiro(a)', '{"patients": "read,write", "appointments": "read", "vital_signs": "read,write"}'),
(4, 'Receptionist', 'Recepcionista', '{"patients": "read,write", "appointments": "read,write"}'),
(5, 'Patient', 'Paciente', '{"own_data": "read", "appointments": "read"}');

-- Especialidades médicas
INSERT IGNORE INTO specialties (id, name, description, code) VALUES
(1, 'Clínica Geral', 'Medicina geral e preventiva', 'CG'),
(2, 'Cardiologia', 'Especialidade do coração e sistema cardiovascular', 'CARD'),
(3, 'Dermatologia', 'Especialidade da pele', 'DERM'),
(4, 'Pediatria', 'Medicina infantil', 'PED');

-- Unidades de saúde
INSERT IGNORE INTO health_units (id, name, type, phone, email, address, city, state, zip_code) VALUES
(1, 'UBS Central UNIMA', 'UBS', '(82) 3333-1234', 'ubs.central@unima.gov.br', 'Rua Principal, 123 - Centro', 'Maceió', 'AL', '57000-000'),
(2, 'Hospital UNIMA', 'Hospital', '(82) 3333-5678', 'hospital@unima.gov.br', 'Av. Hospitalar, 456 - Farol', 'Maceió', 'AL', '57050-000');

-- Usuário Admin padrão (senha = "123456")
INSERT IGNORE INTO users (id, user_type_id, username, email, password_hash, first_name, last_name)
VALUES (
  1, 1, 'admin', 'admin@unima.com',
  '$2a$10$7sK4qHUmv9DpYdUqHDn3OeYzPcUF5MYOPqBbZr3LxS5zFtw6wKthS', -- hash de "123456"
  'Administrador', 'UNIMA'
);

-- Paciente de exemplo
INSERT IGNORE INTO users (id, user_type_id, username, email, password_hash, first_name, last_name)
VALUES (
  2, 5, 'joaosilva', 'joao@unima.com',
  '$2a$10$7sK4qHUmv9DpYdUqHDn3OeYzPcUF5MYOPqBbZr3LxS5zFtw6wKthS',
  'João', 'Silva'
);

INSERT IGNORE INTO patients (user_id, patient_number, sus_card, blood_type)
VALUES (2, 'PAT-0001', '1234567890', 'O+');

-- Médico de exemplo
INSERT IGNORE INTO users (id, user_type_id, username, email, password_hash, first_name, last_name)
VALUES (
  3, 2, 'drmaria', 'maria@unima.com',
  '$2a$10$7sK4qHUmv9DpYdUqHDn3OeYzPcUF5MYOPqBbZr3LxS5zFtw6wKthS',
  'Maria', 'Souza'
);

INSERT IGNORE INTO healthcare_professionals (user_id, professional_number, license_number, specialty_id, health_unit_id, consultation_fee)
VALUES (3, 'PRO-0001', 'CRM12345', 1, 2, 250.00);

-- ============================================
-- LOG DE CRIAÇÃO
-- ============================================
SELECT "✅ Banco de dados UNIMA inicializado com sucesso!" AS status;
