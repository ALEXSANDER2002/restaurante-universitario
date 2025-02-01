const express = require('express');
const mysql = require('mysql2');
const jwt = require('jsonwebtoken');
const path = require('path');
const cors = require('cors');
const cron = require("node-cron");
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
app.get('/compras', (req, res) => {
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
          console.error("❌ Erro ao buscar compras:", err);
          return res.status(500).json({ error: "Erro ao buscar compras" });
      }

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