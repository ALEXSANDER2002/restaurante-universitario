const mysql = require('mysql2');
const jwt = require('jsonwebtoken');
const connection = require('../config/database');  // Conexão com o banco

// Este arquivo vai lidar com o processo de autenticação, incluindo o login de usuários e admins.

// Função para o login do usuário
const loginUsuario = (req, res) => {
    const { matricula } = req.body;

    if (!matricula) {
        return res.status(400).json({ message: "❌ Matrícula obrigatória" });
    }

    connection.query(
        'SELECT id_usuario, nome, matricula, plano FROM usuarios WHERE matricula = ?',
        [matricula],
        (err, results) => {
            if (err) {
                console.error('❌ Erro ao consultar o banco:', err);
                return res.status(500).json({ message: 'Erro no servidor' });
            }

            if (results.length === 0) {
                return res.status(400).json({ message: "Usuário não encontrado." });
            }

            const user = results[0];
            const token = jwt.sign(
                { id_usuario: user.id_usuario, nome: user.nome, matricula: user.matricula, plano: user.plano },
                'secretrandomkey',
                { expiresIn: '1h' }
            );

            res.json({ message: '✅ Login bem-sucedido!', token, user_id: user.id_usuario, nome: user.nome });
        }
    );
};

// Função para o login do administrador
const loginAdmin = (req, res) => {
    const { email, senha } = req.body;

    if (!email || !senha) {
        return res.status(400).json({ message: "❌ E-mail e senha são obrigatórios" });
    }

    connection.query(
        'SELECT * FROM admins WHERE email = ? AND senha = ?',
        [email, senha],
        (err, results) => {
            if (err) {
                console.error('❌ Erro ao consultar o banco:', err);
                return res.status(500).json({ message: 'Erro no servidor' });
            }

            if (results.length === 0) {
                return res.status(401).json({ message: "E-mail ou senha inválidos." });
            }

            const admin = results[0];
            const token = jwt.sign(
                { id: admin.id, email: admin.email, role: "admin" },
                'secretrandomkey',
                { expiresIn: '2h' }
            );

            res.json({ message: '✅ Login bem-sucedido!', token });
        }
    );
};

module.exports = {
    loginUsuario,
    loginAdmin
};
