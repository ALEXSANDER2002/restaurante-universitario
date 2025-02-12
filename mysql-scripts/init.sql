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

-- Definir a codificação para UTF-8


-- Inserir os dados
INSERT INTO usuarios (nome, matricula, plano)
VALUES 
  ('Alexsander Filipi', '202240601001', 'Subsidiado'),
  ('Carlos Eduardo', '202240601004', 'Subsidiado'),
  ('Deivid Silva', '202340601003', 'Subsidiado'),
  ('Enzo Gabriel', '202340601004', 'Subsidiado'),
  ('Gabriel Martins', '202340601006', 'Subsidiado'),
  ('Gustavo Bastos', '202240601013', 'Subsidiado'),
  ('Helton Pessoa', '202340601007', 'Subsidiado'),
  ('Julio Cesar', '202040601020', 'Subsidiado'),
  ('Julio Cesar', '202340601012', 'Subsidiado'),
  ('Kalleb Araujo', '202240601016', 'Subsidiado'),
  ('Kayo Raphael', '202340601031', 'Subsidiado'),
  ('Leonardo Farias', '202240601018', 'Subsidiado'),
  ('Lincoln Moreno', '202340601013', 'Subsidiado'),
  ('Livia Amaral', '202340601014', 'Subsidiado'),
  ('Luiz Antonio', '202340601033', 'Subsidiado'),
  ('Maria Clara', '202240601020', 'Subsidiado'),
  ('Marina Nogueira', '202140601020', 'Subsidiado'),
  ('Matheus Guimaraes', '202340601017', 'Subsidiado'),
  ('Murilo Mauricio', '202240601022', 'Subsidiado'),
  ('Pedro Arnaldo', '202340601021', 'Subsidiado'),
  ('Tarlhitur da', '202040601034', 'Subsidiado'),
  ('Walison de', '202240601028', 'Subsidiado'),
  ('Wanderson Victor', '202340601024', 'Subsidiado');



  -- Criando a tabela de administradores
CREATE TABLE IF NOT EXISTS restaurante_universitario.admins (
  id INT NOT NULL AUTO_INCREMENT,
  email VARCHAR(255) NOT NULL UNIQUE,
  senha VARCHAR(255) NOT NULL,
  PRIMARY KEY (id)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

-- Inserindo um administrador de exemplo
INSERT INTO admins (email, senha) VALUES ('admin@exemplo.com', '123456');

-- Inserção de Dados na Tabela de Compras
INSERT INTO compras (user_id, tipo_comida, campus, valor, status)
VALUES
  (1, 'Almoço', 'Campus A', 5.00, 'concluído'),
  (2, 'Jantar', 'Campus B', 7.50, 'pendente'),
  (3, 'Almoço', 'Campus A', 5.00, 'concluído'),
  (4, 'Café da Manhã', 'Campus C', 3.00, 'pendente');

-- Inserção de Dados na Tabela de Tickets
INSERT INTO tickets (id_usuario, campus, tipo_comida, plano, preco)
VALUES
  (1, 'Campus A', 'Almoço', 'Subsidiado', 5.00),
  (2, 'Campus B', 'Jantar', 'Comum', 7.50),
  (3, 'Campus A', 'Almoço', 'Subsidiado', 5.00),
  (4, 'Campus C', 'Café da Manhã', 'Comum', 3.00);

-- Exemplos de Consultas com Operadores Especiais

-- LIKE (Pesquisas Parciais)
SELECT * FROM usuarios
WHERE nome LIKE 'Jo%';

-- BETWEEN (Intervalos de Valores)
SELECT * FROM compras
WHERE valor BETWEEN 4.00 AND 6.00;

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