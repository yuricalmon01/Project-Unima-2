import { success, error } from "../utils/response.js";
import pool from "../config/db.js";

const UsersController = {
  async getAll(req, res) {
    try {
      const [users] = await pool.execute(`
        SELECT 
          u.id,
          u.username,
          u.email,
          u.first_name,
          u.last_name,
          u.cpf,
          u.phone,
          u.birth_date,
          u.gender,
          u.active,
          ut.name AS userType,
          u.created_at,
          u.updated_at
        FROM users u
        JOIN user_types ut ON u.user_type_id = ut.id
        WHERE u.active = TRUE
        ORDER BY u.first_name ASC
      `);
      return success(res, users);
    } catch (err) {
      console.error(err);
      return error(res, "Erro ao listar usuários", 500);
    }
  },

  async getById(req, res) {
    try {
      const [users] = await pool.execute(`
        SELECT 
          u.id,
          u.username,
          u.email,
          u.first_name,
          u.last_name,
          u.cpf,
          u.phone,
          u.birth_date,
          u.gender,
          u.active,
          ut.name AS userType,
          u.created_at,
          u.updated_at
        FROM users u
        JOIN user_types ut ON u.user_type_id = ut.id
        WHERE u.id = ? AND u.active = TRUE
      `, [req.params.id]);

      if (users.length === 0) {
        return error(res, "Usuário não encontrado", 404);
      }

      return success(res, users[0]);
    } catch (err) {
      console.error(err);
      return error(res, "Erro ao buscar usuário", 500);
    }
  },

  async getMe(req, res) {
    try {
      // req.user vem do middleware de autenticação JWT
      const userId = req.user?.id;

      if (!userId) {
        return error(res, "Usuário não autenticado", 401);
      }

      const [users] = await pool.execute(`
        SELECT 
          u.id,
          u.username,
          u.email,
          u.first_name,
          u.last_name,
          u.cpf,
          u.phone,
          u.birth_date,
          u.gender,
          u.active,
          ut.name AS userType,
          u.user_type_id as userTypeId,
          u.created_at,
          u.updated_at
        FROM users u
        JOIN user_types ut ON u.user_type_id = ut.id
        WHERE u.id = ? AND u.active = TRUE
      `, [userId]);

      if (users.length === 0) {
        return error(res, "Usuário não encontrado", 404);
      }

      return success(res, users[0]);
    } catch (err) {
      console.error(err);
      return error(res, "Erro ao buscar dados do usuário", 500);
    }
  },
};

export default UsersController;
