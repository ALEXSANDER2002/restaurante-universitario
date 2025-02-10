const express = require('express');
const authRoutes = require('./authRoutes');
const compraRoutes = require('./compraRoutes');
const paginaRoutes = require('./paginasRoutes');



const router = express.Router();

// Rotas para páginas HTML
router.use('/', paginaRoutes);



// Outras rotas da aplicação
router.use('/auth', authRoutes);
router.use('/buy', compraRoutes);


module.exports = router;
