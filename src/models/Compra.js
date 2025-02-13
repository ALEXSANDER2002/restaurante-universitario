// Importando a conexão com o banco de dados
const connection = require('../config/database');

class Compra {
    // Método para listar todas as compras de um usuário específico
    static async listarCompras(user_id) {
        try {
            // Executa a consulta SQL para listar as compras do usuário ordenadas pela data de criação
            const [rows] = await connection.execute(
                'SELECT * FROM compras WHERE user_id = ? ORDER BY created_at DESC',
                [user_id] // Substitui o ? pela variável user_id
            );
            return rows; // Retorna as compras encontradas
        } catch (error) {
            console.error('Erro ao listar compras:', error); // Registra erro no console caso haja uma falha
            throw error; // Lança o erro para ser tratado em outro lugar
        }
    }

    // Método para criar uma nova compra
    static async criarCompra(user_id, tipo_comida, campus, valor) {
        try {
            // Define a query SQL para inserir uma nova compra na tabela
            const query = `
                INSERT INTO compras (user_id, tipo_comida, campus, valor, status)
                VALUES (?, ?, ?, ?, 'pendente')
            `;
            // Executa a consulta de inserção
            const [result] = await connection.execute(query, [user_id, tipo_comida, campus, valor]);

            console.log("🛒 Compra registrada:", result); // Log para debug mostrando a compra registrada

            return result.insertId; // Retorna o ID da compra inserida
        } catch (error) {
            console.error('❌ Erro ao criar compra:', error); // Registra o erro no console
            throw error; // Lança o erro para ser tratado em outro lugar
        }
    }

    // Método para limpar compras antigas (mais de 30 dias)
    static async limparCompras() {
        try {
            // Define a query SQL para deletar compras com mais de 30 dias
            const query = `
                DELETE FROM compras
                WHERE created_at < NOW() - INTERVAL 30 DAY
            `;
            // Executa a consulta de exclusão
            const [rows] = await connection.execute(query);

            // Verifica se houve compras removidas
            if (rows.affectedRows > 0) {
                console.log(`🗑️ ${rows.affectedRows} compras antigas removidas.`); // Log indicando quantas compras foram removidas
            } else {
                console.log("✅ Nenhuma compra antiga encontrada para ser removida."); // Log indicando que nenhuma compra foi removida
            }
        } catch (error) {
            console.error('❌ Erro ao limpar compras:', error); // Registra o erro no console
            throw error; // Lança o erro para ser tratado em outro lugar
        }
    }
}

// Exportando a classe Compra para ser utilizada em outros arquivos
module.exports = Compra;
