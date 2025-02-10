const  connection  = require('../config/database');

class Compra {
    // Metodo para listar compras de um usuário
    static async listarCompras(user_id) {
        try {
            const [rows] = await connection.execute(
                'SELECT * FROM compras WHERE user_id = ? ORDER BY created_at DESC',
                [user_id]
            );
            return rows;
        } catch (error) {
            console.error('Erro ao listar compras:', error);
            throw error;
        }
    }

    // Metodo para criar uma compra
    static async criarCompra(user_id, tipo_comida, campus, valor) {
        try {
            const query = `
                INSERT INTO compras (user_id, tipo_comida, campus, valor, status)
                VALUES (?, ?, ?, ?, 'pendente')
            `;
            const [result] = await connection.execute(query, [user_id, tipo_comida, campus, valor]);

            console.log("🛒 Compra registrada:", result); // Log para debug

            return result.insertId;
        } catch (error) {
            console.error('❌ Erro ao criar compra:', error);
            throw error;
        }
    }

    // Metodo para limpar compras antigas (mais de 30 dias)
    static async limparCompras() {
        try {
            const query = `
                DELETE FROM compras
                WHERE created_at < NOW() - INTERVAL 30 DAY
            `;
            const [rows] = await connection.execute(query);

            if (rows.affectedRows > 0) {
                console.log(`🗑️ ${rows.affectedRows} compras antigas removidas.`);
            } else {
                console.log("✅ Nenhuma compra antiga encontrada para ser removida.");
            }
        } catch (error) {
            console.error('❌ Erro ao limpar compras:', error);
            throw error;
        }
    }
}

module.exports = Compra;
