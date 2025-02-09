const express = require('express');
const path = require('path');
const cors = require('cors');
const cron = require("node-cron");
const routes = require('./src/routes');
const Compra = require('./src/models/Compra');


class Server {
    constructor() {
        this.app = express();
        this.port = process.env.PORT || 3000;
        this.middlewares();
        this.routes();
        this.cronJobs();
    }

    middlewares() {
        this.app.use(express.json());
        this.app.use(cors());
        this.app.use(express.static(path.join(__dirname, 'public')));
        this.app.use(express.static(path.join(__dirname, 'views')));
        this.app.use(express.static('ESTILOS'));
    }

    routes() {
        this.app.use(routes);
    }

    cronJobs() {
        cron.schedule("0 0 * * *", Compra.limparCompras);
    }

    start() {
        this.app.listen(this.port, () => {
            console.log(`✅ Servidor rodando na porta ${this.port}`);
        });
    }
}

module.exports = new Server().app;
new Server().start();
