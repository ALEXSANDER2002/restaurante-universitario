const express = require('express');
const mysql = require('mysql2');
const jwt = require('jsonwebtoken');
const path = require('path');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors()); // Permite requisições de outros domínios

// Servir arquivos estáticos (CSS, JS, imagens, etc.)
app.use(express.static(path.join(__dirname, 'R.U')));
app.use(express.static('ESTILOS'));


// Conexão com o banco de dados MySQL
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'admin',
  database: 'restaurante_universitario'
});

connection.connect(err => {
  if (err) {
    console.error('Erro ao conectar ao MySQL:', err);
    return;
  }
  console.log('✅ Conectado ao MySQL!');
});

// 🚀 Rota para cadastro de usuário
app.post('/register', (req, res) => {
  const { email, password, matricula, plano } = req.body;

  const query = 'INSERT INTO usuarios (email, password, matricula, plano) VALUES (?, ?, ?, ?)';
  connection.query(query, [email, password, matricula, plano], (err, results) => {
    if (err) {
      console.error('❌ Erro ao inserir o usuário:', err);
      return res.status(500).send('Erro ao cadastrar o usuário');
    }
    res.json({ message: '✅ Usuário cadastrado com sucesso!' });
  });
});

// 🚀 Rota de login
app.post('/login', (req, res) => {
  const { matricula } = req.body;

  connection.query('SELECT * FROM usuarios WHERE matricula = ?', [matricula], (err, results) => {
    if (err) {
      console.error('❌ Erro ao consultar o banco:', err);
      return res.status(500).send('Erro no servidor');
    }

    if (results.length === 0) {
      return res.status(400).json({ message: 'Usuário não encontrado' });
    }

    const user = results[0];

    // Gera um token JWT para autenticação do usuário
    const token = jwt.sign({ id: user.id, matricula: user.matricula, plano: user.plano }, 'secretrandomkey', {
      expiresIn: '1h',
    });

    res.json({ message: '✅ Login bem-sucedido!', token, user });
  });
});

// 🚀 Rota para criar preferência de pagamento no Mercado Pago
// 🚀 Rota para salvar no banco sem criar pagamento
app.post('/salvar-compra', (req, res) => {
  const { user_id, tipo_comida, campus, valor } = req.body;

  if (!user_id || !tipo_comida || !campus || !valor) {
    return res.status(400).json({ error: "Todos os campos são obrigatórios" });
  }

  const sql = `INSERT INTO compras (user_id, tipo_comida, campus, valor, status) VALUES (?, ?, ?, ?, 'pendente')`;
  
  connection.query(sql, [user_id, tipo_comida, campus, valor], (err, result) => {
    if (err) {
      console.error("❌ Erro ao inserir no banco:", err);
      return res.status(500).json({ error: "Erro ao salvar a compra" });
    }
    
    console.log("✅ Compra registrada no banco!");
    res.json({ message: "Compra registrada com sucesso!", id: result.insertId });
  });
});

// 🚀 Iniciando o servidor
app.listen(port, () => {
  console.log(`✅ Servidor rodando na porta ${port}`);
});

// 🚀 Rota para servir o arquivo HTML principal (login.html)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'R.U', 'login.html'));
});

// 🚀 Rotas para páginas de resultado de compra
app.get('/compracerta', (req, res) => {
  res.sendFile(path.join(__dirname, 'R.U', 'compra_certa.html'));
});

app.get('/compraerrada', (req, res) => {
  res.sendFile(path.join(__dirname, 'R.U', 'compra_errada.html'));
});

app.get('/compra_pendente', (req, res) => {
  res.sendFile(path.join(__dirname, 'R.U', 'compra_pendente.html'));
});

// 🚀 Rota para obter as compras do banco de dados com o nome do usuário
// 🚀 Rota para obter as compras do banco de dados com o nome do usuário
// 🚀 Rota para obter as compras do banco de dados com o nome do usuário
app.get('/compras', (req, res) => {
  const sql = `
    SELECT compras.id, usuarios.nome AS usuario_nome, usuarios.matricula, compras.tipo_comida, compras.campus, compras.valor, compras.status, compras.created_at
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
  console.log("🛠 Dados recebidos:", req.body); // Debug para verificar os dados recebidos

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




