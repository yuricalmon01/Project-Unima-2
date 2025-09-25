-- ============================================
-- BANCO DE DADOS SISTEMA DE SAÚDE UNIMA
-- ============================================

-- Criação do banco de dados
CREATE DATABASE IF NOT EXISTS unima_health_system
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE unima_health_system;

-- ============================================
-- TABELAS DE CONFIGURAÇÃO E LOOKUP
-- ============================================

-- Tipos de usuário do sistema
CREATE TABLE user_types (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    permissions JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Especialidades médicas
CREATE TABLE specialties (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    code VARCHAR(10) UNIQUE,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Unidades de saúde
CREATE TABLE health_units (
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

-- Usuários do sistema (base para todos os tipos de usuário)
CREATE TABLE users (
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

-- Pacientes
CREATE TABLE patients (
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

-- Profissionais de saúde
CREATE TABLE healthcare_professionals (
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
-- TABELAS DE AGENDAMENTO E CONSULTAS
-- ============================================

-- Agendamentos/Consultas
CREATE TABLE appointments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    patient_id INT NOT NULL,
    professional_id INT NOT NULL,
    health_unit_id INT NOT NULL,
    appointment_date DATETIME NOT NULL,
    duration_minutes INT DEFAULT 30,
    type ENUM('Consulta', 'Retorno', 'Exame', 'Procedimento') NOT NULL,
    status ENUM('Agendado', 'Confirmado', 'Em_Andamento', 'Concluído', 'Cancelado', 'Faltou') DEFAULT 'Agendado',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patients(id),
    FOREIGN KEY (professional_id) REFERENCES healthcare_professionals(id),
    FOREIGN KEY (health_unit_id) REFERENCES health_units(id),
    INDEX idx_appointment_date (appointment_date),
    INDEX idx_patient_appointments (patient_id, appointment_date),
    INDEX idx_professional_appointments (professional_id, appointment_date)
);

-- ============================================
-- TABELAS DE PRONTUÁRIO MÉDICO
-- ============================================

-- Prontuários médicos
CREATE TABLE medical_records (
    id INT PRIMARY KEY AUTO_INCREMENT,
    patient_id INT NOT NULL,
    appointment_id INT,
    professional_id INT NOT NULL,
    chief_complaint TEXT,
    history_present_illness TEXT,
    physical_examination TEXT,
    diagnosis TEXT,
    treatment_plan TEXT,
    observations TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patients(id),
    FOREIGN KEY (appointment_id) REFERENCES appointments(id),
    FOREIGN KEY (professional_id) REFERENCES healthcare_professionals(id)
);

-- Sinais vitais
CREATE TABLE vital_signs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    medical_record_id INT NOT NULL,
    blood_pressure_systolic INT,
    blood_pressure_diastolic INT,
    heart_rate INT,
    temperature DECIMAL(4,1),
    respiratory_rate INT,
    oxygen_saturation DECIMAL(5,2),
    weight DECIMAL(5,2),
    height DECIMAL(4,2),
    bmi DECIMAL(4,2),
    measured_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (medical_record_id) REFERENCES medical_records(id) ON DELETE CASCADE
);

-- ============================================
-- TABELAS DE MEDICAMENTOS E PRESCRIÇÕES
-- ============================================

-- Medicamentos
CREATE TABLE medications (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(200) NOT NULL,
    active_ingredient VARCHAR(200),
    dosage_form VARCHAR(50),
    strength VARCHAR(50),
    manufacturer VARCHAR(100),
    code VARCHAR(20) UNIQUE,
    controlled_substance BOOLEAN DEFAULT FALSE,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Prescrições
CREATE TABLE prescriptions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    medical_record_id INT NOT NULL,
    patient_id INT NOT NULL,
    professional_id INT NOT NULL,
    prescription_date DATE NOT NULL,
    valid_until DATE,
    status ENUM('Ativa', 'Dispensada', 'Cancelada', 'Vencida') DEFAULT 'Ativa',
    observations TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (medical_record_id) REFERENCES medical_records(id),
    FOREIGN KEY (patient_id) REFERENCES patients(id),
    FOREIGN KEY (professional_id) REFERENCES healthcare_professionals(id)
);

-- Itens da prescrição
CREATE TABLE prescription_items (
    id INT PRIMARY KEY AUTO_INCREMENT,
    prescription_id INT NOT NULL,
    medication_id INT NOT NULL,
    dosage VARCHAR(100) NOT NULL,
    frequency VARCHAR(100) NOT NULL,
    duration VARCHAR(100),
    quantity INT,
    instructions TEXT,
    dispensed BOOLEAN DEFAULT FALSE,
    dispensed_at TIMESTAMP NULL,
    FOREIGN KEY (prescription_id) REFERENCES prescriptions(id) ON DELETE CASCADE,
    FOREIGN KEY (medication_id) REFERENCES medications(id)
);

-- ============================================
-- TABELAS DE EXAMES
-- ============================================

-- Tipos de exames
CREATE TABLE exam_types (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(150) NOT NULL,
    category VARCHAR(50),
    description TEXT,
    requires_preparation BOOLEAN DEFAULT FALSE,
    preparation_instructions TEXT,
    estimated_duration INT,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Solicitações de exames
CREATE TABLE exam_requests (
    id INT PRIMARY KEY AUTO_INCREMENT,
    medical_record_id INT NOT NULL,
    patient_id INT NOT NULL,
    professional_id INT NOT NULL,
    exam_type_id INT NOT NULL,
    request_date DATE NOT NULL,
    urgency ENUM('Normal', 'Urgente', 'Emergência') DEFAULT 'Normal',
    clinical_information TEXT,
    status ENUM('Solicitado', 'Agendado', 'Realizado', 'Laudo_Pronto', 'Cancelado') DEFAULT 'Solicitado',
    scheduled_date DATETIME,
    performed_date DATETIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (medical_record_id) REFERENCES medical_records(id),
    FOREIGN KEY (patient_id) REFERENCES patients(id),
    FOREIGN KEY (professional_id) REFERENCES healthcare_professionals(id),
    FOREIGN KEY (exam_type_id) REFERENCES exam_types(id)
);

-- Resultados de exames
CREATE TABLE exam_results (
    id INT PRIMARY KEY AUTO_INCREMENT,
    exam_request_id INT NOT NULL UNIQUE,
    result_data JSON,
    report TEXT,
    findings TEXT,
    conclusion TEXT,
    performed_by INT,
    reviewed_by INT,
    result_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (exam_request_id) REFERENCES exam_requests(id) ON DELETE CASCADE,
    FOREIGN KEY (performed_by) REFERENCES healthcare_professionals(id),
    FOREIGN KEY (reviewed_by) REFERENCES healthcare_professionals(id)
);

-- ============================================
-- TABELAS DE ARQUIVOS E DOCUMENTOS
-- ============================================

-- Arquivos anexos (documentos, imagens, etc.)
CREATE TABLE file_attachments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    entity_type ENUM('patient', 'medical_record', 'exam_result', 'prescription') NOT NULL,
    entity_id INT NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    original_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_size INT,
    mime_type VARCHAR(100),
    uploaded_by INT NOT NULL,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (uploaded_by) REFERENCES users(id)
);

-- ============================================
-- TABELAS DE AUDITORIA E LOGS
-- ============================================

-- Log de atividades do sistema
CREATE TABLE activity_logs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50),
    entity_id INT,
    old_values JSON,
    new_values JSON,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- ============================================
-- ÍNDICES PARA PERFORMANCE
-- ============================================

-- Índices adicionais para melhor performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_cpf ON users(cpf);
CREATE INDEX idx_patients_sus_card ON patients(sus_card);
CREATE INDEX idx_medical_records_patient ON medical_records(patient_id, created_at);
CREATE INDEX idx_prescriptions_patient ON prescriptions(patient_id, prescription_date);
CREATE INDEX idx_exam_requests_patient ON exam_requests(patient_id, request_date);
CREATE INDEX idx_appointments_status ON appointments(status, appointment_date);
CREATE INDEX idx_activity_logs_user ON activity_logs(user_id, created_at);

-- ============================================
-- INSERÇÃO DE DADOS INICIAIS
-- ============================================

-- Tipos de usuário
INSERT INTO user_types (name, description, permissions) VALUES
('Admin', 'Administrador do sistema', '{"all": true}'),
('Doctor', 'Médico', '{"patients": "read,write", "appointments": "read,write", "medical_records": "read,write"}'),
('Nurse', 'Enfermeiro(a)', '{"patients": "read,write", "appointments": "read", "vital_signs": "read,write"}'),
('Receptionist', 'Recepcionista', '{"patients": "read,write", "appointments": "read,write"}'),
('Patient', 'Paciente', '{"own_data": "read", "appointments": "read"}');

-- Especialidades médicas
INSERT INTO specialties (name, description, code) VALUES
('Clínica Geral', 'Medicina geral e preventiva', 'CG'),
('Cardiologia', 'Especialidade do coração e sistema cardiovascular', 'CARD'),
('Dermatologia', 'Especialidade da pele', 'DERM'),
('Ginecologia', 'Saúde da mulher', 'GINE'),
('Pediatria', 'Medicina infantil', 'PED'),
('Ortopedia', 'Ossos e articulações', 'ORTO'),
('Neurologia', 'Sistema nervoso', 'NEURO'),
('Psiquiatria', 'Saúde mental', 'PSI'),
('Oftalmologia', 'Olhos e visão', 'OFTAL'),
('Otorrinolaringologia', 'Ouvido, nariz e garganta', 'ORL');

-- Tipos de exames
INSERT INTO exam_types (name, category, description, requires_preparation) VALUES
('Hemograma Completo', 'Laboratorial', 'Análise completa do sangue', FALSE),
('Glicemia em Jejum', 'Laboratorial', 'Dosagem de açúcar no sangue', TRUE),
('Colesterol Total e Frações', 'Laboratorial', 'Perfil lipídico completo', TRUE),
('Raio-X de Tórax', 'Imagem', 'Radiografia do tórax', FALSE),
('Eletrocardiograma', 'Cardíaco', 'Exame do coração', FALSE),
('Ultrassom Abdominal', 'Imagem', 'Ultrassom do abdome', TRUE),
('Mamografia', 'Imagem', 'Exame das mamas', FALSE),
('Papanicolau', 'Preventivo', 'Exame preventivo feminino', FALSE);

-- Medicamentos básicos
INSERT INTO medications (name, active_ingredient, dosage_form, strength) VALUES
('Paracetamol', 'Paracetamol', 'Comprimido', '500mg'),
('Dipirona', 'Dipirona sódica', 'Comprimido', '500mg'),
('Omeprazol', 'Omeprazol', 'Cápsula', '20mg'),
('Losartana', 'Losartana potássica', 'Comprimido', '50mg'),
('Metformina', 'Metformina', 'Comprimido', '850mg'),
('Sinvastatina', 'Sinvastatina', 'Comprimido', '20mg'),
('Captopril', 'Captopril', 'Comprimido', '25mg'),
('Aspirina', 'Ácido acetilsalicílico', 'Comprimido', '100mg');

-- Exemplo de unidade de saúde
INSERT INTO health_units (name, type, phone, email, address, city, state, zip_code) VALUES
('UBS Central UNIMA', 'UBS', '(82) 3333-1234', 'ubs.central@unima.gov.br', 'Rua Principal, 123 - Centro', 'Maceió', 'AL', '57000-000'),
('Hospital UNIMA', 'Hospital', '(82) 3333-5678', 'hospital@unima.gov.br', 'Av. Hospitalar, 456 - Farol', 'Maceió', 'AL', '57050-000');

-- ============================================
-- VIEWS ÚTEIS PARA RELATÓRIOS
-- ============================================

-- View de pacientes com informações completas
CREATE VIEW v_patients_full AS
SELECT 
    p.id,
    p.patient_number,
    u.first_name,
    u.last_name,
    u.cpf,
    u.phone,
    u.email,
    u.birth_date,
    u.gender,
    p.sus_card,
    p.health_plan,
    p.blood_type,
    p.allergies,
    p.chronic_conditions,
    u.created_at
FROM patients p
JOIN users u ON p.user_id = u.id
WHERE u.active = TRUE;

-- View de consultas com detalhes
CREATE VIEW v_appointments_detail AS
SELECT 
    a.id,
    a.appointment_date,
    a.type,
    a.status,
    CONCAT(up.first_name, ' ', up.last_name) as patient_name,
    p.patient_number,
    CONCAT(ud.first_name, ' ', ud.last_name) as doctor_name,
    s.name as specialty,
    hu.name as health_unit,
    a.notes
FROM appointments a
JOIN patients p ON a.patient_id = p.id
JOIN users up ON p.user_id = up.id
JOIN healthcare_professionals hp ON a.professional_id = hp.id
JOIN users ud ON hp.user_id = ud.id
LEFT JOIN specialties s ON hp.specialty_id = s.id
JOIN health_units hu ON a.health_unit_id = hu.id;

-- View de prontuários com informações do paciente
CREATE VIEW v_medical_records_detail AS
SELECT 
    mr.id,
    mr.chief_complaint,
    mr.diagnosis,
    mr.treatment_plan,
    CONCAT(up.first_name, ' ', up.last_name) as patient_name,
    p.patient_number,
    CONCAT(ud.first_name, ' ', ud.last_name) as doctor_name,
    s.name as specialty,
    mr.created_at
FROM medical_records mr
JOIN patients p ON mr.patient_id = p.id
JOIN users up ON p.user_id = up.id
JOIN healthcare_professionals hp ON mr.professional_id = hp.id
JOIN users ud ON hp.user_id = ud.id
LEFT JOIN specialties s ON hp.specialty_id = s.id;

-- ============================================
-- TRIGGERS PARA AUDITORIA
-- ============================================

DELIMITER $$

-- Trigger para log de alterações em pacientes
CREATE TRIGGER tr_patients_audit 
AFTER UPDATE ON patients
FOR EACH ROW
BEGIN
    INSERT INTO activity_logs (user_id, action, entity_type, entity_id, old_values, new_values)
    VALUES (
        @current_user_id,
        'UPDATE',
        'patients',
        NEW.id,
        JSON_OBJECT(
            'allergies', OLD.allergies,
            'chronic_conditions', OLD.chronic_conditions,
            'weight', OLD.weight,
            'height', OLD.height
        ),
        JSON_OBJECT(
            'allergies', NEW.allergies,
            'chronic_conditions', NEW.chronic_conditions,
            'weight', NEW.weight,
            'height', NEW.height
        )
    );
END$$

-- Trigger para log de criação de prontuários
CREATE TRIGGER tr_medical_records_audit 
AFTER INSERT ON medical_records
FOR EACH ROW
BEGIN
    INSERT INTO activity_logs (user_id, action, entity_type, entity_id, new_values)
    VALUES (
        @current_user_id,
        'INSERT',
        'medical_records',
        NEW.id,
        JSON_OBJECT(
            'patient_id', NEW.patient_id,
            'professional_id', NEW.professional_id,
            'diagnosis', NEW.diagnosis
        )
    );
END$$

DELIMITER ;

-- ============================================
-- COMENTÁRIOS FINAIS
-- ============================================

/*
Este banco de dados foi projetado para um sistema de saúde completo e inclui:

1. Gestão de usuários (pacientes, profissionais, administradores)
2. Agendamento e controle de consultas
3. Prontuários médicos eletrônicos
4. Sistema de prescrições e medicamentos
5. Solicitação e controle de exames
6. Auditoria e logs de atividades
7. Anexos de arquivos
8. Views para relatórios
9. Índices otimizados para performance

Para usar este banco de dados com uma API, você pode:
- Criar endpoints REST para cada entidade
- Implementar autenticação JWT
- Usar ORM como Sequelize (Node.js) ou SQLAlchemy (Python)
- Implementar validações e regras de negócio
- Criar documentação com Swagger/OpenAPI

O banco está preparado para ser escalável e seguro, seguindo boas práticas
de desenvolvimento de sistemas de saúde.
*/