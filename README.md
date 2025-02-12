# Restaurante Universitário - Banco de Dados

Este repositório contém a estrutura do banco de dados para o **Restaurante Universitário**. O banco de dados gerencia usuários, compras e tickets de refeições nos campi.

## 📌 Tecnologias Utilizadas

- **MySQL**
- **InnoDB Engine**
- **UTF-8 Encoding**

## 📂 Estrutura do Banco de Dados

O banco de dados segue a **Terceira Forma Normal (3FN)** para garantir a integridade dos dados e evitar redundâncias.

### 📌 Criação do Schema

```sql
CREATE SCHEMA IF NOT EXISTS restaurante_universitario;
USE restaurante_universitario;
```

### 📌 Tabelas

#### 🧑‍🎓 Tabela `usuarios`
Armazena informações dos usuários do restaurante universitário.

```sql
CREATE TABLE IF NOT EXISTS usuarios (
  id_usuario INT NOT NULL AUTO_INCREMENT,
  nome VARCHAR(255) NOT NULL,
  matricula VARCHAR(20) NOT NULL,
  plano VARCHAR(50) NOT NULL DEFAULT 'Subsidiado',
  PRIMARY KEY (id_usuario),
  UNIQUE INDEX matricula (matricula ASC)
);
```

**Colunas:**
| Coluna      | Tipo           | Descrição |
|------------|--------------|------------|
| `id_usuario` | INT (PK) | Identificador único do usuário |
| `nome` | VARCHAR(255) | Nome do usuário |
| `matricula` | VARCHAR(20) | Número de matrícula (único) |
| `plano` | VARCHAR(50) | Plano de refeição (padrão: 'Subsidiado') |

---

#### 🛒 Tabela `compras`
Registra as compras realizadas pelos usuários.

```sql
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
```

**Colunas:**
| Coluna      | Tipo           | Descrição |
|------------|--------------|------------|
| `id` | INT (PK) | Identificador único da compra |
| `user_id` | INT (FK) | Chave estrangeira referenciando `usuarios.id_usuario` |
| `tipo_comida` | VARCHAR(50) | Tipo de refeição (Vegetariano, Não Vegetariano) |
| `campus` | VARCHAR(50) | Campus onde a compra foi realizada |
| `valor` | DECIMAL(10,2) | Valor pago na compra |
| `status` | VARCHAR(20) | Status da compra (pendente/concluído) |
| `created_at` | TIMESTAMP | Data e hora da compra |

---

#### 🎫 Tabela `tickets`
Registra os tickets adquiridos pelos usuários para o consumo de refeições.

```sql
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
```

**Colunas:**
| Coluna      | Tipo           | Descrição |
|------------|--------------|------------|
| `id` | INT (PK) | Identificador único do ticket |
| `id_usuario` | INT (FK) | Chave estrangeira referenciando `usuarios.id_usuario` |
| `campus` | VARCHAR(50) | Campus onde o ticket foi adquirido |
| `tipo_comida` | VARCHAR(50) | Tipo de refeição vinculada ao ticket |
| `plano` | VARCHAR(50) | Plano de alimentação do usuário |
| `preco` | DECIMAL(10,2) | Preço do ticket |
| `data_compra` | TIMESTAMP | Data de aquisição do ticket |

---

#### 🔐 Tabela `admins`
Tabela para armazenar os administradores do sistema.

```sql
CREATE TABLE IF NOT EXISTS admins (
  id INT NOT NULL AUTO_INCREMENT,
  email VARCHAR(255) NOT NULL UNIQUE,
  senha VARCHAR(255) NOT NULL,
  PRIMARY KEY (id)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;
```

**Colunas:**
| Coluna      | Tipo           | Descrição |
|------------|--------------|------------|
| `id` | INT (PK) | Identificador único do administrador |
| `email` | VARCHAR(255) | E-mail do administrador |
| `senha` | VARCHAR(255) | Senha criptografada do administrador |

---

## 📌 Inserção de Dados de Exemplo

### 🧑‍🎓 Inserindo Usuários
```sql
INSERT INTO usuarios (nome, matricula, plano)
VALUES
  ('Alexsander Filipi', '202240601001', 'Subsidiado'),
  ('Carlos Eduardo', '202240601004', 'Subsidiado');
```

### 🛒 Inserindo Compras
```sql
INSERT INTO compras (user_id, tipo_comida, campus, valor, status)
VALUES
  (1, 'Vegetariano', 'Campus A', 2.00, 'concluído'),
  (2, 'Não Vegetariano', 'Campus B', 13.00, 'pendente');
```

### 🎫 Inserindo Tickets
```sql
INSERT INTO tickets (id_usuario, campus, tipo_comida, plano, preco)
VALUES
  (1, 'Campus A', 'Vegetariano', 'Subsidiado', 2.00);
```

### 🔐 Inserindo Administrador
```sql
INSERT INTO admins (email, senha) VALUES ('admin@exemplo.com', '123456');
```

---

## 📌 Consultas SQL Úteis

### 🔍 Pesquisar Usuários pelo Nome (LIKE)
```sql
SELECT * FROM usuarios WHERE nome LIKE 'Jo%';
```

### 💰 Total Gasto em Compras
```sql
SELECT SUM(valor) AS total_gasto FROM compras;
```

### 📊 Contagem de Compras por Status
```sql
SELECT status, COUNT(*) AS total_compras FROM compras GROUP BY status;
```

### 🔗 INNER JOIN: Compras com Usuários
```sql
SELECT c.id, u.nome, c.tipo_comida, c.valor, c.status
FROM compras c
INNER JOIN usuarios u ON c.user_id = u.id_usuario;
```

---

## 📌 Contribuição
Sinta-se à vontade para contribuir com melhorias, sugestões e otimizações!



