# Documentação do Banco de Dados

## 1. Ferramenta Utilizada

**Ferramenta Escolhida:** MySQL Workbench

### Justificativa:
- **Facilidade de Uso:** Interface gráfica intuitiva para modelagem e manipulação do banco de dados.
- **Recursos Disponíveis:** Suporte para criação de diagramas MER, execução de scripts SQL e gerenciamento de bancos de dados.
- **Compatibilidade:** Totalmente compatível com o MySQL, o banco de dados utilizado no projeto.
- **Familiaridade:** Ferramenta amplamente utilizada e conhecida na comunidade de desenvolvimento.

---

## 2. Modelo Entidade-Relacionamento (MER)

### Entidades e Atributos:
- **usuarios**: Armazena informações dos usuários.
  - `id_usuario` (PK)
  - `nome`
  - `matricula`
  - `plano`
- **compras**: Registra as compras realizadas.
  - `id` (PK)
  - `user_id` (FK referencia `usuarios.id_usuario`)
  - `tipo_comida`
  - `campus`
  - `valor`
  - `status`
  - `created_at`
- **tickets**: Armazena os tickets gerados.
  - `id` (PK)
  - `id_usuario` (FK referencia `usuarios.id_usuario`)
  - `campus`
  - `tipo_comida`
  - `plano`
  - `preco`
  - `data_compra`

### Relacionamentos:
- Um **usuário** pode realizar **várias compras** (1:N).
- Um **usuário** pode gerar **vários tickets** (1:N).

---

## 3. Modelo Relacional

### Estrutura das Tabelas:
```sql
CREATE TABLE usuarios (
  id_usuario INT PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  matricula VARCHAR(20) NOT NULL UNIQUE,
  plano VARCHAR(50) NOT NULL DEFAULT 'Subsidiado'
);

CREATE TABLE compras (
  id INT PRIMARY KEY,
  user_id INT,
  tipo_comida VARCHAR(50) NOT NULL,
  campus VARCHAR(50) NOT NULL,
  valor DECIMAL(10,2) NOT NULL,
  status VARCHAR(20) DEFAULT 'pendente',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES usuarios(id_usuario)
);

CREATE TABLE tickets (
  id INT PRIMARY KEY,
  id_usuario INT,
  campus VARCHAR(50) NOT NULL,
  tipo_comida VARCHAR(50) NOT NULL,
  plano VARCHAR(50) NOT NULL,
  preco DECIMAL(10,2) NOT NULL,
  data_compra TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario)
);
```

---

## 4. Scripts SQL (DDL e DML)

### Exemplo de Manipulação de Dados (DML):

**Atualização de Status:**
```sql
UPDATE compras
SET status = 'concluído'
WHERE id = 2;
```

**Exclusão de Registro:**
```sql
DELETE FROM compras
WHERE id = 4;
```

**Consulta de Dados:**
```sql
SELECT * FROM compras
WHERE status = 'concluído';
```

---

## 5. Scripts SQL com Operadores Especiais

**LIKE:** Buscar nomes que comecem com "Jo".
```sql
SELECT * FROM usuarios
WHERE nome LIKE 'Jo%';
```

**BETWEEN:** Filtrar compras entre valores.
```sql
SELECT * FROM compras
WHERE valor BETWEEN 4.00 AND 6.00;
```

**IN:** Filtrar usuários por matrícula.
```sql
SELECT * FROM usuarios
WHERE matricula IN ('123456', '654321', '789456');
```

---

## 6. Funções SQL

**Funções de Agregação:**
```sql
SELECT SUM(valor) AS total_gasto FROM compras;
```

**Funções de Agrupamento:**
```sql
SELECT status, COUNT(*) AS total_compras
FROM compras
GROUP BY status;
```

**Ordenação:**
```sql
SELECT * FROM usuarios
ORDER BY nome ASC;
```

---

## 7. Joins entre Tabelas

**INNER JOIN:** Combina compras com usuários.
```sql
SELECT c.id, u.nome, c.tipo_comida, c.valor, c.status
FROM compras c
INNER JOIN usuarios u ON c.user_id = u.id_usuario;
```

**LEFT JOIN:** Retorna todos os usuários e suas compras (se existirem).
```sql
SELECT u.nome, c.tipo_comida, c.valor, c.status
FROM usuarios u
LEFT JOIN compras c ON u.id_usuario = c.user_id;
```

---

## 8. Verificação de Normalização

- **1ª Forma Normal (1FN):** Todos os atributos são atômicos.
- **2ª Forma Normal (2FN):** Todos os atributos dependem totalmente das chaves primárias.
- **3ª Forma Normal (3FN):** Não há dependências transitivas.

### Exemplo de Banco **NÃO Normalizado:**
```sql
CREATE TABLE compras_nao_normalizada (
  id INT PRIMARY KEY,
  user_id INT,
  nome_usuario VARCHAR(255), -- Redundância
  tipo_comida VARCHAR(50),
  campus VARCHAR(50),
  valor DECIMAL(10,2),
  status VARCHAR(20)
);
```

### Modelo **Normalizado:**
As tabelas definidas anteriormente seguem as boas práticas de normalização.

---

## Conclusão
O banco de dados foi projetado seguindo as melhores práticas de modelagem e normalização. Todas as tabelas estão na **3ª Forma Normal (3FN)**, garantindo eficiência e eliminação de redundâncias. Os scripts SQL fornecem as operações necessárias para a criação, manipulação e consulta dos dados. Essa documentação detalhada facilita futuras manutenções e melhorias no sistema.

