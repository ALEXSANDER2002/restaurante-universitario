const express = require('express');
const mysql = require('mysql2');
const jwt = require('jsonwebtoken');
const path = require('path');

// Configuração do servidor e banco de dados
const app = express();
const port = 3000;

app.use(express.json()); // Usado para converter as requisições em JSON

// Servir arquivos estáticos (CSS, JS, imagens, etc)
app.use(express.static(path.join(__dirname, 'R.U')));  
app.use(express.static('ESTILOS'));

// Conexão com o banco de dados MySQL
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'admin',
  database: 'restaurante_universitario'
});

// Verificação de conexão com o banco
connection.connect(err => {
  if (err) {
    console.error('Erro ao conectar ao MySQL:', err);
    return;
  }
  console.log('Conectado ao MySQL!');
});

// Rota para cadastro de usuário
app.post('/register', (req, res) => {
  const { email, password } = req.body;

  const query = 'INSERT INTO usuarios (email, password) VALUES (?, ?)';
  connection.query(query, [email, password], (err, results) => {
    if (err) {
      console.error('Erro ao inserir o usuário:', err);
      return res.status(500).send('Erro ao cadastrar o usuário');
    }
    res.json({ message: 'Usuário cadastrado com sucesso!' });
  });
});

// Rota de login
app.post('/login', (req, res) => {
  const { matricula} = req.body;

  connection.query('SELECT * FROM usuarios WHERE matricula = ?', [matricula], (err, results) => {
    if (err) {
      console.error('Erro ao consultar o banco:', err);
      return res.status(500).send('Erro no servidor');
    }

    if (results.length === 0) {
      return res.status(400).send({ message: 'Usuário não encontrado' });
    }

    const user = results[0];

    // Verifica se o usuário tem o plano subsidiado
    if (user.plano !== 'Subsidiado') {
      return res.status(400).send({ message: 'Usuário não autorizado a realizar compras subsidiadas' });
    }

    const token = jwt.sign({ id: user.id, matricula: user.matricula}, 'secretrandomkey', {
      expiresIn: '1h',
    });

    res.json({ message: 'Login bem-sucedido!', token });
  });
});

// Rota para servir o arquivo HTML principal (login.html)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'R.U', 'login.html')); 
});

// Inicializando o servidor
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});

app.post('/comprar-ticket', (req, res) => {
  const { id_usuario, campus, tipo_comida, plano, preco } = req.body;

  if (!id_usuario || !campus || !tipo_comida || !plano || !preco) {
      return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
  }

  // Verificar se o usuário pode comprar o plano subsidiado
  pool.query("SELECT plano FROM usuarios WHERE id_usuario = ?", [id_usuario], (err, results) => {
      if (err) {
          console.error("❌ Erro ao consultar o banco:", err);
          return res.status(500).json({ message: "Erro no servidor" });
      }

      if (results.length === 0) {
          return res.status(404).json({ message: "Usuário não encontrado" });
      }

      const userPlano = results[0].plano.toLowerCase();

      if (plano === "Subsidado" && userPlano !== "subsidado") {
          return res.status(400).json({ message: "Usuário não autorizado a comprar refeição subsidiada" });
      }

      // Salvar diretamente no banco como "Confirmado"
      pool.query(
          "INSERT INTO tickets (id_usuario, campus, tipo_comida, plano, preco, status_pagamento) VALUES (?, ?, ?, ?, ?, ?)",
          [id_usuario, campus, tipo_comida, plano, preco, 'Confirmado'],
          (err) => {
              if (err) {
                  console.error("❌ Erro ao registrar ticket:", err);
                  return res.status(500).json({ message: "Erro ao registrar ticket" });
              }

              res.json({ message: "✅ Ticket registrado com sucesso!", success: true });
          }
      );
  });
});


