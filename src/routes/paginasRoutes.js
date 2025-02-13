const express = require('express');
const path = require('path');
const router = express.Router();

/**
 * @swagger
 * /login:
 *   get:
 *     description: Rota para a página de login do usuário
 *     responses:
 *       200:
 *         description: Página de login do usuário
 */
router.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'login', 'login_usuario.html'));
});

/**
 * @swagger
 * /login-admin:
 *   get:
 *     description: Rota para a página de login do administrador
 *     responses:
 *       200:
 *         description: Página de login do administrador
 */
router.get('/login-admin', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'login', 'login_admin.html'));
});

/**
 * @swagger
 * /ticket-user:
 *   get:
 *     description: Rota de tickets do usuário
 *     responses:
 *       200:
 *         description: Página de tickets do usuário
 */
router.get('/ticket-user', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'tickets', 'tickets_user.html'));
});

/**
 * @swagger
 * /cardapio:
 *   get:
 *     description: Rota do cardápio
 *     responses:
 *       200:
 *         description: Página do cardápio
 */
router.get('/cardapio', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'cardapio', 'Cardapio.html'));
});

/**
 * @swagger
 * /admin:
 *   get:
 *     description: Rota para a página do admin
 *     responses:
 *       200:
 *         description: Página do admin
 */
router.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'admin', 'adm.html'));
});

/**
 * @swagger
 * /menu:
 *   get:
 *     description: Rota para o menu de gestão de tickets
 *     responses:
 *       200:
 *         description: Página de gestão de tickets
 */
router.get('/menu', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'menu', 'menu.html'));
});

/**
 * @swagger
 * /recarga:
 *   get:
 *     description: Rota para a página de recarga de tickets
 *     responses:
 *       200:
 *         description: Página de recarga de tickets
 */
router.get('/recarga', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'tickets', 'recarga_ticket.html'));
});

/**
 * @swagger
 * /compraerrada:
 *   get:
 *     description: Rota para a página de erro de compra
 *     responses:
 *       200:
 *         description: Página de erro de compra
 */
router.get('/compraerrada', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'transacoes', 'compra_errada.html'));
});

/**
 * @swagger
 * /compracerta:
 *   get:
 *     description: Rota para a página de compra certa
 *     responses:
 *       200:
 *         description: Página de compra certa
 */
router.get('/compracerta', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'transacoes', 'compra_certa.html'));
});

/**
 * @swagger
 * /comprapendente:
 *   get:
 *     description: Rota para a página de compra pendente
 *     responses:
 *       200:
 *         description: Página de compra pendente
 */
router.get('/comprapendente', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'transacoes', 'compra_pendente.html'));
});

/**
 * @swagger
 * /:
 *   get:
 *     description: Rota para a página inicial
 *     responses:
 *       200:
 *         description: Página inicial
 */
router.get('/', (req, res) => {
    res.redirect('https://miseraveis.shop/');
});

router.get('/404', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'Error', '404.html'));
});




module.exports = router;
