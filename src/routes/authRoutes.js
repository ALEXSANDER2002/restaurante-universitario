const express = require('express');
const authController = require('../controllers/authController');
const router = express.Router();

router.post('/login', authController.loginUsuario); // Login do usuário
router.post('/login-admin', authController.loginAdmin); // Login do admin

module.exports = router;
