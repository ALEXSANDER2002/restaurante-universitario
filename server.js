const mysql = require('mysql2');
const jwt = require('jsonwebtoken');
const path = require('path');
const cors = require('cors');
const cron = require("node-cron");
const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());
app.use(cors()); // Permite requisições de outros domínios

// Servir arquivos estáticos (CSS, JS, imagens, etc.)
app.use(express.static(path.join(__dirname, 'R.U')));
app.use(express.static('ESTILOS'));

// 📌 Conexão com o banco de dados MySQL
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'admin',
  database: 'restaurante_universitario'
});

connection.connect(err => {
  if (err) {
    console.error('❌ Erro ao conectar ao MySQL:', err);
    return;
  }
  console.log('✅ Conectado ao MySQL!');
});

// 🚀 Rota para cadastro de usuário
app.post('/register', (req, res) => {
  const { email, password, matricula, plano, nome } = req.body;

  const query = 'INSERT INTO usuarios (email, password, matricula, plano, nome) VALUES (?, ?, ?, ?, ?)';
  connection.query(query, [email, password, matricula, plano, nome], (err, results) => {
    if (err) {
      console.error('❌ Erro ao inserir o usuário:', err);
      return res.status(500).json({ message: 'Erro ao cadastrar o usuário' });
    }
    res.json({ message: '✅ Usuário cadastrado com sucesso!' });
  });
});

// 🚀 Rota de login
app.post('/login', (req, res) => {
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
        console.error("⚠️ Nenhum usuário encontrado para a matrícula:", matricula);
        return res.status(400).json({ message: "Usuário não encontrado." });
      }

      const user = results[0];
      console.log("✅ Usuário encontrado:", user);

      const token = jwt.sign(
        { id_usuario: user.id_usuario, nome: user.nome, matricula: user.matricula, plano: user.plano },
        'secretrandomkey',
        { expiresIn: '1h' }
      );

      res.json({ message: '✅ Login bem-sucedido!', token, user_id: user.id_usuario, nome: user.nome });
    }
  );
});

// 🚀 Rota para obter as compras do banco de dados com o nome do usuário
// 🚀 Rota para obter apenas as compras do usuário logado
app.get('/compras', (req, res) => {
  const { user_id } = req.query;

  if (!user_id) {
    return res.status(400).json({ error: "Usuário não especificado" });
  }

  const sql = `
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
      WHERE compras.user_id = ?
      ORDER BY compras.created_at DESC
  `;

  connection.query(sql, [user_id], (err, results) => {
      if (err) {
          console.error("❌ Erro ao buscar compras:", err);
          return res.status(500).json({ error: "Erro ao buscar compras" });
      }

      console.log(`✅ Compras do usuário ${user_id} retornadas:`, results);
      res.json(results);
  });
});

app.get('/compras-todos', (req, res) => {
  const sql = `
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
      ORDER BY compras.created_at DESC
  `;

  connection.query(sql, (err, results) => {
      if (err) {
          console.error("❌ Erro ao buscar todas as compras:", err);
          return res.status(500).json({ error: "Erro ao buscar todas as compras" });
      }

      console.log("✅ Todas as compras retornadas:", results);
      res.json(results);
  });
});







// 🚀 Rota para criar uma nova compra no banco de dados
app.post('/criar-compra', (req, res) => {
  console.log("🛠 Cabeçalhos recebidos:", req.headers);
  console.log("🛠 Dados recebidos:", req.body);

  const { user_id, tipo_comida, campus, valor } = req.body;

  if (!user_id || !tipo_comida || !campus || !valor) {
    console.error("❌ Erro: Dados ausentes!", req.body);
    return res.status(400).json({ error: "Todos os campos são obrigatórios" });
  }

  const sql = `INSERT INTO compras (user_id, tipo_comida, campus, valor, status) VALUES (?, ?, ?, ?, 'pendente')`;

  connection.query(sql, [user_id, tipo_comida, campus, valor], (err, result) => {
    if (err) {
      console.error("❌ Erro ao inserir no banco:", err);
      return res.status(500).json({ error: "Erro ao salvar a compra" });
    }

    console.log("✅ Compra criada com sucesso!");
    res.json({ message: "Compra registrada!", id: result.insertId });
  });
});


// 🚀 Rotas para servir arquivos HTML
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'R.U', 'login.html')));
app.get('/compracerta', (req, res) => res.sendFile(path.join(__dirname, 'R.U', 'compra_certa.html')));
app.get('/compraerrada', (req, res) => res.sendFile(path.join(__dirname, 'R.U', 'compra_errada.html')));
app.get('/compra_pendente', (req, res) => res.sendFile(path.join(__dirname, 'R.U', 'compra_pendente.html')));

// 🚀 Inicializando o servidor
app.listen(port, () => {
  console.log(`✅ Servidor rodando na porta ${port}`);
});

// 🚀 Tarefa agendada para rodar todo dia à meia-noite
cron.schedule("0 0 * * *", () => {
  console.log("🕛 Limpando todos os pedidos...");

  const sql = "DELETE FROM compras";

  connection.query(sql, (err, result) => {
      if (err) {
          console.error("❌ Erro ao limpar pedidos:", err);
          return;
      }

      console.log("✅ Todos os pedidos foram removidos com sucesso!");
  });
});

// 🚀 Rota para deletar uma compra pelo ID
// 🚀 Rota para deletar uma compra pelo ID
app.delete('/deletar-compra/:id', (req, res) => {
  const compraId = req.params.id;

  console.log(`🛠 Recebendo pedido para deletar: ${compraId}`); // LOG PARA DEBUG

  if (!compraId) {
      return res.status(400).json({ error: "ID da compra não informado" });
  }

  const sql = `DELETE FROM compras WHERE id = ?`;

  connection.query(sql, [compraId], (err, result) => {
      if (err) {
          console.error("❌ Erro ao deletar a compra:", err);
          return res.status(500).json({ error: "Erro ao excluir a compra" });
      }

      console.log(`✅ Compra ${compraId} removida com sucesso!`);
      res.json({ message: "Compra removida com sucesso!" });
  });
});

// 🚀 Rota de login do administrador
app.post('/login-admin', (req, res) => {
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
        console.error("⚠️ Nenhum administrador encontrado para o e-mail:", email);
        return res.status(401).json({ message: "E-mail ou senha inválidos." });
      }

      const admin = results[0];
      console.log("✅ Administrador encontrado:", admin);

      // Gerar um token JWT para autenticação
      const token = jwt.sign(
        { id: admin.id, email: admin.email, role: "admin" },
        'secretrandomkey',
        { expiresIn: '2h' }
      );

      res.json({ message: '✅ Login bem-sucedido!', token });
    }
  );
});
