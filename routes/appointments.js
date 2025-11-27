const fs = require('fs');
const path = require('path');
const express = require('express');
const router = express.Router();

// tenta vários caminhos possíveis até encontrar o controller
const candidates = [
  path.join(__dirname, '..', 'sos-saude-node', 'src', 'controllers', 'appointmentsController'),
  path.join(__dirname, '..', 'sos-saude-node', 'src', 'controllers', 'appointments'),
  path.join(__dirname, '..', 'sos-saude-node', 'controllers', 'appointmentsController'),
  path.join(__dirname, '..', 'sos-saude-node', 'controllers', 'appointments'),
  path.join(__dirname, '..', 'sos_saude_node', 'src', 'controllers', 'appointmentsController'),
  path.join(__dirname, '..', 'sos-saude-backend', 'src', 'controllers', 'appointmentsController'),
  path.join(__dirname, '..', 'src', 'controllers', 'appointmentsController'),
];

let AppointmentsController = null;
for (const c of candidates) {
  try {
    if (fs.existsSync(c + '.js') || fs.existsSync(c)) {
      AppointmentsController = require(c);
      break;
    }
  } catch (e) {
    // ignora e tenta próximo
  }
}

if (!AppointmentsController) {
  throw new Error('appointmentsController não encontrado em caminhos esperados. Verifique onde está o arquivo e me envie o caminho se este erro persistir.');
}

// rotas básicas (sem autenticação, para testes)
router.get('/', AppointmentsController.getAll);
router.get('/:id', AppointmentsController.getById);
router.post('/', AppointmentsController.create);
router.patch('/:id', AppointmentsController.update);
router.delete('/:id', AppointmentsController.remove);

module.exports = router;
