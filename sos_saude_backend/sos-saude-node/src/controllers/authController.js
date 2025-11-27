const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../config/db");
const { success, error } = require("../utils/response");

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const [users] = await pool.execute(
      "SELECT u.*, ut.name AS userType FROM users u JOIN user_types ut ON u.user_type_id = ut.id WHERE u.username = ? AND u.active = TRUE",
      [username]
    );

    if (users.length === 0) {
      return error(res, "Credenciais inválidas", 401);
    }

    const user = users[0];
    const validPassword = await bcrypt.compare(password, user.password_hash);

    if (!validPassword) {
      return error(res, "Credenciais inválidas", 401);
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, userType: user.user_type_id },
      process.env.JWT_SECRET || "unima_secret_key",
      { expiresIn: "8h" }
    );

    const userData = {
      id: user.id,
      username: user.username,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      name: `${user.first_name} ${user.last_name}`,
      userType: user.userType,
      user_type_id: user.user_type_id,
    };

    return success(res, { token, user: userData });
  } catch (err) {
    console.error(err);
    return error(res, "Erro ao fazer login", 500);
  }
};

exports.getMe = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return error(res, "Usuário não autenticado", 401);
    }

    const [users] = await pool.execute(
      "SELECT u.*, ut.name AS userType FROM users u JOIN user_types ut ON u.user_type_id = ut.id WHERE u.id = ? AND u.active = TRUE",
      [userId]
    );

    if (users.length === 0) {
      return error(res, "Usuário não encontrado", 404);
    }

    const user = users[0];
    const userData = {
      id: user.id,
      username: user.username,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      name: `${user.first_name} ${user.last_name}`,
      userType: user.userType,
      user_type_id: user.user_type_id,
      cpf: user.cpf,
      phone: user.phone,
      birth_date: user.birth_date,
      gender: user.gender,
    };

    return success(res, userData);
  } catch (err) {
    console.error(err);
    return error(res, "Erro ao buscar dados do usuário", 500);
  }
};
