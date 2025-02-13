// Importando a biblioteca jwt para gerar tokens JWT
const jwt = require('jsonwebtoken');
// Importando a conexão com o banco de dados
const connection = require('../config/database');

// Função para o login do usuário
const loginUsuario = async (req, res) => {
    // Desestruturando a matrícula do corpo da requisição
    const { matricula } = req.body;

    // Verifica se a matrícula foi fornecida, caso contrário, retorna erro 400
    if (!matricula) {
        return res.status(400).json({ message: "❌ Matrícula obrigatória" });
    }

    try {
        // Consulta o banco de dados para verificar se a matrícula existe
        const [results] = await connection.execute(
            'SELECT id_usuario, nome, matricula, plano FROM usuarios WHERE matricula = ?',
            [matricula] // Substitui o '?' pela matrícula fornecida
        );

        // Se não encontrar o usuário, retorna erro 400
        if (results.length === 0) {
            return res.status(400).json({ message: "Usuário não encontrado." });
        }

        const user = results[0]; // Obtém o primeiro usuário encontrado
        // Gera um token JWT com as informações do usuário
        const token = jwt.sign(
            { id_usuario: user.id_usuario, nome: user.nome, matricula: user.matricula, plano: user.plano },
            'secretrandomkey', // ⚠️ Usar uma chave secreta segura em produção
            { expiresIn: '1h' } // Define a expiração do token para 1 hora
        );

        // Retorna uma resposta com sucesso, incluindo o token e dados do usuário
        res.json({ message: '✅ Login bem-sucedido!', token, user_id: user.id_usuario, nome: user.nome });
    } catch (err) {
        console.error('❌ Erro ao consultar o banco:', err); // Registra qualquer erro de banco de dados
        res.status(500).json({ message: 'Erro no servidor' }); // Retorna erro 500 em caso de falha
    }
};

// Função para o login do administrador (sem bcrypt)
const loginAdmin = async (req, res) => {
    // Desestruturando e-mail e senha do corpo da requisição
    const { email, senha } = req.body;

    // Verifica se o e-mail e senha foram fornecidos, caso contrário, retorna erro 400
    if (!email || !senha) {
        return res.status(400).json({ message: "❌ E-mail e senha são obrigatórios" });
    }

    try {
        // Consulta o banco de dados para verificar se o e-mail do administrador existe
        const [rows] = await connection.execute(
            'SELECT id, email, senha FROM admins WHERE email = ?',
            [email] // Substitui o '?' pelo e-mail fornecido
        );

        // Se o administrador não for encontrado, retorna erro 401
        if (rows.length === 0) {
            return res.status(401).json({ message: "❌ E-mail ou senha inválidos." });
        }

        const admin = rows[0]; // Obtém o primeiro administrador encontrado

        // Verifica se a senha fornecida é igual à senha armazenada (sem criptografia, o que não é seguro)
        if (admin.senha !== senha) {
            return res.status(401).json({ message: "❌ E-mail ou senha inválidos." });
        }

        // Gera um token JWT com as informações do administrador
        const token = jwt.sign(
            { id: admin.id, email: admin.email, role: "admin" },
            'secretrandomkey', // ⚠️ Usar uma chave secreta segura em produção
            { expiresIn: '2h' } // Define a expiração do token para 2 horas
        );

        // Retorna uma resposta com sucesso, incluindo o token
        res.json({ message: '✅ Login bem-sucedido!', token });
    } catch (err) {
        console.error('❌ Erro ao consultar o banco:', err); // Registra qualquer erro de banco de dados
        res.status(500).json({ message: 'Erro no servidor' }); // Retorna erro 500 em caso de falha
    }
};

// Exportando as funções de login
module.exports = {
    loginUsuario,
    loginAdmin
};
