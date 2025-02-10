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
router.get('/ticket-user', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'tickets_user.html'));  // Certifique-se de que o caminho está correto
});

// Rota do Admin
router.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'adm.html'));  // Certifique-se de que o caminho está correto
});

// Rota da gestao de ticket
router.get('/menu', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'menu.html'));  // Certifique-se de que o caminho está correto
});

// Rota da recarga do ticket
router.get('/recarga', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'recarga_ticket.html'));  // Certifique-se de que o caminho está correto
});

// Rota da compra caso dê errado
router.get('/compraerrada', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'compra_errada.html'));  // Certifique-se de que o caminho está correto
});

// Rota da compra caso dê certo
router.get('/compracerta', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'compra_certa.html'));  // Certifique-se de que o caminho está correto
});

// Rota da compra caso seja pendente
router.get('/comprapendente', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'compra_pendente.html'));  // Certifique-se de que o caminho está correto
});

// Rota da pagina raiz - inicio
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'inicio.html'));  // Certifique-se de que o caminho está correto
});

module.exports = router;
