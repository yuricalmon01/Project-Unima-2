// routes/users.js
const express = require("express");
const router = express.Router();
const mysql = require("mysql2/promise");
const { authenticateToken, authorize } = require("../middleware/auth");

// Config DB (pode extrair pra config/db.js se preferir)
const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "unima_health_system",
};
const pool = mysql.createPool(dbConfig);

// ============================================
// GET todos os usuários (somente Admin)
// ============================================
router.get("/", authenticateToken, authorize(["Admin"]), async (req, res) => {
  try {
    const [users] = await pool.execute(
      `SELECT id, username, email, first_name, last_name, user_type_id, active 
       FROM users`
    );
    res.json(users);
  } catch (error) {
    console.error("Erro ao buscar usuários:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

// ============================================
// GET usuário por ID (autenticado)
// ============================================
router.get("/:id", authenticateToken, async (req, res) => {
  try {
    const [users] = await pool.execute(
      `SELECT id, username, email, first_name, last_name, user_type_id, active 
       FROM users WHERE id = ?`,
      [req.params.id]
    );

    if (users.length === 0) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    res.json(users[0]);
  } catch (error) {
    console.error("Erro ao buscar usuário:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

// ============================================
// PUT atualizar usuário (Admin ou o próprio dono)
// ============================================
router.put("/:id", authenticateToken, async (req, res) => {
  try {
    if (req.user.userType !== "Admin" && req.user.id != req.params.id) {
      return res.status(403).json({ error: "Acesso negado" });
    }

    const { email, first_name, last_name, active } = req.body;

    await pool.execute(
      `UPDATE users SET email=?, first_name=?, last_name=?, active=? WHERE id=?`,
      [email, first_name, last_name, active, req.params.id]
    );

    res.json({ message: "Usuário atualizado com sucesso!" });
  } catch (error) {
    console.error("Erro ao atualizar usuário:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

// ============================================
// DELETE usuário (somente Admin)
// ============================================
router.delete(
  "/:id",
  authenticateToken,
  authorize(["Admin"]),
  async (req, res) => {
    try {
      await pool.execute("DELETE FROM users WHERE id=?", [req.params.id]);
      res.json({ message: "Usuário deletado com sucesso!" });
    } catch (error) {
      console.error("Erro ao deletar usuário:", error);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  }
);

// ============================================
// POST criar novo usuário (somente Admin)
// ============================================
router.post("/", authenticateToken, authorize(["Admin"]), async (req, res) => {
  try {
    const {
      username,
      email,
      password,
      first_name,
      last_name,
      user_type_id,
      active,
    } = req.body;

    // hash da senha
    const bcrypt = require("bcryptjs");
    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await pool.execute(
      `INSERT INTO users (username, email, password_hash, first_name, last_name, user_type_id, active) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        username,
        email,
        hashedPassword,
        first_name,
        last_name,
        user_type_id,
        active,
      ]
    );

    res.status(201).json({
      message: "Usuário criado com sucesso!",
      id: result.insertId,
    });
  } catch (error) {
    console.error("Erro ao criar usuário:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

module.exports = router;
