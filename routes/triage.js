// routes/triage.js
const express = require('express');
const router = express.Router();
const TriageController = require('../sos-saude-node/src/controllers/triageController');

router.get('/', TriageController.getAll);
router.get('/:id', TriageController.getById);
router.patch('/:id/status', TriageController.changeStatus);

module.exports = router;
