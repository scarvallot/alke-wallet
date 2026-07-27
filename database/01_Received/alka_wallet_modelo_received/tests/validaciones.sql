-- =====================================================
-- Validaciones — AlkaWallet Modelo Received
-- Consultas para verificar integridad y reglas del modelo
-- =====================================================

USE `AlkaWallet`;

-- =====================================================
-- Consultas simples
-- =====================================================

-- Catálogo de monedas (en este modelo Moneda no está vinculada a Usuario)
SELECT
    currency_id,
    currency_name,
    currency_symbol
FROM `Moneda`
ORDER BY currency_id;

-- Datos de un usuario específico
SELECT
    user_id,
    nombre,
    correo_electronico,
    saldo
FROM `Usuario`
WHERE user_id = 11;

-- Consulta para obtener todas las transacciones registradas
SELECT
    transaction_id,
    importe
FROM `Transaccion`
ORDER BY transaction_id;

-- Total de importes recibidos por usuario
SELECT
    receiver_user_id AS id_user_importes_receptor,
    SUM(importe) AS total_importe_receptor
FROM `Transaccion`
GROUP BY receiver_user_id
ORDER BY total_importe_receptor DESC;

-- Transacciones en las que participa un usuario (como emisor o receptor)
SELECT
    transaction_id AS id_transaccion,
    receiver_user_id,
    sender_user_id,
    importe AS total_importe
FROM `Transaccion`
WHERE sender_user_id = 11 OR receiver_user_id = 11
ORDER BY total_importe DESC;

-- =====================================================
-- Consultas con filtros y agregaciones
-- =====================================================

-- Usuarios con saldo mayor a $100.000
SELECT
    nombre,
    correo_electronico,
    CONCAT('$ ', FORMAT(saldo, 0, 'es_ES')) AS saldo_formateado
FROM `Usuario`
WHERE saldo > 100000
ORDER BY saldo DESC;

-- Transacciones durante marzo 2026
SELECT
    COUNT(transaction_id) AS cantidad_transacciones
FROM `Transaccion`
WHERE transaction_date >= '2026-03-01'
  AND transaction_date < '2026-04-01';

-- Importe promedio de todas las transacciones
SELECT
    CONCAT('$ ', FORMAT(AVG(importe), 0, 'es_ES')) AS promedio_importe
FROM `Transaccion`;

-- Importe total, máximo y mínimo
SELECT
    MIN(importe) AS importe_minimo,
    MAX(importe) AS importe_maximo,
    SUM(importe) AS importe_total
FROM `Transaccion`;

-- =====================================================
-- Consultas con GROUP BY y funciones de agregación
-- =====================================================

-- Transacciones enviadas por cada usuario
SELECT
    u.nombre AS nombre_usuario,
    COUNT(t.transaction_id) AS cantidad_transacciones
FROM `Transaccion` AS t
LEFT JOIN `Usuario` AS u ON t.sender_user_id = u.user_id
GROUP BY t.sender_user_id, u.nombre
ORDER BY cantidad_transacciones DESC;

-- Monto total recibido por cada usuario
SELECT
    u.user_id,
    u.nombre,
    COALESCE(SUM(t.importe), 0) AS total_recibido
FROM `Usuario` u
LEFT JOIN `Transaccion` t ON u.user_id = t.receiver_user_id
GROUP BY u.user_id, u.nombre;

-- Transacciones por mes del año 2026
SELECT
    MONTHNAME(transaction_date) AS mes_transaccion,
    COUNT(transaction_id) AS cantidad_transacciones
FROM `Transaccion`
WHERE YEAR(transaction_date) = 2026
GROUP BY MONTHNAME(transaction_date), MONTH(transaction_date)
ORDER BY MONTH(transaction_date);

-- =====================================================
-- Consultas con JOIN
-- =====================================================

-- Nombre del emisor y del receptor en cada transacción, con importe y fecha
SELECT
    t.transaction_id,
    emisor.nombre AS nombre_emisor,
    receptor.nombre AS nombre_receptor,
    t.importe,
    t.transaction_date
FROM `Transaccion` t
INNER JOIN `Usuario` emisor ON t.sender_user_id = emisor.user_id
INNER JOIN `Usuario` receptor ON t.receiver_user_id = receptor.user_id
ORDER BY t.transaction_date, t.transaction_id;

-- Usuarios que enviaron transacciones con importe superior a $100.000
SELECT
    u.nombre,
    u.correo_electronico,
    t.transaction_id,
    t.importe,
    t.transaction_date
FROM `Transaccion` t
INNER JOIN `Usuario` u ON t.sender_user_id = u.user_id
WHERE t.importe > 100000
ORDER BY t.importe DESC;

-- =====================================================
-- Consultas con subconsultas
-- =====================================================

-- Usuarios con saldo superior al saldo promedio
SELECT
    user_id,
    nombre,
    correo_electronico,
    saldo
FROM `Usuario`
WHERE saldo > (SELECT AVG(saldo) FROM `Usuario`)
ORDER BY saldo DESC;

-- Usuarios que han enviado al menos una transacción
SELECT
    u.user_id,
    u.nombre,
    u.correo_electronico
FROM `Usuario` u
WHERE u.user_id IN (SELECT DISTINCT sender_user_id FROM `Transaccion`);

-- Usuario con mayor monto total acumulado recibido
SELECT
    u.user_id,
    u.nombre,
    totales.total_recibido
FROM `Usuario` u
INNER JOIN (
    SELECT
        receiver_user_id,
        SUM(importe) AS total_recibido
    FROM `Transaccion`
    GROUP BY receiver_user_id
) AS totales ON u.user_id = totales.receiver_user_id
WHERE totales.total_recibido = (
    SELECT MAX(total_por_receptor)
    FROM (
        SELECT SUM(importe) AS total_por_receptor
        FROM `Transaccion`
        GROUP BY receiver_user_id
    ) AS maximos
);
