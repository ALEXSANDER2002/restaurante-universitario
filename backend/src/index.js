const express = require('express');
const mysql = require('mysql2');
const cors = require('cors'); // Importar a biblioteca cors

const app = express();
const port = 3000;

// Middleware para parsear o corpo das requisições como JSON
app.use(express.json());

// Configurar CORS para permitir requisições do frontend
app.use(cors({
  origin: 'http://localhost', // Permitir requisições somente do frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Permitir os métodos GET, POST, PUT, DELETE
}));

// Conectar ao banco de dados MySQL
const connection = mysql.createConnection({
  host: 'mysql', // Nome do serviço no Docker Compose
  user: 'root',
  password: 'password',
  database: 'restaurante',
});

connection.connect((err) => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados:', err);
    return;
  }
  console.log('Conectado ao banco de dados!');
});

// Criar tabela 'usuarios' se ela não existir
const criarTabelaUsuarios = `
  CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE
  )
`;

connection.query(criarTabelaUsuarios, (err) => {
  if (err) {
    console.error('Erro ao criar a tabela usuarios:', err);
  } else {
    console.log('Tabela usuarios criada ou já existe.');
  }
});

// Rota principal
app.get('/', (req, res) => {
  res.send('Bem-vindo ao Restaurante Universitário!');
});

// Rota para criação de usuário (POST)
app.post('/usuarios', (req, res) => {
  const { nome, email } = req.body; // Receber dados do cliente

  // Verifique se o nome e o email estão presentes no corpo da requisição
  if (!nome || !email) {
    return res.status(400).json({ error: 'Nome e email são obrigatórios.', body: req.body });
  }

  const query = 'INSERT INTO usuarios (nome, email) VALUES (?, ?)';

  connection.query(query, [nome, email], (err, results) => {
    if (err) {
      console.error('Erro ao criar usuário:', err);
      res.status(500).json({ error: 'Erro ao criar usuário' });
      return;
    }
    res.status(201).json({ message: 'Usuário criado com sucesso!', id: results.insertId });
  });
});

// Rota para listar usuários (GET)
app.get('/usuarios', (req, res) => {
  const query = 'SELECT * FROM usuarios';

  connection.query(query, (err, results) => {
    if (err) {
      console.error('Erro ao buscar usuários:', err);
      res.status(500).json({ error: 'Erro ao buscar usuários' });
      return;
    }
    res.json(results);
  });
});

// Rota para atualizar usuário (PUT)
// Rota para atualizar usuário (PUT)
app.put('/usuarios/:id', (req, res) => {
  const { id } = req.params;
  const { nome, email } = req.body;

  // Verifique se o nome e o email estão presentes no corpo da requisição
  console.log('Corpo da requisição:', req.body); // Adicionei o log para verificar os dados recebidos

  if (!nome || !email) {
    return res.status(400).json({ error: 'Nome e email são obrigatórios.', body: req.body });
  }

  // Query para atualizar o usuário no banco de dados
  const query = 'UPDATE usuarios SET nome = ?, email = ? WHERE id = ?';

  connection.query(query, [nome, email, id], (err, results) => {
    if (err) {
      console.error('Erro ao atualizar usuário:', err); // Log do erro
      return res.status(500).json({ error: 'Erro ao atualizar usuário' });
    }

    // Verificar se o usuário foi encontrado e atualizado
    if (results.affectedRows === 0) {
      console.log('Nenhum usuário encontrado para atualizar.');
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    // Se a atualização for bem-sucedida
    res.json({ message: 'Usuário atualizado com sucesso!' });
  });
});

// Rota para excluir usuário (DELETE)
app.delete('/usuarios/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM usuarios WHERE id = ?';

  connection.query(query, [id], (err, results) => {
    if (err) {
      console.error('Erro ao excluir usuário:', err);
      res.status(500).json({ error: 'Erro ao excluir usuário' });
      return;
    }
    if (results.affectedRows === 0) {
      res.status(404).json({ error: 'Usuário não encontrado' });
      return;
    }
    res.json({ message: 'Usuário excluído com sucesso!' });
  });
});

// Iniciar o servidor
app.listen(port, () => {
  console.log(`Servidor backend rodando na porta ${port}`);
});
