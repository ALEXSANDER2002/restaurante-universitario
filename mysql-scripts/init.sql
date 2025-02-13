-- Criação do Schema e Tabelas
CREATE SCHEMA IF NOT EXISTS restaurante_universitario;
USE restaurante_universitario;

-- Tabela de Usuários
CREATE TABLE IF NOT EXISTS usuarios (
  id_usuario INT NOT NULL AUTO_INCREMENT,
  nome VARCHAR(255) NOT NULL,
  matricula VARCHAR(20) NOT NULL,
  plano VARCHAR(50) NOT NULL DEFAULT 'Subsidiado',
  PRIMARY KEY (id_usuario),
  UNIQUE INDEX matricula (matricula ASC)
);

-- Tabela de Compras
CREATE TABLE IF NOT EXISTS compras (
  id INT NOT NULL AUTO_INCREMENT,
  user_id INT NOT NULL,
  tipo_comida VARCHAR(50) NOT NULL,
  campus VARCHAR(50) NOT NULL,
  valor DECIMAL(10,2) NOT NULL,
  status VARCHAR(20) NULL DEFAULT 'pendente',
  created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  FOREIGN KEY (user_id) REFERENCES usuarios(id_usuario)
);

-- Tabela de Tickets
CREATE TABLE IF NOT EXISTS tickets (
  id INT NOT NULL AUTO_INCREMENT,
  id_usuario INT NOT NULL,
  campus VARCHAR(50) NOT NULL,
  tipo_comida VARCHAR(50) NOT NULL,
  plano VARCHAR(50) NOT NULL,
  preco DECIMAL(10,2) NOT NULL,
  data_compra TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario)
);

-- Inserção de Dados na Tabela de Usuários
INSERT INTO usuarios (nome, matricula, plano)
VALUES 
  ('João Silva', '123456', 'Subsidiado'),
  ('Maria Oliveira', '654321', 'Comum'),
  ('Pedro Santos', '789456', 'Subsidiado'),
  ('Ana Costa', '147258', 'Comum'),
  ('Carlos Souza', '258369', 'Subsidiado'),
  ('Fernanda Lima', '369258', 'Comum'),
  ('Lucas Pereira', '456123', 'Subsidiado'),
  ('Juliana Almeida', '987654', 'Comum'),
  ('Eduardo Martins', '321654', 'Subsidiado'),
  ('Camila Rocha', '741852', 'Comum');

-- Inserção de Dados na Tabela de Compras
INSERT INTO compras (user_id, tipo_comida, campus, valor, status)
VALUES
  (1, 'Almoço', 'Campus 3', 2.00, 'concluído'),
  (2, 'Jantar', 'Campus 2', 13.00, 'pendente'),
  (3, 'Almoço', 'Campus 1', 2.00, 'concluído'),
  (4, 'Jantar', 'Campus 2', 13.00, 'pendente');

-- Inserção de Dados na Tabela de Tickets
INSERT INTO tickets (id_usuario, campus, tipo_comida, plano, preco)
VALUES
  (1, 'Campus 3', 'Almoço', 'Subsidiado', 2.00),
  (2, 'Campus 2', 'Jantar', 'Não Subsidiado', 13.00),
  (3, 'Campus 1', 'Almoço', 'Subsidiado', 2.00),
  (4, 'Campus 2', 'Jantar', 'Não Subsidiado', 13.00);

-- Exemplos de Consultas com Operadores Especiais

-- LIKE (Pesquisas Parciais)
SELECT * FROM usuarios
WHERE nome LIKE 'Jo%';

-- BETWEEN (Intervalos de Valores)
SELECT * FROM compras
WHERE valor BETWEEN 3.00 AND 6.00;

-- IN (Verificar Valores Dentro de um Conjunto)
SELECT * FROM usuarios
WHERE matricula IN ('123456', '654321', '789456');

-- Funções de Agregação
SELECT SUM(valor) AS total_gasto FROM compras;

-- Funções de Agrupamento
SELECT status, COUNT(*) AS total_compras
FROM compras
GROUP BY status;

-- Funções de Ordenação
SELECT * FROM usuarios
ORDER BY nome ASC;

-- Joins entre Tabelas

-- INNER JOIN
SELECT c.id, u.nome, c.tipo_comida, c.valor, c.status
FROM compras c
INNER JOIN usuarios u ON c.user_id = u.id_usuario;

-- LEFT JOIN
SELECT u.nome, c.tipo_comida, c.valor, c.status
FROM usuarios u
LEFT JOIN compras c ON u.id_usuario = c.user_id;

-- Atualização de Dados
UPDATE compras
SET status = 'concluído'
WHERE id = 2;

-- Exclusão de Dados
DELETE FROM compras
WHERE id = 4;

-- Verificação de Normalização

-- Cenário SEM Normalização
CREATE TABLE compras_nao_normalizada (
  id INT PRIMARY KEY,
  user_id INT,
  nome_usuario VARCHAR(255), -- Redundância
  tipo_comida VARCHAR(50),
  campus VARCHAR(50),
  valor DECIMAL(10,2),
  status VARCHAR(20)
);

-- Cenário COM Normalização
-- As tabelas originais já estão normalizadas (1FN, 2FN e 3FN).