const express = require('express');
const path = require('path');
const cors = require('cors');
const cron = require("node-cron");
const routes = require('./src/routes');
const Compra = require('./src/models/Compra');
const comprasRoutes = require('./src/routes/compraRoutes'); 
const paginasRoutes = require('./src/routes/paginasRoutes');

// Importar o Swagger
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

class Server {
    constructor() {
        this.app = express();
        this.port = process.env.PORT || 3000;
        this.middlewares();
        this.routes();
        this.cronJobs();
        this.swaggerDocs();
    }

    middlewares() {
        this.app.use(express.json());
        this.app.use(cors());
        this.app.use(express.static(path.join(__dirname, 'src')));
        this.app.use(express.static(path.join(__dirname, 'views')));
        this.app.use(express.static('public'));
    }
    routes() {
        // Registra as demais rotas
        this.app.use(routes);
        this.app.use(comprasRoutes);
        this.app.use(paginasRoutes);
    
        // Middleware catch-all para rotas não encontradas (404)
        this.app.use((req, res, next) => {
            // Se a requisição for para /api-docs, prossiga normalmente
            if (req.path.startsWith('/api-docs')) {
                return next();
            }
            res.redirect('/404');
        });
    }
    
    

    cronJobs() {
        cron.schedule("0 0 * * *", Compra.limparCompras);
    }
    

    // Função para configurar o Swagger
    swaggerDocs() {
        const swaggerOptions = {
            definition: {
                openapi: '3.0.0',
                info: {
                    title: 'Minha API',
                    version: '1.0.0',
                    description: 'Documentação da API com Swagger',
                },
            },
            apis: ['./src/routes/*.js'], // Caminho para os arquivos de rotas que você quer documentar
        };

        const swaggerDocs = swaggerJsdoc(swaggerOptions);
        this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
    }

    start() {
        this.app.listen(this.port, () => {
            console.log(`✅ Servidor rodando na porta ${this.port}`);
        });
    }
}


module.exports = new Server().app;
new Server().start();
