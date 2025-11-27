import express from "express";
import UsersController from "../controllers/usersController.js";

const router = express.Router();

// GET /api/users - Lista todos os usuários
router.get("/", UsersController.getAll);

// GET /api/users/:id - Obtém um usuário específico
router.get("/:id", UsersController.getById);

export default router;
