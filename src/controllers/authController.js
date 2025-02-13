// Importando a biblioteca jwt para gerar tokens JWT
const jwt = require('jsonwebtoken');
// Importando o Model de autenticação
const Auth = require('../models/Auth');

// Função para o login do usuário
const loginUsuario = async (req, res) => {
    const { matricula } = req.body;

    if (!matricula) {
        return res.status(400).json({ message: "❌ Matrícula obrigatória" });
    }

    try {
        // Chama o Model para verificar se o usuário existe
        const user = await Auth.buscarUsuarioPorMatricula(matricula);

        if (!user) {
            return res.status(400).json({ message: "Usuário não encontrado." });
        }

        // Gera o token JWT com as informações do usuário
        const token = jwt.sign(
            {
                id_usuario: user.id_usuario,
                nome: user.nome,
                matricula: user.matricula,
                plano: user.plano
            },
            'secretrandomkey', // ⚠️ Usar uma chave secreta segura em produção
            { expiresIn: '1h' }
        );

        res.json({
            message: '✅ Login bem-sucedido!',
            token,
            user_id: user.id_usuario,
            nome: user.nome
        });
    } catch (err) {
        console.error('❌ Erro ao realizar login do usuário:', err);
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
        // Chama o Model para verificar se o administrador existe
        const admin = await Auth.buscarAdminPorEmail(email);

        if (!admin || admin.senha !== senha) {
            return res.status(401).json({ message: "❌ E-mail ou senha inválidos." });
        }

        // Gera o token JWT com as informações do administrador
        const token = jwt.sign(
            { id: admin.id, email: admin.email, role: "admin" },
            'secretrandomkey', // ⚠️ Usar uma chave secreta segura em produção
            { expiresIn: '2h' }
        );

        res.json({ message: '✅ Login bem-sucedido!', token });
    } catch (err) {
        console.error('❌ Erro ao realizar login do admin:', err);
        res.status(500).json({ message: 'Erro no servidor' });
    }
};

// Exportando as funções de login
module.exports = {
    loginUsuario,
    loginAdmin
};