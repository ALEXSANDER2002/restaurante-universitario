// Importando os módulos necessários para a criação do servidor
const express = require('express');  // Framework para criação do servidor web
const path = require('path');  // Utilitário para manipulação de caminhos de arquivos
const cors = require('cors');  // Middleware para habilitar CORS (Cross-Origin Resource Sharing)
const cron = require("node-cron");  // Biblioteca para agendamento de tarefas
const routes = require('./src/routes');  // Importando as rotas principais
const Compra = require('./src/models/Compra');  // Importando o model de Compra para manipulação de dados
const comprasRoutes = require('./src/routes/compraRoutes');  // Importando as rotas de compras
const paginasRoutes = require('./src/routes/paginasRoutes');  // Importando as rotas de páginas

// Importando as ferramentas para a documentação da API (Swagger)
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

class Server {
    constructor() {
        // Instância do express para criar o servidor
        this.app = express();
        // Definindo a porta do servidor, podendo ser a porta configurada ou 3000 por padrão
        this.port = process.env.PORT || 3000;
        
        // Configurações de middlewares, rotas, tarefas cron e documentação Swagger
        this.middlewares();
        this.routes();
        this.cronJobs();
        this.swaggerDocs();
    }

    // Configurações dos middlewares
    middlewares() {
        // Middleware para permitir requisições com corpo em JSON
        this.app.use(express.json());
        // Middleware para habilitar CORS (permite que o frontend faça requisições ao backend)
        this.app.use(cors());
        // Middleware para servir arquivos estáticos da pasta 'src', 'views' e 'public'
        this.app.use(express.static(path.join(__dirname, 'src')));
        this.app.use(express.static(path.join(__dirname, 'views')));
        this.app.use(express.static('public'));
    }

    // Registra todas as rotas da aplicação
    routes() {
        // Registra as rotas gerais da aplicação, compras e páginas
        this.app.use(routes);
        this.app.use(comprasRoutes);
        this.app.use(paginasRoutes);
    
        // Middleware catch-all para tratar rotas não encontradas (erro 404)
        this.app.use((req, res, next) => {
            // Se a requisição for para a documentação Swagger (/api-docs), prossegue normalmente
            if (req.path.startsWith('/api-docs')) {
                return next();
            }
            // Redireciona qualquer outra requisição não encontrada para a página 404
            res.redirect('/404');
        });
    }
    
    // Configuração de tarefas agendadas com cron ....
    cronJobs() {
        // Tarefa cron para rodar todos os dias à meia-noite, executando a limpeza de compras antigas
        cron.schedule("0 0 * * *", Compra.limparCompras);
    }

    // Função para configurar o Swagger (documentação da API)
    swaggerDocs() {
        // Opções de configuração do Swagger
        const swaggerOptions = {
            definition: {
                openapi: '3.0.0',  // Definindo a versão do OpenAPI
                info: {
                    title: ' API dos Miseraveis',  // Título da API
                    version: '1.0.0',  // Versão da API
                    description: 'Documentação da API com Swagger',  // Descrição da API
                },
            },
            apis: ['./src/routes/*.js'],  // Caminho para os arquivos de rotas que serão documentados
        };

        // Gerando a documentação com o swaggerJsdoc
        const swaggerDocs = swaggerJsdoc(swaggerOptions);
        // Configurando o endpoint '/api-docs' para servir a documentação da API
        this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
    }

    // Função para iniciar o servidor
    start() {
        // Inicia o servidor e escuta a porta configurada
        this.app.listen(this.port, () => {
            console.log(`✅ Servidor rodando na porta ${this.port}`);  // Exibe no console que o servidor está rodando
        });
    }
}

// Exportando a instância do servidor
module.exports = new Server().app;
// Iniciando o servidor
new Server().start();
