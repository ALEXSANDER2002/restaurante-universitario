// Importando os módulos necessários
const express = require('express'); // Framework para a criação de rotas
const authController = require('../controllers/authController'); // Controlador para as ações de autenticação (login)
const router = express.Router(); // Instância do roteador do Express

// Definindo as rotas de login para usuário e administrador
router.post('/login', authController.loginUsuario); // Rota para o login do usuário, chamando a função 'loginUsuario' no controlador
router.post('/login-admin', authController.loginAdmin); // Rota para o login do administrador, chamando a função 'loginAdmin' no controlador

// Exportando o roteador para ser utilizado em outras partes da aplicação
module.exports = router;
