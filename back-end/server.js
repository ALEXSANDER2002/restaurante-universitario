//importa os módulos necessários
const express = require("express"); //o express é um framework para criar servidores HTTP
const jwt = require("jsonwebtoken"); //o jwt sera o responsável por gerar o token de autenticação
const bcrypt = require("bcryptjs"); //o bcrypt é um módulo para criptografar senhas
const bodyParser = require("body-parser"); //o body-parser é um módulo 
// para converter o corpo da requisição em JSON
const mysql = require("mysql2/promise"); //o mysql2 é um módulo para conectar com o banco de dados MySQL
const cors = require("cors"); //para o front-end conseguir acessar o back-end

// Cria o servidor
const app = express();
app.use(bodyParser.json());
app.use(cors());

// Variáveis de ambiente
const SECRET_KEY = process.env.SECRET_KEY || "fazol"; //chave secreta para gerar o token
const DB_HOST = process.env.DB_HOST || "db";  //host do banco de dados no docker
const DB_USER = process.env.DB_USER || "root";
const DB_PASSWORD = process.env.DB_PASSWORD || "";
const DB_NAME = process.env.DB_NAME || "app_database";

// Conexão com o banco de dados
const db = mysql.createPool({
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
});


// Rota para registro de usuários
app.post("/register", async (req, res) => {
    //pega o username e a senha do corpo da requisição q esta no front-end
  const { username, password } = req.body;

  //se o username ou a senha estiverem vazios, retorna um erro
  if (!username || !password) {
    return res.status(400).send({ message: "Sem o user e senha eu faço o q patrão?" });
  }

    //verifica se o username já existe no banco de dados 
  const hashedPassword = await bcrypt.hash(password, 10);
  await db.query("INSERT INTO users (username, password) VALUES (?, ?)", [username, hashedPassword]);

  res.status(201).send({ message: "Usuário registrado com sucesso!" });
});


// Rota para login

//essa rota recebe o username e a senha do corpo da requisição assim como a rota de registro
app.post("/login", async (req, res) => {
  const { username, password } = req.body;

    //se o username ou a senha estiverem vazios, retorna um erro
  const [rows] = await db.query("SELECT * FROM users WHERE username = ?", [username]);
  //se o username não existir no banco de dados, retorna um erro
  if (rows.length === 0) {
    return res.status(404).send({ message: "Usuário não encontrado." });
  }

  const user = rows[0];
  //compara a senha do banco de dados com a senha que o usuário digitou
  const isPasswordValid = await bcrypt.compare(password, user.password);
  //se a senha estiver incorreta, retorna um erro
  if (!isPasswordValid) {
    return res.status(401).send({ message: "Senha incorreta." });
  }
  //se a senha estiver correta, gera o token de autenticação que expira em 30 minutos
  const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: "30min" });
  //retorna o token
  res.send({ token });
});


// Rota protegida

//essa rota é protegida, ou seja, só pode ser acessada se o usuário estiver autenticado
app.get("/protected", (req, res) => {
    //pega o token do cabeçalho da requisição
  const token = req.headers["authorization"];
  //se o token estiver vazio, retorna um erro
  if (!token) {
    return res.status(401).send({ message: "Token ausente." });
  }
  //se o token estiver presente, verifica se ele é válido
  try {
    const decoded = jwt.verify(token.split(" ")[1], SECRET_KEY); // Remove "Bearer "
    //se o token for válido, retorna uma mensagem de boas-vindas
    res.send({ message: `TO COM FOME QUERO MERENDAR, ${decoded.username} canalha!` }); //
  } catch (err) {
    res.status(401).send({ message: "Token inválido." }); //se o token for inválido, retorna um erro
  }
});

// Inicia o servidor
app.listen(3000, () => console.log("Servidor rodando na porta 3000"));
