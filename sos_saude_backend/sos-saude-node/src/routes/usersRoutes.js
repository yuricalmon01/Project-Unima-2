const express = require("express");
const router = express.Router();
const UsersController = require("../controllers/usersController");

// GET /api/users - Lista todos os usuários
router.get("/", UsersController.getAll);

// GET /api/users/:id - Obtém um usuário específico
router.get("/:id", UsersController.getById);

module.exports = router;
