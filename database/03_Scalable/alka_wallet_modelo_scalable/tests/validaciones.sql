-- =====================================================
-- Validaciones — AlkaWallet Modelo Scalable
-- Consultas de prueba pendientes
-- =====================================================

USE `AlkaWallet`;

-- =====================================================
-- Validaciones — AlkaWallet Modelo Scalable
-- Consultas para verificar integridad y restricciones
-- =====================================================

USE `AlkaWallet`;

-- -----------------------------------------------------
-- 1. Verificar restricciones UNIQUE
-- -----------------------------------------------------

-- 1.1 Emails duplicados en User
SELECT email, COUNT(*) AS duplicados
FROM `User`
GROUP BY email
HAVING COUNT(*) > 1;

-- 1.2 Nombres de moneda duplicados
SELECT currency_name, COUNT(*) AS duplicados
FROM `Currency`
GROUP BY currency_name
HAVING COUNT(*) > 1;

-- 1.3 Símbolos de moneda duplicados
SELECT currency_symbol, COUNT(*) AS duplicados
FROM `Currency`
GROUP BY currency_symbol
HAVING COUNT(*) > 1;

-- 1.4 Cuentas duplicadas (mismo usuario y misma moneda)
SELECT user_id, currency_id, COUNT(*) AS duplicados
FROM `Account`
GROUP BY user_id, currency_id
HAVING COUNT(*) > 1;

-- -----------------------------------------------------
-- 2. Verificar restricciones NOT NULL
-- -----------------------------------------------------

-- 2.1 Campos obligatorios en User
SELECT * FROM `User`
WHERE user_name IS NULL
   OR email IS NULL
   OR password IS NULL;

-- 2.2 Campos obligatorios en Currency
SELECT * FROM `Currency`
WHERE currency_name IS NULL
   OR currency_symbol IS NULL;

-- 2.3 Campos obligatorios en Account
SELECT * FROM `Account`
WHERE user_id IS NULL
   OR currency_id IS NULL
   OR current_balance IS NULL
   OR is_default IS NULL;

-- 2.4 Campos obligatorios en Transaction
SELECT * FROM `Transaction`
WHERE importe IS NULL
   OR transaction_date IS NULL
   OR sender_account_id IS NULL
   OR receive_account_id IS NULL;

-- -----------------------------------------------------
-- 3. Verificar integridad referencial (Foreign Keys)
-- -----------------------------------------------------

-- 3.1 Account con user_id que no existe en User
SELECT a.*
FROM `Account` a
LEFT JOIN `User` u ON a.user_id = u.user_id
WHERE u.user_id IS NULL;

-- 3.2 Account con currency_id que no existe en Currency
SELECT a.*
FROM `Account` a
LEFT JOIN `Currency` c ON a.currency_id = c.currency_id
WHERE c.currency_id IS NULL;

-- 3.3 Transaction con sender_account_id que no existe en Account
SELECT t.*
FROM `Transaction` t
LEFT JOIN `Account` a ON t.sender_account_id = a.account_id
WHERE a.account_id IS NULL;

-- 3.4 Transaction con receive_account_id que no existe en Account
SELECT t.*
FROM `Transaction` t
LEFT JOIN `Account` a ON t.receive_account_id = a.account_id
WHERE a.account_id IS NULL;

-- -----------------------------------------------------
-- 4. Verificar restricciones CHECK
-- -----------------------------------------------------

-- 4.1 Saldos negativos en Account (viola CHECK current_balance >= 0)
SELECT * FROM `Account` WHERE current_balance < 0;

-- 4.2 Importes negativos o cero en Transaction (viola CHECK importe > 0)
SELECT * FROM `Transaction` WHERE importe <= 0;

-- 4.3 Auto-transferencias (viola CHECK sender_account_id <> receive_account_id)
SELECT * FROM `Transaction` WHERE sender_account_id = receive_account_id;

-- -----------------------------------------------------
-- 5. Verificar regla de negocio: solo una cuenta is_default = 1 por usuario
-- -----------------------------------------------------

SELECT user_id, COUNT(*) AS cuentas_default
FROM `Account`
WHERE is_default = 1
GROUP BY user_id
HAVING COUNT(*) > 1;

-- -----------------------------------------------------
-- 6. Consultas de muestra para validar datos
-- -----------------------------------------------------

-- 6.1 Resumen de saldos por usuario (suma de todas sus cuentas)
SELECT 
    u.user_id,
    u.user_name,
    COUNT(a.account_id) AS total_cuentas,
    SUM(a.current_balance) AS saldo_total,
    GROUP_CONCAT(CONCAT(c.currency_symbol, ' ', a.current_balance) SEPARATOR ', ') AS desglose_saldos
FROM `User` u
LEFT JOIN `Account` a ON u.user_id = a.user_id
LEFT JOIN `Currency` c ON a.currency_id = c.currency_id
GROUP BY u.user_id, u.user_name
ORDER BY saldo_total DESC;

-- 6.2 Top 5 cuentas con mayor saldo
SELECT 
    u.user_name,
    c.currency_symbol,
    a.current_balance,
    IF(a.is_default = 1, '✅ Principal', 'Secundaria') AS tipo_cuenta
FROM `Account` a
JOIN `User` u ON a.user_id = u.user_id
JOIN `Currency` c ON a.currency_id = c.currency_id
ORDER BY a.current_balance DESC
LIMIT 5;

-- 6.3 Total de transacciones por moneda (deducida de las cuentas)
SELECT 
    c.currency_name,
    COUNT(t.transaction_id) AS total_transacciones,
    SUM(t.importe) AS monto_total
FROM `Transaction` t
JOIN `Account` a_sender ON t.sender_account_id = a_sender.account_id
JOIN `Currency` c ON a_sender.currency_id = c.currency_id
GROUP BY c.currency_id, c.currency_name
ORDER BY total_transacciones DESC;

-- 6.4 Transacciones del último mes (desde la fecha más reciente)
SELECT *
FROM `Transaction`
WHERE transaction_date >= (SELECT MAX(transaction_date) - INTERVAL 30 DAY FROM `Transaction`)
ORDER BY transaction_date DESC
LIMIT 20;

-- 6.5 Usuario con más transacciones enviadas (a través de sus cuentas)
SELECT 
    u.user_id,
    u.user_name,
    COUNT(t.transaction_id) AS envios
FROM `User` u
JOIN `Account` a ON u.user_id = a.user_id
JOIN `Transaction` t ON a.account_id = t.sender_account_id
GROUP BY u.user_id, u.user_name
ORDER BY envios DESC
LIMIT 1;

-- 6.6 Usuario con más transacciones recibidas
SELECT 
    u.user_id,
    u.user_name,
    COUNT(t.transaction_id) AS recibidos
FROM `User` u
JOIN `Account` a ON u.user_id = a.user_id
JOIN `Transaction` t ON a.account_id = t.receive_account_id
GROUP BY u.user_id, u.user_name
ORDER BY recibidos DESC
LIMIT 1;

-- 6.7 Cuenta más activa (más transacciones como emisor o receptor)
SELECT 
    a.account_id,
    u.user_name,
    c.currency_symbol,
    COUNT(t_sender.transaction_id) + COUNT(t_receiver.transaction_id) AS total_actividad
FROM `Account` a
JOIN `User` u ON a.user_id = u.user_id
JOIN `Currency` c ON a.currency_id = c.currency_id
LEFT JOIN `Transaction` t_sender ON a.account_id = t_sender.sender_account_id
LEFT JOIN `Transaction` t_receiver ON a.account_id = t_receiver.receive_account_id
GROUP BY a.account_id, u.user_name, c.currency_symbol
ORDER BY total_actividad DESC
LIMIT 5;

-- -----------------------------------------------------
-- 7. Verificar comportamiento ON DELETE RESTRICT (prueba de seguridad)
-- -----------------------------------------------------

-- 7.1 Intento de eliminar un usuario con cuentas (debe fallar)
-- DELETE FROM `User` WHERE user_id = 1;

-- 7.2 Intento de eliminar una moneda con cuentas asociadas (debe fallar)
-- DELETE FROM `Currency` WHERE currency_id = 1;

-- 7.3 Intento de eliminar una cuenta con transacciones (debe fallar)
-- DELETE FROM `Account` WHERE account_id = 1;

-- (Estas consultas están comentadas para evitar ejecución accidental.
--  Si se ejecutan, deben fallar con error de integridad referencial
--  por la restricción ON DELETE RESTRICT.)

-- =====================================================
-- Fin de validaciones
-- =====================================================