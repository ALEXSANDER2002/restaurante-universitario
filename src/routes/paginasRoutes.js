// Importando o módulo 'express' e o módulo 'path' para manipulação de caminhos
const express = require('express');
const path = require('path');
// Criando o roteador da aplicação
const router = express.Router();

// Definindo as rotas do aplicativo com suas descrições usando o Swagger

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
    // Serve a página de login do usuário
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
    // Serve a página de login do administrador
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
    // Serve a página de tickets do usuário
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
    // Serve a página do cardápio
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
    // Serve a página de administração
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
    // Serve a página de gestão de tickets
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
    // Serve a página para recarga de tickets
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
    // Serve a página de erro de compra
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
    // Serve a página de compra certa
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
    // Serve a página de compra pendente
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
    // Redireciona para a página inicial do site
    res.redirect('https://miseraveis.shop/');
});

// Rota personalizada para uma página 404
router.get('/404', (req, res) => {
    // Serve a página de erro 404
    res.sendFile(path.join(__dirname, '..', 'views', 'Error', '404.html'));
});

// Exportando o roteador para ser usado em outro arquivo
module.exports = router;
