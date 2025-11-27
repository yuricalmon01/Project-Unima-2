const express = require("express");
const router = express.Router();
const PacientesController = require("../controllers/pacientesController");

// GET /api/pacientes - Lista todos os pacientes
router.get("/", PacientesController.getAll);

// GET /api/pacientes/:id - Obtém um paciente específico
router.get("/:id", PacientesController.getById);

// POST /api/pacientes - Cria novo paciente
router.post("/", PacientesController.create);

// PUT /api/pacientes/:id - Atualiza paciente
router.put("/:id", PacientesController.update);

// DELETE /api/pacientes/:id - Remove paciente
router.delete("/:id", PacientesController.remove);

module.exports = router;
