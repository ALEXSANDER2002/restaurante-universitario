CREATE TABLE users (
    id_user INT AUTO_INCREMENT PRIMARY KEY, -- ID do usuário (autoincrementado)
    cpf CHAR(11) ,       -- CPF como chave primária (11 caracteres)
    username VARCHAR(50) NOT NULL, -- Nome de usuário (máx. 50 caracteres)
    password VARCHAR(255) NOT NULL -- Senha (armazenada como hash, máx. 255 caracteres)
);
