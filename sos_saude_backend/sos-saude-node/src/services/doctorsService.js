const db = require("../config/db");

const DoctorsService = {
  async getAll() {
    const [rows] = await db.execute(`
      SELECT hp.id, hp.professional_number, hp.license_number, 
             s.name AS specialty, hu.name AS health_unit,
             CONCAT(u.first_name, ' ', u.last_name) AS full_name,
             u.email, u.phone, hp.is_active, hp.consultation_fee
      FROM healthcare_professionals hp
      JOIN users u ON hp.user_id = u.id
      LEFT JOIN specialties s ON hp.specialty_id = s.id
      LEFT JOIN health_units hu ON hp.health_unit_id = hu.id
      ORDER BY u.first_name;
    `);
    return rows;
  },

  async getById(id) {
    const [rows] = await db.execute(`
      SELECT hp.id, hp.professional_number, hp.license_number,
             s.name AS specialty, hu.name AS health_unit,
             CONCAT(u.first_name, ' ', u.last_name) AS full_name,
             u.email, u.phone, hp.is_active, hp.consultation_fee
      FROM healthcare_professionals hp
      JOIN users u ON hp.user_id = u.id
      LEFT JOIN specialties s ON hp.specialty_id = s.id
      LEFT JOIN health_units hu ON hp.health_unit_id = hu.id
      WHERE hp.id = ?;
    `, [id]);
    return rows[0];
  },

  async create(data) {
    const sql = `INSERT INTO healthcare_professionals
      (user_id, professional_number, license_number, specialty_id, health_unit_id, is_active, consultation_fee)
      VALUES (?, ?, ?, ?, ?, ?, ?)`;
    const values = [
      data.user_id,
      data.professional_number,
      data.license_number,
      data.specialty_id,
      data.health_unit_id,
      data.is_active ?? true,
      data.consultation_fee ?? 0.0
    ];
    const [result] = await db.execute(sql, values);
    return { id: result.insertId, ...data };
  },

  async update(id, data) {
    const sql = `UPDATE healthcare_professionals
      SET specialty_id = ?, health_unit_id = ?, is_active = ?, consultation_fee = ?, updated_at = NOW()
      WHERE id = ?`;
    const [result] = await db.execute(sql, [
      data.specialty_id,
      data.health_unit_id,
      data.is_active,
      data.consultation_fee,
      id
    ]);
    return result.affectedRows > 0;
  },

  async remove(id) {
    const [result] = await db.execute("DELETE FROM healthcare_professionals WHERE id = ?", [id]);
    return result.affectedRows > 0;
  },

  async getStats(id) {
    const [rows] = await db.execute(`
      SELECT hp.id, COUNT(a.id) AS total_consultas,
             SUM(CASE WHEN a.status = 'Concluído' THEN 1 ELSE 0 END) AS consultas_concluidas,
             COUNT(DISTINCT a.patient_id) AS total_pacientes
      FROM healthcare_professionals hp
      LEFT JOIN appointments a ON hp.id = a.professional_id
      WHERE hp.id = ?;
    `, [id]);
    return rows[0];
  }
};

module.exports = DoctorsService;