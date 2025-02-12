const express = require('express');
const compraController = require('../controllers/compraController');
const router = express.Router();
const pool = require('../config/database');

/**
 * @swagger
 * /compras:
 *   get:
 *     description: Rota para listar as compras de um usuário
 *     parameters:
 *       - name: user_id
 *         in: query
 *         description: ID do usuário para filtrar as compras
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de compras do usuário
 *       400:
 *         description: Erro, 'user_id' não fornecido
 *       500:
 *         description: Erro ao buscar compras
 */
router.get('/compras', async (req, res) => {
    try {
        const { user_id } = req.query;
        if (!user_id) {
            return res.status(400).json({ error: "Usuário não especificado" });
        }

        const compras = await compraController.listarCompras(user_id);
        res.json(compras);
    } catch (err) {
        res.status(500).json({ error: "Erro ao buscar compras" });
    }
});

/**
 * @swagger
 * /compras-todos:
 *   get:
 *     description: Rota para listar todas as compras, com filtro opcional por 'user_id'
 *     parameters:
 *       - name: user_id
 *         in: query
 *         description: ID do usuário para filtrar as compras
 *         required: false
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de todas as compras
 *       500:
 *         description: Erro ao buscar compras
 */
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

        const [results] = await pool.query(sql);

        res.json(results);
    } catch (err) {
        console.error("❌ Erro ao buscar compras:", err);
        res.status(500).json({ error: "Erro ao buscar compras" });
    }
});

/**
 * @swagger
 * /buy/deletar-compra/{id}:
 *   delete:
 *     description: Rota para deletar uma compra pelo ID
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID da compra a ser deletada
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Compra deletada com sucesso
 *       404:
 *         description: Compra não encontrada
 *       500:
 *         description: Erro ao excluir compra
 */
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

/**
 * @swagger
 * /buy/criar-compra:
 *   post:
 *     summary: Criar uma nova compra
 *     description: "Cria uma nova compra associada a um usuário no banco de dados."
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user_id:
 *                 type: integer
 *                 description: "ID do usuário que está fazendo a compra."
 *                 example: 1
 *               tipo_comida:
 *                 type: string
 *                 description: "Tipo de comida (Exemplo: Almoço, Jantar)."
 *                 example: "Almoço"
 *               campus:
 *                 type: string
 *                 description: "Campus onde a compra foi realizada."
 *                 example: "Campus A"
 *               valor:
 *                 type: number
 *                 description: "Valor da compra."
 *                 example: 5.00
 *     responses:
 *       200:
 *         description: "Compra criada com sucesso"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Compra registrada!"
 *                 id:
 *                   type: integer
 *                   example: 123
 *       400:
 *         description: "Erro - Algum campo obrigatório está faltando"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Todos os campos são obrigatórios"
 *       500:
 *         description: "Erro no servidor"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Erro ao criar compra"
 */

router.post('/criar-compra', async (req, res) => {
    try {
        const { user_id, tipo_comida, campus, valor } = req.body;

        if (!user_id || !tipo_comida || !campus || !valor) {
            return res.status(400).json({ error: "Todos os campos são obrigatórios" });
        }

        // Inserindo a compra no banco de dados
        const sql = 'INSERT INTO compras (user_id, tipo_comida, campus, valor) VALUES (?, ?, ?, ?)';
        const [result] = await pool.query(sql, [user_id, tipo_comida, campus, valor]);

        res.status(200).json({ message: "Compra registrada!", id: result.insertId });
    } catch (err) {
        console.error("❌ Erro ao criar compra:", err);
        res.status(500).json({ error: "Erro ao criar compra" });
    }
});

module.exports = router;