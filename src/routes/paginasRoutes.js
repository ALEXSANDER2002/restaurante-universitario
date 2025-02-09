const express = require('express');
const path = require('path');
const router = express.Router();

// Rota para a página de login do usuário
router.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'login_usuario.html'));
});

// Rota para a página de login do administrador
router.get('/login-admin', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'login_admin.html'));
});

// Rota de tickets do usuario
router.get('/ticket_user', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'tickets_user.html'));  // Certifique-se de que o caminho está correto
});

// Rota da pagina raiz - inicio
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'inicio.html'));  // Certifique-se de que o caminho está correto
});

module.exports = router;
