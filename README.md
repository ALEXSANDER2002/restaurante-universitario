Documentação do Banco de Dados
1. Ferramenta Utilizada
Ferramenta Escolhida: MySQL Workbench.

Justificativa:

Facilidade de Uso: O MySQL Workbench possui uma interface gráfica intuitiva, facilitando a modelagem e manipulação do banco de dados.

Recursos Disponíveis: Oferece ferramentas para criação de diagramas MER, execução de scripts SQL e gerenciamento de bancos de dados.

Compatibilidade: É totalmente compatível com o MySQL, o banco de dados utilizado no projeto.

Familiaridade: É uma ferramenta amplamente utilizada e conhecida na comunidade de desenvolvimento.

2. Modelo Entidade-Relacionamento (MER)
Descrição do MER:

Entidades:

usuarios: Armazena informações dos usuários do restaurante universitário.

compras: Registra as compras realizadas pelos usuários.

tickets: Armazena os tickets gerados para cada compra.

Atributos:

usuarios: id_usuario, nome, matricula, plano.

compras: id, user_id, tipo_comida, campus, valor, status, created_at.

tickets: id, id_usuario, campus, tipo_comida, plano, preco, data_compra.

Relacionamentos:

Um usuário pode realizar várias compras (1:N ).

Um usuário pode gerar vários tickets (1:N ).

Cardinalidades:

usuarios → compras: 1:N .

usuarios → tickets: 1:N .

Chaves Primárias (PK):

usuarios: id_usuario.

compras: id.

tickets: id.

Chaves Estrangeiras (FK):

compras: user_id referencia usuarios(id_usuario).

tickets: id_usuario referencia usuarios(id_usuario).

Ferramenta Visual: O diagrama MER foi criado utilizando o MySQL Workbench. Abaixo está uma descrição textual do diagrama:

Copy
+----------------+          +----------------+          +----------------+
|    usuarios    |          |    compras     |          |    tickets     |
+----------------+          +----------------+          +----------------+
| id_usuario (PK)|<-------->| user_id (FK)   |          | id_usuario (FK)|
| nome           |          | id (PK)        |          | id (PK)        |
| matricula      |          | tipo_comida    |          | campus         |
| plano          |          | campus         |          | tipo_comida    |
+----------------+          | valor          |          | plano          |
                            | status         |          | preco          |
                            | created_at     |          | data_compra    |
                            +----------------+          +----------------+
3. Modelo Relacional
Tabelas e Atributos:

usuarios:

id_usuario (INT, PK)

nome (VARCHAR(255), NOT NULL)

matricula (VARCHAR(20), NOT NULL, UNIQUE)

plano (VARCHAR(50), NOT NULL, DEFAULT 'Subsidiado')

compras:

id (INT, PK)

user_id (INT, FK)

tipo_comida (VARCHAR(50), NOT NULL)

campus (VARCHAR(50), NOT NULL)

valor (DECIMAL(10,2), NOT NULL)

status (VARCHAR(20), DEFAULT 'pendente')

created_at (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP)

tickets:

id (INT, PK)

id_usuario (INT, FK)

campus (VARCHAR(50), NOT NULL)

tipo_comida (VARCHAR(50), NOT NULL)

plano (VARCHAR(50), NOT NULL)

preco (DECIMAL(10,2), NOT NULL)

data_compra (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP)

Restrições:

PK: Chave primária em todas as tabelas.

FK: Chaves estrangeiras para relacionar as tabelas.

UNIQUE: A matrícula do usuário é única.

NOT NULL: Atributos obrigatórios.

DEFAULT: Valores padrão para status e created_at.

4. Scripts SQL (DDL e DML)
DDL (Data Definition Language):

Criação das tabelas usuarios, compras e tickets (conforme código completo).

Definição de chaves primárias, estrangeiras e restrições.

DML (Data Manipulation Language):

Inserção de dados nas tabelas (exemplos fornecidos no código).

Atualização de dados:

sql
Copy
UPDATE compras
SET status = 'concluído'
WHERE id = 2;
Exclusão de dados:

sql
Copy
DELETE FROM compras
WHERE id = 4;
Consulta de dados:

sql
Copy
SELECT * FROM compras
WHERE status = 'concluído';
5. Scripts SQL com Operadores Especiais
LIKE:

sql
Copy
SELECT * FROM usuarios
WHERE nome LIKE 'Jo%';
BETWEEN:

sql
Copy
SELECT * FROM compras
WHERE valor BETWEEN 4.00 AND 6.00;
IN:

sql
Copy
SELECT * FROM usuarios
WHERE matricula IN ('123456', '654321', '789456');
6. Funções SQL
Funções de Agregação:

sql
Copy
SELECT SUM(valor) AS total_gasto FROM compras;
Funções de Agrupamento:

sql
Copy
SELECT status, COUNT(*) AS total_compras
FROM compras
GROUP BY status;
Funções de Ordenação:

sql
Copy
SELECT * FROM usuarios
ORDER BY nome ASC;
7. Joins entre Tabelas
INNER JOIN:

sql
Copy
SELECT c.id, u.nome, c.tipo_comida, c.valor, c.status
FROM compras c
INNER JOIN usuarios u ON c.user_id = u.id_usuario;
LEFT JOIN:

sql
Copy
SELECT u.nome, c.tipo_comida, c.valor, c.status
FROM usuarios u
LEFT JOIN compras c ON u.id_usuario = c.user_id;
8. Verificação de Normalização
1ª Forma Normal (1FN): Todas as tabelas estão na 1FN, pois os atributos são atômicos.

2ª Forma Normal (2FN): Todas as tabelas estão na 2FN, pois os atributos dependem totalmente das chaves primárias.

3ª Forma Normal (3FN): Todas as tabelas estão na 3FN, pois não há dependências transitivas.

Cenário SEM Normalização:

sql
Copy
CREATE TABLE compras_nao_normalizada (
  id INT PRIMARY KEY,
  user_id INT,
  nome_usuario VARCHAR(255), -- Redundância
  tipo_comida VARCHAR(50),
  campus VARCHAR(50),
  valor DECIMAL(10,2),
  status VARCHAR(20)
);
Cenário COM Normalização: As tabelas originais já estão normalizadas.

Conclusão
O banco de dados foi projetado seguindo as melhores práticas de modelagem e normalização. Todas as tabelas estão na 3ª Forma Normal, e os scripts SQL atendem aos requisitos de criação, manipulação e consulta de dados. A documentação descreve detalhadamente cada etapa do processo, garantindo clareza e facilitando futuras manutenções.
