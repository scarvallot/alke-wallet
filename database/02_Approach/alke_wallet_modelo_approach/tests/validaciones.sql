-- =====================================================
-- Validaciones — AlkeWallet Modelo Approach
-- Consultas para verificar integridad y restricciones
-- =====================================================

USE `AlkeWallet`;

-- -----------------------------------------------------
-- 1. Verificar restricciones UNIQUE
-- -----------------------------------------------------

-- 1.1 Verificar que no haya emails duplicados en Users
-- (debería devolver 0 filas si la restricción funciona)
SELECT email, COUNT(*) AS duplicados
FROM `Users`
GROUP BY email
HAVING COUNT(*) > 1;

-- 1.2 Verificar que no haya nombres de moneda duplicados
SELECT currency_name, COUNT(*) AS duplicados
FROM `Currencies`
GROUP BY currency_name
HAVING COUNT(*) > 1;

-- 1.3 Verificar que no haya símbolos de moneda duplicados
SELECT currency_symbol, COUNT(*) AS duplicados
FROM `Currencies`
GROUP BY currency_symbol
HAVING COUNT(*) > 1;

-- -----------------------------------------------------
-- 2. Verificar restricciones NOT NULL
-- -----------------------------------------------------

-- 2.1 Campos obligatorios en Users
SELECT * FROM `Users`
WHERE username IS NULL
   OR email IS NULL
   OR password IS NULL
   OR current_balance IS NULL;

-- 2.2 Campos obligatorios en Currencies
SELECT * FROM `Currencies`
WHERE currency_name IS NULL
   OR currency_symbol IS NULL;

-- 2.3 Campos obligatorios en Transactions
SELECT * FROM `Transactions`
WHERE importe IS NULL
   OR transaction_date IS NULL
   OR sender_user_id IS NULL
   OR receiver_user_id IS NULL
   OR currency_id IS NULL;

-- -----------------------------------------------------
-- 3. Verificar integridad referencial (Foreign Keys)
-- -----------------------------------------------------

-- 3.1 Transacciones con sender_user_id que no existe en Users
SELECT t.*
FROM `Transactions` t
LEFT JOIN `Users` u ON t.sender_user_id = u.user_id
WHERE u.user_id IS NULL;

-- 3.2 Transacciones con receiver_user_id que no existe en Users
SELECT t.*
FROM `Transactions` t
LEFT JOIN `Users` u ON t.receiver_user_id = u.user_id
WHERE u.user_id IS NULL;

-- 3.3 Transacciones con currency_id que no existe en Currencies
SELECT t.*
FROM `Transactions` t
LEFT JOIN `Currencies` c ON t.currency_id = c.currency_id
WHERE c.currency_id IS NULL;

-- -----------------------------------------------------
-- 4. Verificar tipos DECIMAL y formatos
-- -----------------------------------------------------

-- 4.1 Verificar que current_balance tenga 2 decimales (no más)
-- (Esto es más una validación de aplicación, pero se puede revisar)
SELECT user_id, current_balance
FROM `Users`
WHERE current_balance != ROUND(current_balance, 2);

-- 4.2 Verificar que importe tenga 2 decimales
SELECT transaction_id, importe
FROM `Transactions`
WHERE importe != ROUND(importe, 2);

-- 4.3 Verificar que no haya importes negativos (aunque no hay CHECK)
SELECT * FROM `Transactions` WHERE importe < 0;

-- 4.4 Verificar que no haya saldos negativos
SELECT * FROM `Users` WHERE current_balance < 0;

-- -----------------------------------------------------
-- 5. Verificar formato de fechas (DATETIME)
-- -----------------------------------------------------

-- 5.1 Verificar que transaction_date tenga hora (no sea solo fecha)
-- (En MySQL, un DATETIME siempre tiene hora, pero puede ser 00:00:00)
SELECT transaction_id, transaction_date
FROM `Transactions`
WHERE TIME(transaction_date) = '00:00:00';

-- -----------------------------------------------------
-- 6. Consultas de muestra para validar datos
-- -----------------------------------------------------

-- 6.1 Resumen de saldos por usuario
SELECT 
    u.user_id,
    u.username,
    u.current_balance,
    COUNT(t.transaction_id) AS total_transacciones,
    SUM(CASE WHEN t.sender_user_id = u.user_id THEN t.importe ELSE 0 END) AS total_enviado,
    SUM(CASE WHEN t.receiver_user_id = u.user_id THEN t.importe ELSE 0 END) AS total_recibido
FROM `Users` u
LEFT JOIN `Transactions` t ON u.user_id = t.sender_user_id OR u.user_id = t.receiver_user_id
GROUP BY u.user_id, u.username, u.current_balance
ORDER BY u.user_id;

-- 6.2 Top 5 usuarios por saldo
SELECT user_id, username, current_balance
FROM `Users`
ORDER BY current_balance DESC
LIMIT 5;

-- 6.3 Total de transacciones por moneda
SELECT 
    c.currency_name,
    COUNT(t.transaction_id) AS total_transacciones,
    SUM(t.importe) AS monto_total
FROM `Transactions` t
JOIN `Currencies` c ON t.currency_id = c.currency_id
GROUP BY c.currency_id, c.currency_name
ORDER BY total_transacciones DESC;

-- 6.4 Transacciones del último mes (desde la fecha más reciente)
SELECT *
FROM `Transactions`
WHERE transaction_date >= (SELECT MAX(transaction_date) - INTERVAL 30 DAY FROM `Transactions`)
ORDER BY transaction_date DESC;

-- 6.5 Usuario con más transacciones enviadas
SELECT 
    u.user_id,
    u.username,
    COUNT(t.transaction_id) AS envios
FROM `Users` u
JOIN `Transactions` t ON u.user_id = t.sender_user_id
GROUP BY u.user_id, u.username
ORDER BY envios DESC
LIMIT 1;

-- 6.6 Usuario con más transacciones recibidas
SELECT 
    u.user_id,
    u.username,
    COUNT(t.transaction_id) AS recibidos
FROM `Users` u
JOIN `Transactions` t ON u.user_id = t.receiver_user_id
GROUP BY u.user_id, u.username
ORDER BY recibidos DESC
LIMIT 1;

-- -----------------------------------------------------
-- 7. Verificar acciones ON DELETE CASCADE (comportamiento)
-- -----------------------------------------------------

-- 7.1 Contar transacciones antes de eliminar un usuario (ejemplo con user_id=1)
-- SELECT COUNT(*) FROM `Transactions` WHERE sender_user_id = 1 OR receiver_user_id = 1;

-- 7.2 Eliminar un usuario de prueba (descomentar para probar)
-- DELETE FROM `Users` WHERE user_id = 1;

-- 7.3 Verificar que las transacciones asociadas se eliminaron
-- SELECT COUNT(*) FROM `Transactions` WHERE sender_user_id = 1 OR receiver_user_id = 1;

-- (Estas consultas deben ejecutarse con precaución, preferiblemente en entorno de prueba)

-- =====================================================
-- Fin de validaciones
-- =====================================================