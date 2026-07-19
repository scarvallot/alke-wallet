/*
Creacion de BD ALkeWallet
 */
CREATE DATABASE IF NOT EXISTS AlkeWallet;

USE AlkeWallet;

/*
Creacion de Entidades de BD AlkeWallet
 */
-- Tabla Usuario
CREATE TABLE IF NOT EXISTS users (
    user_id INT PRIMARY KEY UNIQUE,
    name VARCHAR(50),
    email VARCHAR(50),
    password VARCHAR(50),
    balance INT(10)
);

-- Tabla Moneda
CREATE TABLE IF NOT EXISTS currency (
    currency_id INT,
    currency_name VARCHAR(50),
    currency_symbol CHAR(1)
);

-- Tabla Transaccion
CREATE TABLE IF NOT EXISTS transactions (
    transaction_id INT PRIMARY KEY,
    sender_user_id INT,
    receiver_user_id INT,
    importe INT,
    trasaction_date DATE,
    CONSTRAINT fk_sender_transaction FOREIGN KEY (sender_user_id)
        REFERENCES users (user_id),
    CONSTRAINT fk_receiver_transaction FOREIGN KEY (receiver_user_id)
        REFERENCES users (user_id)
)  ENGINE=INNODB;
    
SHOW DATABASES;
SHOW TABLES;
DESCRIBE transactions;
DESCRIBE users;
DESCRIBE currency;