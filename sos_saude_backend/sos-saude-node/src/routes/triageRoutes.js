const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const { criar, fila, proximo, atualizar, obter, remover } = require('../controllers/triageController');

const router = express.Router();
router.post('/tickets', authenticateToken, criar);
router.get('/tickets/:id', authenticateToken, obter);
router.put('/tickets/:id', authenticateToken, atualizar);
router.delete('/tickets/:id', authenticateToken, remover);
router.get('/fila', authenticateToken, fila);
router.post('/fila/proximo', authenticateToken, proximo);

module.exports = router;
