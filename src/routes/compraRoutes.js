const express = require('express');
const compraController = require('../controllers/compraController');
const router = express.Router();

// Rota para listar as compras de um usuário
router.get('/compras', async (req, res) => {
    try {
        const { user_id } = req.query;  // Obtém o 'user_id' da query string
        if (!user_id) {
            return res.status(400).json({ error: "Usuário não especificado" });
        }

        const compras = await compraController.listarCompras(user_id);  // Chama o método no Controller
        res.json(compras);
    } catch (err) {
        res.status(500).json({ error: "Erro ao buscar compras" });
    }
});

// Rota para criar uma compra
router.post('/criar-compra', async (req, res) => {
    try {
        const { user_id, tipo_comida, campus, valor } = req.body;

        if (!user_id || !tipo_comida || !campus || !valor) {
            return res.status(400).json({ error: "Todos os campos são obrigatórios" });
        }

        const compraId = await compraController.criarCompra(user_id, tipo_comida, campus, valor);  // Chama o método no Controller
        res.json({ message: "Compra registrada!", id: compraId });
    } catch (err) {
        res.status(500).json({ error: "Erro ao criar compra" });
    }
});

module.exports = router;
