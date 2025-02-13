// Importando a conexão com o banco de dados
const connection = require('../config/database');

class Auth {
    // Busca um usuário no banco de dados pela matrícula
    static async buscarUsuarioPorMatricula(matricula) {
        try {
            const [results] = await connection.execute(
                'SELECT id_usuario, nome, matricula, plano FROM usuarios WHERE matricula = ?',
                [matricula]
            );
            return results.length > 0 ? results[0] : null;
        } catch (error) {
            console.error('❌ Erro ao buscar usuário por matrícula:', error);
            throw error;
        }
    }

    // Busca um administrador no banco de dados pelo e-mail
    static async buscarAdminPorEmail(email) {
        try {
            const [rows] = await connection.execute(
                'SELECT id, email, senha FROM admins WHERE email = ?',
                [email]
            );
            return rows.length > 0 ? rows[0] : null;
        } catch (error) {
            console.error('❌ Erro ao buscar admin por email:', error);
            throw error;
        }
    }
}

module.exports = Auth;