const db = require("../config/db");
const bcrypt = require("bcryptjs");

const PacientesService = {
  async getAll(filters = {}) {
    let query = `
      SELECT 
        p.id,
        p.patient_number,
        p.blood_type,
        p.sus_card,
        p.health_plan,
        p.allergies,
        p.chronic_conditions,
        u.id AS user_id,
        u.first_name,
        u.last_name,
        u.email,
        u.cpf,
        u.phone,
        u.birth_date,
        u.gender,
        u.active,
        u.created_at
      FROM patients p
      JOIN users u ON p.user_id = u.id
      WHERE 1=1
    `;
    const params = [];

    if (filters.search) {
      query += ` AND (u.first_name LIKE ? OR u.last_name LIKE ? OR u.email LIKE ? OR p.patient_number LIKE ?)`;
      const searchParam = `%${filters.search}%`;
      params.push(searchParam, searchParam, searchParam, searchParam);
    }

    query += " ORDER BY u.first_name ASC";
    const [rows] = await db.execute(query, params);
    return rows;
  },

  async getById(id) {
    const [rows] = await db.execute(`
      SELECT 
        p.id,
        p.patient_number,
        p.blood_type,
        p.sus_card,
        p.health_plan,
        p.allergies,
        p.chronic_conditions,
        u.id AS user_id,
        u.first_name,
        u.last_name,
        u.email,
        u.cpf,
        u.phone,
        u.birth_date,
        u.gender,
        u.active,
        u.created_at
      FROM patients p
      JOIN users u ON p.user_id = u.id
      WHERE p.id = ?
    `, [id]);
    return rows[0];
  },

  async getByUserId(userId) {
    const [rows] = await db.execute(`
      SELECT 
        p.id,
        p.patient_number,
        p.blood_type,
        p.sus_card,
        p.health_plan,
        p.allergies,
        p.chronic_conditions,
        u.id AS user_id,
        u.first_name,
        u.last_name,
        u.email,
        u.cpf,
        u.phone,
        u.birth_date,
        u.gender,
        u.active,
        u.created_at
      FROM patients p
      JOIN users u ON p.user_id = u.id
      WHERE p.user_id = ?
    `, [userId]);
    return rows[0];
  },

  async create(data) {
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();

      // Gera hash de senha (padrão: 123456)
      const passwordHash = await bcrypt.hash("123456", 10);

      // Gera username único
      let username = `paciente_${Date.now()}`;
      const [existingUsers] = await connection.execute(
        "SELECT id FROM users WHERE username = ?",
        [username]
      );
      while (existingUsers.length > 0) {
        username = `paciente_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      }

      // Cria usuário
      const [userResult] = await connection.execute(
        `INSERT INTO users (user_type_id, username, email, password_hash, first_name, last_name, cpf, phone, birth_date, gender, active)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          5, // user_type_id para paciente (conforme mockData.js)
          username,
          data.email || `${username}@unima.local`,
          passwordHash,
          data.firstName,
          data.lastName,
          data.cpf || null,
          data.phone || null,
          data.birth_date || null,
          data.gender || "Other",
          true, // active
        ]
      );

      const userId = userResult.insertId;

      // Gera patient_number único
      const patientNumberPrefix = "PAT";
      const [maxPatient] = await connection.execute(
        "SELECT patient_number FROM patients WHERE patient_number LIKE 'PAT-%' ORDER BY patient_number DESC LIMIT 1"
      );
      let patientNumber = "PAT-00001";
      if (maxPatient.length > 0) {
        const lastNumber = parseInt(maxPatient[0].patient_number.split("-")[1]);
        patientNumber = `PAT-${String(lastNumber + 1).padStart(5, "0")}`;
      }

      // Cria paciente
      const [patientResult] = await connection.execute(
        `INSERT INTO patients (user_id, patient_number, blood_type, sus_card, health_plan, allergies, chronic_conditions)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          userId,
          patientNumber,
          data.blood_type || null,
          data.sus_card || null,
          data.health_plan || null,
          data.allergies || null,
          data.chronic_conditions || null,
        ]
      );

      await connection.commit();

      return {
        id: patientResult.insertId,
        user_id: userId,
        username,
        patient_number: patientNumber,
        email: data.email || `${username}@unima.local`,
        first_name: data.firstName,
        last_name: data.lastName,
        blood_type: data.blood_type,
      };
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  },

  async update(id, data) {
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();

      // Atualiza dados do usuário
      if (data.firstName || data.lastName || data.email || data.phone) {
        const updateUserSql = `
          UPDATE users 
          SET 
            first_name = COALESCE(?, first_name),
            last_name = COALESCE(?, last_name),
            email = COALESCE(?, email),
            phone = COALESCE(?, phone),
            updated_at = NOW()
          WHERE id = (SELECT user_id FROM patients WHERE id = ?)
        `;
        await connection.execute(updateUserSql, [
          data.firstName,
          data.lastName,
          data.email,
          data.phone,
          id,
        ]);
      }

      // Atualiza dados do paciente
      const updatePatientSql = `
        UPDATE patients 
        SET 
          blood_type = COALESCE(?, blood_type),
          sus_card = COALESCE(?, sus_card),
          health_plan = COALESCE(?, health_plan),
          allergies = COALESCE(?, allergies),
          chronic_conditions = COALESCE(?, chronic_conditions),
          updated_at = NOW()
        WHERE id = ?
      `;
      const [result] = await connection.execute(updatePatientSql, [
        data.blood_type,
        data.sus_card,
        data.health_plan,
        data.allergies,
        data.chronic_conditions,
        id,
      ]);

      await connection.commit();
      return result.affectedRows > 0;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  },

  async remove(id) {
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();

      // Primeiro, obtém o user_id
      const [patient] = await connection.execute(
        "SELECT user_id FROM patients WHERE id = ?",
        [id]
      );

      if (patient.length === 0) {
        throw new Error("Paciente não encontrado");
      }

      const userId = patient[0].user_id;

      // Delete do paciente (cascata vai deletar user)
      const [result] = await connection.execute(
        "DELETE FROM patients WHERE id = ?",
        [id]
      );

      await connection.commit();
      return result.affectedRows > 0;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  },

  async getTriage(patientId) {
    const [rows] = await db.execute(`
      SELECT * FROM triage_queue
      WHERE patient_id = ?
      ORDER BY created_at DESC
      LIMIT 1
    `, [patientId]);
    return rows[0];
  },
};

module.exports = PacientesService;
