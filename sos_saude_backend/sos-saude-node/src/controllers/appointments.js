// routes/appointments.js
const express = require('express');
const router = express.Router();

// Usa o controller que você já ajustou (verificado antes)
const AppointmentsController = require('../sos-saude-node/src/controllers/appointmentsController');

// Rotas públicas (sem auth) para testar rapidamente.
// Se quiser proteção depois, adicione os middlewares authenticateToken / authorize.
router.get('/', AppointmentsController.getAll);
router.get('/:id', AppointmentsController.getById);
router.post('/', AppointmentsController.create);
router.patch('/:id', AppointmentsController.update);
router.delete('/:id', AppointmentsController.remove);

module.exports = router;
