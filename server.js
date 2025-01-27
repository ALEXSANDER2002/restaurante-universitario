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
  const { matricula, password } = req.body;

  connection.query('SELECT * FROM usuario WHERE matricula = ?', [matricula], (err, results) => {
    if (err) {
      console.error('Erro ao consultar o banco:', err);
      return res.status(500).send('Erro no servidor');
    }

    if (results.length === 0) {
      return res.status(400).send({ message: 'Usuário não encontrado' });
    }

    const user = results[0];

    // Verifica se o usuário tem o plano subsidiado
    if (user.plano !== 'Subsidado') {
      return res.status(400).send({ message: 'Usuário não autorizado a realizar compras subsidiadas' });
    }

    if (password !== user.password) {
      return res.status(400).send({ message: 'Senha incorreta' });
    }

    const token = jwt.sign({ id: user.id, matricula: user.matricula, email: user.email }, 'secretrandomkey', {
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


http://localhost:5000/compracerta?collection_id=100105355743&collection_status=approved&
// payment_id=100105355743&
// status=approved&
// external_reference=null&
// payment_type=account_money&merchant_order_id=27724550216&
// preference_id=2231764145-0645c8ba-bd2a-46c5-a4f3-dd0640f70df8&site_id=MLB&
// processing_mode=aggregator&
// merchant_account_id=null