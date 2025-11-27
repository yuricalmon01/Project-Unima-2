// src/controllers/authController.js

const { pool } = require("../config/db");
const { generateToken } = require("../utils/jwt"); // ajusta se seu jwt.js estiver em outro lugar

// POST /api/auth/login
async function login(req, res) {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        error: "Username e senha são obrigatórios",
      });
    }

    // Busca por username (não email)
    const [rows] = await pool.query(
      "SELECT * FROM users WHERE username = ? LIMIT 1",
      [username]
    );

    if (!rows.length) {
      return res.status(401).json({
        success: false,
        error: "Credenciais inválidas",
      });
    }

    const user = rows[0];

    // Comparação simples de senha (ideal seria usar bcrypt)
    if (user.password_hash !== password) {
      return res.status(401).json({
        success: false,
        error: "Credenciais inválidas",
      });
    }

    const token = generateToken({ id: user.id, role: user.user_type_id });

    return res.json({
      success: true,
      data: {
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          name: `${user.first_name} ${user.last_name}`,
          first_name: user.first_name,
          last_name: user.last_name,
          userType: "User",
          user_type_id: user.user_type_id,
        },
      },
    });
  } catch (error) {
    console.error("Erro no login:", error);
    return res.status(500).json({
      success: false,
      error: "Erro ao fazer login",
    });
  }
}

// GET /api/auth/me
async function getMe(req, res) {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        error: "Usuário não autenticado",
      });
    }

    const [rows] = await pool.query("SELECT * FROM users WHERE id = ? LIMIT 1", [
      userId,
    ]);

    if (!rows.length) {
      return res.status(404).json({
        success: false,
        error: "Usuário não encontrado",
      });
    }

    const user = rows[0];

    return res.json({
      success: true,
      data: {
        id: user.id,
        username: user.username,
        email: user.email,
        name: `${user.first_name} ${user.last_name}`,
        first_name: user.first_name,
        last_name: user.last_name,
        userType: "User",
        user_type_id: user.user_type_id,
      },
    });
  } catch (err) {
    console.error("Erro em getMe:", err);
    return res.status(500).json({
      success: false,
      error: "Erro interno ao buscar usuário",
    });
  }
}

module.exports = {
  login,
  getMe,
};
