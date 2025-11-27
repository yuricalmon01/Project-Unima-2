// routes/password.js
const express = require('express');
const router = express.Router();
const PasswordController = require('../sos-saude-node/src/controllers/passwordController');

router.post('/recovery', PasswordController.requestRecovery);
router.post('/reset', PasswordController.resetPassword);

module.exports = router;
