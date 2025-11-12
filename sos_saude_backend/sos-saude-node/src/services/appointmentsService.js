const db = require("../config/db");

const AppointmentsService = {
  async getAll(filters = {}) {
    let query = "SELECT * FROM appointments WHERE 1=1";
    const params = [];
    if (filters.doctorId) {
      query += " AND professional_id = ?";
      params.push(filters.doctorId);
    }
    if (filters.patientId) {
      query += " AND patient_id = ?";
      params.push(filters.patientId);
    }
    if (filters.date) {
      query += " AND DATE(appointment_date) = ?";
      params.push(filters.date);
    }
    query += " ORDER BY appointment_date DESC";
    const [rows] = await db.execute(query, params);
    return rows;
  },

  async getById(id) {
    const [rows] = await db.execute("SELECT * FROM appointments WHERE id = ?", [id]);
    return rows[0];
  },

  async create(data) {
    const sql = `INSERT INTO appointments (patient_id, professional_id, health_unit_id, appointment_date, duration_minutes, type, status, notes)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
    const values = [
      data.patient_id,
      data.professional_id,
      data.health_unit_id,
      data.appointment_date,
      data.duration_minutes || 30,
      data.type || "Consulta",
      data.status || "Agendado",
      data.notes || null
    ];
    const [result] = await db.execute(sql, values);
    return { id: result.insertId, ...data };
  },

  async update(id, data) {
    const sql = `UPDATE appointments SET appointment_date = ?, duration_minutes = ?, status = ?, notes = ?, updated_at = NOW()
                 WHERE id = ?`;
    const [result] = await db.execute(sql, [
      data.appointment_date,
      data.duration_minutes,
      data.status,
      data.notes,
      id
    ]);
    return result.affectedRows > 0;
  },

  async remove(id) {
    const [result] = await db.execute("DELETE FROM appointments WHERE id = ?", [id]);
    return result.affectedRows > 0;
  }
};

module.exports = AppointmentsService;