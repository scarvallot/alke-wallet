-- =====================================================
-- Migraciones — alkewallet
-- Nombre de base de datos unificado a "alkewallet" (todo en minuscula)
-- para evitar el error "Unknown database" visto anteriormente.
-- =====================================================

USE `alkewallet`; -- Se selecciona la base de datos alkewallet para realizar las migraciones.

-- -----------------------------------------------------
-- 1. Columnas de auditoria (created_at / updated_at)
-- -----------------------------------------------------
ALTER TABLE `alkewallet`.`transactions` ADD COLUMN `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE `alkewallet`.`transactions` ADD COLUMN `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;

ALTER TABLE `alkewallet`.`accounts` ADD COLUMN `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE `alkewallet`.`accounts` ADD COLUMN `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;

ALTER TABLE `alkewallet`.`currencies` ADD COLUMN `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE `alkewallet`.`currencies` ADD COLUMN `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;

-- -----------------------------------------------------
-- 2. Tabla users: nuevas columnas
--    first_name / last_name se agregan con DEFAULT '' porque la tabla
--    ya tiene filas: un ADD COLUMN ... NOT NULL sin DEFAULT falla en
--    modo estricto (ERROR 1364) si existen registros previos.
-- -----------------------------------------------------
ALTER TABLE `alkewallet`.`users` ADD COLUMN `first_name` VARCHAR(255) NOT NULL DEFAULT ''
    COMMENT 'Primer nombre del usuario';
ALTER TABLE `alkewallet`.`users` ADD COLUMN `last_name` VARCHAR(255) NOT NULL DEFAULT ''
    COMMENT 'Apellido del usuario';
ALTER TABLE `alkewallet`.`users` ADD COLUMN `is_active` TINYINT(1) NOT NULL DEFAULT 1
    COMMENT 'Indica si el usuario esta activo (1) o no (0)';
ALTER TABLE `alkewallet`.`users` MODIFY COLUMN `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    COMMENT 'Fecha y hora de creacion del registro';
ALTER TABLE `alkewallet`.`users` ADD COLUMN `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    COMMENT 'Fecha y hora de la ultima actualizacion del registro';

-- -----------------------------------------------------
-- 3. Reordenar columnas de users (cosmetico, no afecta datos)
-- -----------------------------------------------------
ALTER TABLE `alkewallet`.`users` MODIFY COLUMN `first_name` VARCHAR(255) NOT NULL DEFAULT '' AFTER `user_name`;
ALTER TABLE `alkewallet`.`users` MODIFY COLUMN `last_name`  VARCHAR(255) NOT NULL DEFAULT '' AFTER `first_name`;
ALTER TABLE `alkewallet`.`users` MODIFY COLUMN `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP AFTER `is_active`;

-- -----------------------------------------------------
-- 4. Usuario administrador inicial
--    NOTA: 'password' debe almacenar un HASH (bcrypt/argon2), nunca
--    texto plano. Aqui se deja el placeholder entre comillas como
--    recordatorio explicito de que se debe reemplazar por el hash real
--    antes de correr esto en un ambiente real.
-- -----------------------------------------------------
INSERT INTO `alkewallet`.`users` (`user_name`, `first_name`, `last_name`, `email`, `password`, `is_active`)
VALUES ('admin', 'system', 'Administrator', 'admin@alkewallet.com', '$2b$REEMPLAZAR_POR_HASH_REAL', 1);

-- =====================================================
-- 5. Tabla payees (agenda de contactos/beneficiarios)
-- =====================================================

-- DDL: creacion de la estructura base
CREATE TABLE `payees` (
  `payee_id`    INT NOT NULL AUTO_INCREMENT,
  `user_id`     INT NOT NULL COMMENT 'ID del usuario dueno de la agenda',
  `full_name`   VARCHAR(255) COLLATE utf8mb3_bin NOT NULL COMMENT 'Nombre y apellido en una sola fila',
  `cbu`         VARCHAR(50)  COLLATE utf8mb3_bin NOT NULL COMMENT 'Numero de cuenta o CBU',
  `alias`       VARCHAR(100) COLLATE utf8mb3_bin DEFAULT NULL COMMENT 'Alias bancario',
  `currency_id` INT NOT NULL COMMENT 'Divisa de la cuenta del beneficiario',
  `created_at`  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at`  TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, -- corregido: era "update_at"
  PRIMARY KEY (`payee_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_bin;

-- DDL: relaciones y reglas de negocio
ALTER TABLE `payees`
  ADD CONSTRAINT `fk_payees_user_id`
    FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`)
    ON DELETE CASCADE ON UPDATE CASCADE,

  ADD CONSTRAINT `fk_payees_currency_id`
    FOREIGN KEY (`currency_id`) REFERENCES `currencies` (`currency_id`)
    ON DELETE RESTRICT ON UPDATE RESTRICT,

  ADD CONSTRAINT `chk_payees_cbu_length`
    CHECK (CHAR_LENGTH(`cbu`) >= 10);

ALTER TABLE `payees`
  ADD INDEX `idx_payees_cbu` (`cbu` ASC) VISIBLE;

-- =====================================================
-- 6. Tabla accounts: CBU obligatorio y unico
--    Orden corregido: primero se rellenan los CBU existentes
--    (mientras la columna aun admite NULL), y RECIEN DESPUES se
--    aplica NOT NULL + UNIQUE. El orden original lo tenia invertido
--    y habria fallado con ERROR 1138 (Invalid use of NULL value).
-- =====================================================

-- 6.1 Backfill de CBU para cuentas existentes que aun no lo tengan
SET SQL_SAFE_UPDATES = 0;
UPDATE `accounts`
SET `cbu` = CONCAT('100000000000000000', LPAD(account_id, 2, '0'))
WHERE `account_id` > 0 AND `cbu` IS NULL;
SET SQL_SAFE_UPDATES = 1;

-- 6.2 Recien ahora se puede forzar NOT NULL + UNIQUE sin filas nulas restantes
ALTER TABLE `accounts`
  MODIFY COLUMN `cbu` VARCHAR(50) COLLATE utf8mb3_bin NOT NULL
    COMMENT 'Numero de cuenta o CBU transaccional'
    AFTER `user_id`,
  ADD UNIQUE INDEX `uq_accounts_cbu` (`cbu` ASC) VISIBLE;
