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


// Testar conexão
pool.getConnection((err, conn) => {
    if (err) {
        console.error('❌ Erro ao conectar ao MySQL:', err.message);
    } else {
        console.log('✅ Conectado ao MySQL!');
        conn.release(); // Libera a conexão de teste
    }
});
module.exports = pool;  // Exportando o pool para uso em outros arquivos
