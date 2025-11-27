$content = @'
const express = require('express');
const router = express.Router();

// Usa o controller que você já ajustou
const AppointmentsController = require('../sos-saude-node/src/controllers/appointmentsController');

// Rotas básicas (sem autenticação para teste)
router.get('/', AppointmentsController.getAll);
router.get('/:id', AppointmentsController.getById);
router.post('/', AppointmentsController.create);
router.patch('/:id', AppointmentsController.update);
router.delete('/:id', AppointmentsController.remove);

module.exports = router;
'@

Set-Content -Path .\routes\appointments.js -Value $content -Encoding UTF8
