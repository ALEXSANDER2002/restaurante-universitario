        const express = require('express');
        const compraController = require('../controllers/compraController');
        const router = express.Router();
        const pool = require('../config/database');

        // Rota para listar as compras de um usuário
        router.get('/compras', async (req, res) => {
            try {
                const { user_id } = req.query;  // Obtém o 'user_id' da query string
                if (!user_id) {
                    return res.status(400).json({ error: "Usuário não especificado" });
                }

                const compras = await compraController.listarCompras(user_id);  // Chama o metodo no Controller
                res.json(compras);
            } catch (err) {
                res.status(500).json({ error: "Erro ao buscar compras" });
            }
        });

        router.get('/compras-todos', async (req, res) => {
            try {
                const { user_id } = req.query;

                let sql = `
                    SELECT compras.id, usuarios.nome AS usuario_nome, usuarios.matricula,
                           CASE
                               WHEN compras.campus = 'campus1' THEN 'Campus 1'
                               WHEN compras.campus = 'campus2' THEN 'Campus 2'
                               WHEN compras.campus = 'campus3' THEN 'Campus 3'
                               ELSE compras.campus
                               END AS campus,
                           CASE
                               WHEN compras.tipo_comida = 'vegetariana' THEN 'Vegetariana'
                               WHEN compras.tipo_comida = 'nao-vegetariana' THEN 'Não Vegetariana'
                               ELSE compras.tipo_comida
                               END AS tipo_comida,
                           compras.valor, compras.status, compras.created_at
                    FROM compras
                             JOIN usuarios ON compras.user_id = usuarios.id_usuario
                        ${user_id ? `WHERE compras.user_id = ${pool.escape(user_id)}` : ''}
                    ORDER BY compras.created_at DESC
                `;

                // Usando o método `query` com promessas
                const [results] = await pool.query(sql);  // pool.query retorna uma promise

                res.json(results);
            } catch (err) {
                console.error("❌ Erro ao buscar compras:", err);
                res.status(500).json({ error: "Erro ao buscar compras" });
            }
        });

        module.exports = router;



        // Rota para deletar uma compra pelo ID
        router.delete('/deletar-compra/:id', async (req, res) => {
            const { id } = req.params;

            try {
                const sql = 'DELETE FROM compras WHERE id = ?';
                const [result] = await pool.query(sql, [id]);

                if (result.affectedRows > 0) {
                    res.status(200).json({ message: 'Pedido excluído com sucesso.' });
                } else {
                    res.status(404).json({ error: 'Pedido não encontrado.' });
                }
            } catch (err) {
                console.error('❌ Erro ao excluir pedido:', err);
                res.status(500).json({ error: 'Erro ao excluir pedido.' });
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
