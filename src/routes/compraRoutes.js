// Importando os módulos necessários
const express = require('express'); // Framework para a criação de rotas
const compraController = require('../controllers/compraController'); // Controlador para manipulação de compras
const router = express.Router(); // Instância do roteador do Express
const pool = require('../config/database'); // Conexão com o banco de dados

// Rota para listar as compras de um usuário específico
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
        const { user_id } = req.query; // Obtendo o 'user_id' a partir da query string
        if (!user_id) {
            return res.status(400).json({ error: "Usuário não especificado" }); // Caso o 'user_id' não seja fornecido, erro 400
        }

        const compras = await compraController.listarCompras(user_id); // Chama o controlador para listar as compras
        res.json(compras); // Retorna a lista de compras em formato JSON
    } catch (err) {
        res.status(500).json({ error: "Erro ao buscar compras" }); // Caso ocorra algum erro, retorna erro 500
    }
});

// Rota para listar todas as compras, com possibilidade de filtrar por 'user_id'
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
        const { user_id } = req.query; // Verifica se há filtro por 'user_id'

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

        const [results] = await pool.query(sql); // Executa a consulta no banco de dados

        res.json(results); // Retorna os resultados das compras
    } catch (err) {
        console.error("❌ Erro ao buscar compras:", err); // Registra o erro
        res.status(500).json({ error: "Erro ao buscar compras" }); // Retorna erro 500 caso ocorra algum problema
    }
});

// Rota para deletar uma compra usando o ID
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
    const { id } = req.params; // Obtém o 'id' da compra a partir dos parâmetros da rota

    try {
        const sql = 'DELETE FROM compras WHERE id = ?'; // Query SQL para deletar a compra
        const [result] = await pool.query(sql, [id]); // Executa a consulta de deleção

        if (result.affectedRows > 0) {
            res.status(200).json({ message: 'Pedido excluído com sucesso.' }); // Retorna sucesso caso a compra tenha sido deletada
        } else {
            res.status(404).json({ error: 'Pedido não encontrado.' }); // Retorna erro 404 se a compra não for encontrada
        }
    } catch (err) {
        console.error('❌ Erro ao excluir pedido:', err); // Registra o erro
        res.status(500).json({ error: 'Erro ao excluir pedido.' }); // Retorna erro 500 em caso de falha
    }
});

// Rota para criar uma nova compra
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
        const { user_id, tipo_comida, campus, valor } = req.body; // Obtém os dados da compra a partir do corpo da requisição

        if (!user_id || !tipo_comida || !campus || !valor) {
            return res.status(400).json({ error: "Todos os campos são obrigatórios" }); // Retorna erro 400 se algum campo obrigatório estiver faltando
        }

        // Query SQL para inserir uma nova compra no banco de dados
        const sql = 'INSERT INTO compras (user_id, tipo_comida, campus, valor) VALUES (?, ?, ?, ?)';
        const [result] = await pool.query(sql, [user_id, tipo_comida, campus, valor]);

        res.status(200).json({ message: "Compra registrada!", id: result.insertId }); // Retorna sucesso com o ID da compra criada
    } catch (err) {
        console.error("❌ Erro ao criar compra:", err); // Registra o erro
        res.status(500).json({ error: "Erro ao criar compra" }); // Retorna erro 500 caso ocorra algum problema
    }
});

// Exportando o roteador para ser usado em outras partes da aplicação
module.exports = router;
