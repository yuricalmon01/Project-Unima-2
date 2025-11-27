// src/controllers/authController.js

import pool from "../config/db.js";
import bcrypt from "bcryptjs";
import { generateToken, generateRefreshToken, verifyRefreshToken } from "../utils/jwt.js";

// POST /api/auth/login
export async function login(req, res) {
  try {
    // Aceita login por email ou username
    const { username, email, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        error: "Username e senha são obrigatórios",
      });
    }

    // Busca por email ou username
    let rows;
    if (email) {
      [rows] = await pool.query("SELECT * FROM users WHERE email = ? LIMIT 1", [email]);
    } else if (username) {
      [rows] = await pool.query("SELECT * FROM users WHERE username = ? LIMIT 1", [username]);
    } else {
      return res.status(400).json({ success: false, error: "Email ou username são obrigatórios" });
    }

    if (!rows.length) {
      return res.status(401).json({
        success: false,
        error: "Credenciais inválidas",
      });
    }

    const user = rows[0];

    // Comparação segura com bcrypt
    // Regra: somente pacientes (user_type_id === 5) podem fazer login via email.
    if (email && user.user_type_id !== 5) {
      return res.status(400).json({ success: false, error: "Somente pacientes podem usar email para login" });
    }

    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) {
      return res.status(401).json({ success: false, error: "Credenciais inválidas" });
    }

    const token = generateToken({ id: user.id, role: user.user_type_id });
    const refreshToken = generateRefreshToken({ id: user.id, role: user.user_type_id });

    return res.json({
      success: true,
      data: {
        token,
        refreshToken,
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
export async function getMe(req, res) {
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

// POST /api/auth/refresh
export async function refresh(req, res) {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(400).json({ success: false, error: "refreshToken é obrigatório" });
    }

    let payload;
    try {
      payload = verifyRefreshToken(refreshToken);
    } catch (err) {
      return res.status(403).json({ success: false, error: "Refresh token inválido" });
    }

    // Opcional: verificar se usuário ainda existe
    const [rows] = await pool.query("SELECT id, user_type_id FROM users WHERE id = ? LIMIT 1", [payload.id]);
    if (!rows.length) {
      return res.status(404).json({ success: false, error: "Usuário não encontrado" });
    }

    const user = rows[0];
    const newToken = generateToken({ id: user.id, role: user.user_type_id });

    return res.json({ success: true, data: { token: newToken } });
  } catch (err) {
    console.error('Erro em refresh token:', err);
    return res.status(500).json({ success: false, error: 'Erro interno' });
  }
}
