const express = require("express");
const router = express.Router();
const pool = require("../config/db");
const { authenticateToken } = require("../middleware/auth");

// ============================================
// Função auxiliar para calcular pontuação de risco
// ============================================
function calcularRisco(symptoms = []) {
  const sintomasGraves = ["falta de ar", "dor no peito", "inconsciência"];
  const sintomasModerados = ["febre", "tosse", "dor de cabeça"];

  const temGrave = symptoms.some((s) =>
    sintomasGraves.includes(s.toLowerCase())
  );
  const temModerado = symptoms.some((s) =>
    sintomasModerados.includes(s.toLowerCase())
  );

  if (temGrave) return "Alta";
  if (temModerado) return "Média";
  return "Baixa";
}

// ============================================
// GET /api/pacientes → Lista pacientes
// ============================================
router.get("/", authenticateToken, async (req, res) => {
  try {
    const [rows] = await pool.execute(`
      SELECT 
        p.id,
        u.first_name AS nome,
        u.last_name AS sobrenome,
        u.email,
        p.created_at
      FROM patients p
      JOIN users u ON p.user_id = u.id
      ORDER BY p.created_at DESC
    `);

    res.json(rows);
  } catch (error) {
    console.error("Erro ao listar pacientes:", error);
    res.status(500).json({ error: "Erro ao buscar pacientes" });
  }
});

// ============================================
// POST /api/pacientes → Adiciona novo paciente e faz triagem
// ============================================
router.post("/", authenticateToken, async (req, res) => {
  try {
    const { firstName, lastName, symptoms } = req.body;

    if (!firstName || !lastName) {
      return res
        .status(400)
        .json({ error: "Nome e sobrenome são obrigatórios" });
    }

    const riskScore = calcularRisco(symptoms);

    // Inserir novo usuário + paciente
    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      // 1️⃣ Cria usuário base
      const [userResult] = await connection.execute(
        `
        INSERT INTO users (
          user_type_id, username, email, password_hash, first_name, last_name, active
        ) VALUES (?, ?, ?, ?, ?, ?, ?)
        `,
        [
          5, // tipo paciente
          firstName.toLowerCase() + Date.now(), // username único
          `${firstName.toLowerCase()}_${lastName.toLowerCase()}@unima.com`,
          "$2b$10$Z6n5O9YF1qO6ZK3FvF9qyeB/UyMRT9o4sG1oHxX4r4mXK2OnfZ5pK", // senha "123456"
          firstName,
          lastName,
          true,
        ]
      );

      const userId = userResult.insertId;

      // 2️⃣ Cria paciente vinculado
      await connection.execute(
        `
        INSERT INTO patients (user_id, patient_number, blood_type)
        VALUES (?, ?, ?)
        `,
        [userId, `PAT-${userId.toString().padStart(4, "0")}`, "O+"]
      );

      await connection.commit();

      res.status(201).json({
        message: "Paciente registrado com sucesso",
        firstName,
        lastName,
        riskScore,
      });
    } catch (err) {
      await connection.rollback();
      throw err;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error("Erro ao registrar paciente:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

module.exports = router;
