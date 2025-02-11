// noinspection JSVoidFunctionReturnValueUsed

const mysql = require('mysql2/promise');

// Criando o pool com mysql2/promise
const pool = mysql.createPool({
    host: 'db',
    user: 'root',
    password: 'admin',
    database: 'restaurante_universitario',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});



// Testar a conexão usando async/await
(async () => {
    try {
        const connection = await pool.getConnection();
        console.log('✅ Conectado ao MySQL!');
        connection.release(); // Libera a conexão
    } catch (err) {
        console.error('❌ Erro ao conectar ao MySQL:', err.message);
    }
})();
module.exports = pool;  // Exportando o pool para uso em outros arquivos
