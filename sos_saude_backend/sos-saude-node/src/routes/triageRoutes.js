import { Router } from 'express';
import { auth } from '../middleware/auth.js';
import { criar, fila, proximo, atualizar, obter, remover } from '../controllers/triageController.js';

const router = Router();
router.post('/tickets', auth, criar);
router.get('/tickets/:id', auth, obter);
router.put('/tickets/:id', auth, atualizar);
router.delete('/tickets/:id', auth, remover);
router.get('/fila', auth, fila);
router.post('/fila/proximo', auth, proximo);
export default router;
