
-- =====================================================
-- Consultas SQL
-- =====================================================

-- Consulta para obtener el nombre de la moneda elegida por un usuario específico.
SELECT 
    u.`user_name`,
    -- c.`currency_symbol` AS `simbolo_moneda`
    c.`currency_name` AS `moneda_elegida`
FROM `User` u
LEFT JOIN `Account` a 
    ON u.`user_id` = a.`user_id` AND a.`is_default` = 1
LEFT JOIN `Currency` c 
    ON a.`currency_id` = c.`currency_id`
WHERE u.`user_id` = 11;

-- Consulta para obtener todas las transacciones registradas.
SELECT 
    t.`transaction_id`,
    u_sender.`user_name`   AS emisor,
    u_receiver.`user_name` AS receptor,
    c_sender.`currency_symbol`   AS moneda_emisor,
    c_receiver.`currency_symbol` AS moneda_receptor,
    t.`importe`,
    t.`transaction_date`
FROM `Transaction` t
INNER JOIN `Account` a_sender   ON t.`sender_account_id`  = a_sender.`account_id`
INNER JOIN `User` u_sender      ON a_sender.`user_id`      = u_sender.`user_id`
INNER JOIN `Account` a_receiver ON t.`receive_account_id`  = a_receiver.`account_id`
INNER JOIN `User` u_receiver    ON a_receiver.`user_id`    = u_receiver.`user_id`
INNER JOIN `Currency` c_sender   ON a_sender.`currency_id`   = c_sender.`currency_id`
INNER JOIN `Currency` c_receiver ON a_receiver.`currency_id` = c_receiver.`currency_id`
ORDER BY t.`transaction_date` DESC;

-- Consulta para obtener todas las transacciones realizadas por un usuario específico.
SELECT 
    t.transaction_id,
    u_sender.user_name   AS emisor,
    u_receiver.user_name AS receptor,
    c_sender.currency_symbol   AS moneda_emisor,
    c_receiver.currency_symbol AS moneda_receptor,
    t.importe,
    t.transaction_date
FROM `Transaction` t
INNER JOIN `Account` a_sender   
ON t.sender_account_id  = a_sender.account_id
INNER JOIN `User` u_sender      
ON a_sender.user_id      = u_sender.user_id
INNER JOIN `Account` a_receiver 
ON t.receive_account_id  = a_receiver.account_id
INNER JOIN `User` u_receiver    
ON a_receiver.user_id    = u_receiver.user_id
INNER JOIN `Currency` c_sender  
ON a_sender.currency_id   = c_sender.currency_id
INNER JOIN `Currency` c_receiver 
ON a_receiver.currency_id = c_receiver.currency_id
WHERE u_sender.user_id = 11 OR u_receiver.user_id = 11
ORDER BY t.transaction_date DESC;

-- Sentencia DML para modificar el campo correo electrónico de un usuario específico.
UPDATE `User`
SET email = 'nuevo.correo@email.com'
WHERE user_id = 11;

-- Sentencia para eliminar los datos de una transacción (eliminado de la fila completa)
DELETE FROM `Transaction`
WHERE transaction_id = 109;

-- sub‑consultas para obtener el total de transacciones por usuario.
SELECT 
    u.user_id,
    u.user_name,
    COALESCE(conteo.total, 0) AS total_transacciones
FROM `User` u
LEFT JOIN (
    SELECT 
        a.user_id, 
        COUNT(*) AS total
    FROM `Transaction` t
    INNER JOIN `Account` a 
        ON a.account_id = t.sender_account_id OR a.account_id = t.receive_account_id
    GROUP BY a.user_id
) AS conteo ON u.user_id = conteo.user_id
ORDER BY total_transacciones DESC;

-- top‑5 de usuarios con mayor saldo.
CREATE VIEW vw_top5_saldo_cuenta_default AS
SELECT 
    u.user_id,
    u.user_name,
    c.currency_name,
    a.current_balance
FROM `Account` a
INNER JOIN `User` u ON a.user_id = u.user_id
INNER JOIN `Currency` c ON a.currency_id = c.currency_id
WHERE a.is_default = 1
ORDER BY a.current_balance DESC
LIMIT 5;

-- Actualizar el saldo de un usuario luego de una transacción.
USE `AlkeWallet`;

START TRANSACTION;

-- 1. Descontar el importe de la cuenta emisora
UPDATE `Account`
SET current_balance = current_balance - 50000
WHERE account_id = 3;

-- 2. Sumar el importe a la cuenta receptora
UPDATE `Account`
SET current_balance = current_balance + 50000
WHERE account_id = 7;

-- 3. Registrar la transacción
INSERT INTO `Transaction` (importe, sender_account_id, receive_account_id)
VALUES (50000, 3, 7);

-- 4. Verificar que todo quedó correcto antes de confirmar
SELECT account_id, current_balance FROM `Account` WHERE account_id IN (3, 7);

-- 5. Si todo está bien, confirmar de forma permanente
COMMIT;

-- Error de integridad referencial y revertir la operación.
-- Selecciona la base de datos AlkeWallet como la BD activa para esta sesion;
USE `AlkeWallet`;

-- Inicia una transaccion: desactiva el autocommit para las sentencias que
-- siguen, agrupandolas como una unica unidad "todo o nada".
START TRANSACTION;

-- Descuenta 20000 del saldo de la cuenta con account_id = 3 (existe).
-- Este cambio queda "pendiente", visible solo dentro de esta transaccion.
UPDATE `Account`
SET current_balance = current_balance - 20000
WHERE account_id = 3;

-- Intenta sumar 20000 a la cuenta con account_id = 999 (NO existe).
-- No da error: el WHERE simplemente no encuentra ninguna fila que coincida,
-- por lo que MySQL reporta "0 rows affected" sin fallar.
UPDATE `Account`
SET current_balance = current_balance + 20000
WHERE account_id = 999;

-- Intenta registrar la transaccion entre la cuenta 3 (emisora) y la cuenta
-- 999 (receptora, inexistente). Aqui SI falla: la FOREIGN KEY hacia Account
-- rechaza el INSERT con el error 1452, porque 999 no es un account_id valido.
INSERT INTO `Transaction` (importe, sender_account_id, receive_account_id)
VALUES (20000, 3, 999);

-- Revierte TODOS los cambios hechos desde el START TRANSACTION (en este
-- caso, el UPDATE a la cuenta 3), dejando la base de datos exactamente como
-- estaba antes de que empezara el bloque. Se ejecuta tras ver el error 1452.
ROLLBACK;

-- Verifica que el saldo de la cuenta 3 haya vuelto a su valor original,
-- confirmando que el ROLLBACK deshizo el descuento de 20000.
SELECT account_id, current_balance FROM `Account` WHERE account_id = 3;

-- Verifica que la transaccion fallida nunca haya quedado registrada:
-- este SELECT deberia devolver 0 filas, ya que el INSERT nunca se confirmo.
SELECT * FROM `Transaction` WHERE sender_account_id = 3 AND importe = 20000;

/* Actualizar al Saldo original de la cuenta.
UPDATE `Account`
SET current_balance = 354785.00
WHERE account_id = 3;
*/

-- Modificar la tabla usuario para añadir la fecha de creación usando ALTER TABLE
ALTER TABLE `User`
ADD COLUMN `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP;