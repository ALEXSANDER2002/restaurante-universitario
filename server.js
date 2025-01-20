const express = require('express');
const mysql = require('mysql2');
const jwt = require('jsonwebtoken');
const path = require('path');

// Configuração do servidor e banco de dados
const app = express();
const port = 3000;

app.use(express.json()); 

// Servir arquivos estáticos (CSS, JS, imagens, etc)
app.use(express.static(path.join(__dirname, 'R.U')));  
app.use(express.static('ESTILOS'));

// Conexão com o banco de dados MySQL
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'admin',
  database: 'login'
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

  const query = 'INSERT INTO usuario (email, password) VALUES (?, ?)';
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
  const { email, password } = req.body;

  connection.query('SELECT * FROM usuario WHERE email = ?', [email], (err, results) => {
    if (err) {
      console.error('Erro ao consultar o banco:', err);
      return res.status(500).send('Erro no servidor');
    }

    if (results.length === 0) {
      return res.status(400).send({ message: 'Usuário não encontrado' });
    }

    const user = results[0];

    if (password !== user.password) {
      return res.status(400).send({ message: 'Senha incorreta' });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, 'secretrandomkey', {
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