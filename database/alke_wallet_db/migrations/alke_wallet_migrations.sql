--- =====================================================
-- Migraciones — alke_wallet_db
-- Vacío: CHECK y restricciones están en schema/01_alke_wallet_schema.sql
-- =====================================================

 -- Alkawallet DB
USE alkewallet; /* Se selecciona la base de datos alkewallet para realizar las migraciones. */

ALTER TABLE alkewallet.users ADD COLUMN first_name VARCHAR(255) NOT NULL;   /* Se agrega la columna first_name a la tabla users para almacenar el primer nombre del usuario.*/  
ALTER TABLE alkewallet.users ADD COLUMN last_name VARCHAR(255) NOT NULL;    /* Se agrega la columna last_name a la tabla users para almacenar el apellido del usuario.*/
ALTER TABLE alkewallet.users ADD COLUMN is_active TINYINT(1) NOT NULL DEFAULT 1;    /* Se agrega la columna is_active a la tabla users para indicar si el usuario está activo o no. Por defecto, se establece en 1 (activo).*/
ALTER TABLE alkewallet.users MODIFY COLUMN created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP; /* Se modifica la columna created_at de la tabla users para establecer un valor predeterminado de CURRENT_TIMESTAMP, lo que significa que se registrará automáticamente la fecha y hora de creación del registro. */
ALTER TABLE alkewallet.users ADD COLUMN updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;    /* Se agrega la columna updated_at a la tabla users para almacenar la fecha y hora de la última actualización del registro. Se establece un valor predeterminado de CURRENT_TIMESTAMP y se actualiza automáticamente cada vez que se modifica el registro. */

#	Modificación de la tabla users para cambiar el orden de las columnas y establecer restricciones NOT NULL en first_name y last_name.
ALTER TABLE alkewallet.users MODIFY COLUMN first_name VARCHAR(255) NOT NULL AFTER user_name;
ALTER TABLE alkewallet.users MODIFY COLUMN last_name VARCHAR(255) NOT NULL AFTER first_name;
ALTER TABLE users MODIFY COLUMN created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP AFTER is_active;



INSERT INTO alkewallet.users (user_name, first_name, last_name, email, password, is_active) 
VALUES('admin', 'system', 'Administrator', 'admin@alkewallet.com',12345,1); /* Se inserta un registro en la tabla users con los valores especificados para user_name, first_name, last_name, email, password e is_active. Esto crea un usuario administrador con los datos proporcionados. */

-- DDL: 1. Creación de la estructura base de la tabla
CREATE TABLE `payees` (
  `payee_id` INT NOT NULL AUTO_INCREMENT,
  `user_id` INT NOT NULL COMMENT 'ID del usuario dueño de la agenda',
  `full_name` VARCHAR(255) COLLATE utf8mb3_bin NOT NULL COMMENT 'Nombre y apellido en una sola fila',
  `cbu` VARCHAR(50) COLLATE utf8mb3_bin NOT NULL COMMENT 'Número de cuenta o CBU',
  `alias` VARCHAR(100) COLLATE utf8mb3_bin DEFAULT NULL COMMENT 'Alias bancario',
  `currency_id` INT NOT NULL COMMENT 'Divisa de la cuenta del beneficiario',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`payee_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_bin;

-- DDL: 2. Migración mediante ALTER TABLE (Relaciones y Reglas)
ALTER TABLE `payees`
  -- Relación con el usuario
  ADD CONSTRAINT `fk_payees_user_id` 
    FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) 
    ON DELETE CASCADE ON UPDATE CASCADE,
    
  -- Relación con la divisa
  ADD CONSTRAINT `fk_payees_currency_id` 
    FOREIGN KEY (`currency_id`) REFERENCES `currencies` (`currency_id`) 
    ON DELETE RESTRICT ON UPDATE RESTRICT,
    
  -- Validación de longitud del CBU
  ADD CONSTRAINT `chk_payees_cbu_length` 
    CHECK (CHAR_LENGTH(`cbu`) >= 10);

-- DML: Migración e inserción inicial
INSERT INTO `payees` (`user_id`, `full_name`, `cbu`, `alias`, `currency_id`) 
VALUES 
(21, 'Carlos Silva', '1234567890123456789012', 'carlos.silva.peso', 1),
(21, 'Carlos Silva', '0987654321098765432109', 'carlos.silva.usd', 2),
(21, 'María Rojas', '1122334455', 'maria.rojas', 1),
(22, 'Empresa de Servicios SPA', '5555444433332222111100', 'pago.servicios', 1);