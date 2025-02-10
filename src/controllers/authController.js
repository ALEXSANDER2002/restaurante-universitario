const jwt = require('jsonwebtoken');
const connection = require('../config/database');

// Função para o login do usuário
const loginUsuario = async (req, res) => {
    const { matricula } = req.body;

    if (!matricula) {
        return res.status(400).json({ message: "❌ Matrícula obrigatória" });
    }

    try {
        const [results] = await connection.execute(
            'SELECT id_usuario, nome, matricula, plano FROM usuarios WHERE matricula = ?',
            [matricula]
        );

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
    } catch (err) {
        console.error('❌ Erro ao consultar o banco:', err);
        res.status(500).json({ message: 'Erro no servidor' });
    }
};

// Função para o login do administrador
const loginAdmin = async (req, res) => {
    const { email, senha } = req.body;

    if (!email || !senha) {
        return res.status(400).json({ message: "❌ E-mail e senha são obrigatórios" });
    }

    try {
        const [results] = await connection.execute(
            'SELECT * FROM admins WHERE email = ? AND senha = ?',
            [email, senha]
        );

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
    } catch (err) {
        console.error('❌ Erro ao consultar o banco:', err);
        res.status(500).json({ message: 'Erro no servidor' });
    }
};

module.exports = {
    loginUsuario,
    loginAdmin
};
