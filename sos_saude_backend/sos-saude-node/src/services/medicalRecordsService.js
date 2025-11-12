const db = require("../config/db");

const MedicalRecordsService = {
  async getAll() {
    const [rows] = await db.execute(`
      SELECT mr.id, mr.chief_complaint, mr.diagnosis, mr.treatment_plan,
             CONCAT(up.first_name, ' ', up.last_name) AS patient_name,
             CONCAT(ud.first_name, ' ', ud.last_name) AS doctor_name,
             s.name AS specialty, mr.created_at
      FROM medical_records mr
      JOIN patients p ON mr.patient_id = p.id
      JOIN users up ON p.user_id = up.id
      JOIN healthcare_professionals hp ON mr.professional_id = hp.id
      JOIN users ud ON hp.user_id = ud.id
      LEFT JOIN specialties s ON hp.specialty_id = s.id
      ORDER BY mr.created_at DESC;
    `);
    return rows;
  },

  async getById(id) {
    const [rows] = await db.execute(`
      SELECT mr.*, CONCAT(up.first_name, ' ', up.last_name) AS patient_name,
             CONCAT(ud.first_name, ' ', ud.last_name) AS doctor_name
      FROM medical_records mr
      JOIN patients p ON mr.patient_id = p.id
      JOIN users up ON p.user_id = up.id
      JOIN healthcare_professionals hp ON mr.professional_id = hp.id
      JOIN users ud ON hp.user_id = ud.id
      WHERE mr.id = ?;
    `, [id]);
    return rows[0];
  },

  async getByPatientId(patientId) {
    const [rows] = await db.execute(`
      SELECT mr.id, mr.chief_complaint, mr.diagnosis, mr.treatment_plan,
             mr.created_at, CONCAT(ud.first_name, ' ', ud.last_name) AS doctor_name
      FROM medical_records mr
      JOIN healthcare_professionals hp ON mr.professional_id = hp.id
      JOIN users ud ON hp.user_id = ud.id
      WHERE mr.patient_id = ?
      ORDER BY mr.created_at DESC;
    `, [patientId]);
    return rows;
  },

  async create(data) {
    const sql = `INSERT INTO medical_records
      (patient_id, appointment_id, professional_id, chief_complaint,
       history_present_illness, physical_examination, diagnosis, treatment_plan, observations)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const values = [
      data.patient_id,
      data.appointment_id || null,
      data.professional_id,
      data.chief_complaint,
      data.history_present_illness,
      data.physical_examination,
      data.diagnosis,
      data.treatment_plan,
      data.observations || null
    ];
    const [result] = await db.execute(sql, values);
    return { id: result.insertId, ...data };
  },

  async update(id, data) {
    const sql = `UPDATE medical_records
      SET diagnosis = ?, treatment_plan = ?, observations = ?, updated_at = NOW()
      WHERE id = ?`;
    const [result] = await db.execute(sql, [
      data.diagnosis,
      data.treatment_plan,
      data.observations,
      id
    ]);
    return result.affectedRows > 0;
  },

  async remove(id) {
    const [result] = await db.execute("DELETE FROM medical_records WHERE id = ?", [id]);
    return result.affectedRows > 0;
  }
};

module.exports = MedicalRecordsService;