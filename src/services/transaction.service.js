const { pool } = require("../config/db");
const fs = require("fs").promises;
const path = require("path");

const simularOperacionTransaccional = async ({ forceError = false } = {}) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    // Acción 1: registrar el usuario en una tabla de ejemplo
    await connection.query(
      "INSERT INTO users (user_name, first_name, last_name, email, password, is_active) VALUES (?, ?, ?, ?, ?, 1)",
      [
        `rollback_test_${Date.now()}`,
        "Rollback",
        "Test",
        `rollback_${Date.now()}@alkewallet.test`,
        "test-pass",
      ],
    );

    // Acción 2: crear un historial o línea de auditoría de la operación
    await connection.query(
      "INSERT INTO transactions (importe, transaction_date, sender_account_id, receive_account_id) VALUES (?, NOW(), ?, ?)",
      [1, 1, 2],
    );

    if (forceError) {
      throw new Error("Error forzado para validar rollback");
    }

    await connection.commit();
    await fs.appendFile(
      path.join(__dirname, "../../data/log.txt"),
      `[${new Date().toISOString()}] OPERACIÓN TRANSACCIONAL EXITOSA - usuarios y historial sincronizados\n`,
    );

    return { success: true, message: "Operación transaccional exitosa." };
  } catch (error) {
    await connection.rollback();
    await fs.appendFile(
      path.join(__dirname, "../../data/log.txt"),
      `[${new Date().toISOString()}] OPERACIÓN TRANSACCIONAL FALLIDA - ${
        error.message
      } - rollback ejecutado\n`,
    );
    throw error;
  } finally {
    connection.release();
  }
};

const obtenerSaldoUsuario = async (userId) => {
  const query = `
    SELECT a.current_balance, c.currency_symbol
    FROM accounts a
    JOIN currencies c ON c.currency_id = a.currency_id
    WHERE a.user_id = ? AND a.is_default = 1
    LIMIT 1
  `;
  const [rows] = await pool.query(query, [userId]);
  if (rows.length === 0) {
    throw new Error("Cuenta no encontrada para este usuario");
  }

  const saldo = Number(rows[0].current_balance);
  return {
    current_balance: saldo,
    currency_symbol: rows[0].currency_symbol,
    balance: saldo,
  };
};

const procesarDeposito = async (userId, monto) => {
  if (!monto || Number(monto) <= 0) {
    throw new Error("El monto del depósito debe ser mayor a cero.");
  }

  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    // 1. Obtener la cuenta del usuario
    const queryCuenta =
      "SELECT account_id FROM accounts WHERE user_id = ? AND is_default = 1 FOR UPDATE";
    const [cuentaRows] = await connection.query(queryCuenta, [userId]);

    if (cuentaRows.length === 0) {
      throw new Error("Cuenta principal no encontrada para este usuario.");
    }
    const receiverAccountId = cuentaRows[0].account_id;

    // 2. Actualizar el saldo
    const queryUpdate = `
      UPDATE accounts
      SET current_balance = current_balance + ?
      WHERE account_id = ?
    `;
    await connection.query(queryUpdate, [monto, receiverAccountId]);

    // 3. Registrar el depósito en el historial
    // Usamos account_id = 1 (Sistema/Cajero) como origen simulado del depósito en efectivo
    const cajeroAccountId = 1;
    const queryHistory = `
      INSERT INTO transactions (importe, sender_account_id, receive_account_id, transaction_date) 
      VALUES (?, ?, ?, NOW())
    `;
    await connection.query(queryHistory, [
      monto,
      cajeroAccountId,
      receiverAccountId,
    ]);

    await connection.commit();

    return {
      success: true,
      message: "Depósito realizado y registrado correctamente.",
      redirect: "/menu",
    };
  } catch (error) {
    await connection.rollback();
    console.error(
      "Error al procesar el depósito transaccional:",
      error.message,
    );
    throw error;
  } finally {
    connection.release();
  }
};

// Procesar transferencia con Transaccionalidad
const procesarTransferencia = async (senderUserId, receiverUserId, monto) => {
  // 1. Obtener una conexión exclusiva del pool para esta transacción
  const connection = await pool.getConnection();
  try {
    // 2. Iniciar la transacción
    await connection.beginTransaction();

    // Obtener las cuentas (account_id) de ambos usuarios
    const queryCuentaRemitente =
      "SELECT account_id, current_balance FROM accounts WHERE user_id = ? AND is_default = 1 FOR UPDATE";
    const [senderRows] = await connection.query(queryCuentaRemitente, [
      senderUserId,
    ]);

    if (senderRows.length === 0) {
      throw new Error("Cuenta origen no encontrada.");
    }
    if (senderRows[0].current_balance < monto) {
      throw new Error("Saldo insuficiente.");
    }
    const senderAccountId = senderRows[0].account_id;

    const queryCuentaDestino =
      "SELECT account_id FROM accounts WHERE cbu = ? FOR UPDATE";
    const [receiverRows] = await connection.query(queryCuentaDestino, [
      receiverUserId,
    ]);

    if (receiverRows.length === 0) {
      throw new Error(
        "El CBU ingresado no corresponde a ninguna cuenta registrada en el sistema.",
      );
    }
    const receiverAccountId = receiverRows[0].account_id;

    // ACCIÓN 1: Descontar el saldo de la cuenta del remitente
    const querySender = `
      UPDATE accounts 
      SET current_balance = current_balance - ? 
      WHERE account_id = ?
    `;
    await connection.query(querySender, [monto, senderAccountId]);

    // ACCIÓN 2: Aumentar el saldo a la cuenta del destinatario
    const queryReceiver = `
      UPDATE accounts 
      SET current_balance = current_balance + ? 
      WHERE account_id = ?
    `;
    await connection.query(queryReceiver, [monto, receiverAccountId]);

    // ACCIÓN 3: Registrar el historial de la transacción
    const queryHistory = `
      INSERT INTO transactions (importe, sender_account_id, receive_account_id, transaction_date) 
      VALUES (?, ?, ?, NOW())
    `;
    await connection.query(queryHistory, [
      monto,
      senderAccountId,
      receiverAccountId,
    ]);

    // 3. Confirmar los cambios si todas las acciones anteriores fueron exitosas
    await connection.commit();
    return { success: true, message: "Transferencia realizada con éxito." };
  } catch (error) {
    // 4. ROLLBACK: Revertir todo si alguna de las acciones falla
    await connection.rollback();

    // Guardar el error en un archivo de log
    try {
      const logPath = path.join(__dirname, "../../data/log.txt");
      const logEntry = `[${new Date().toISOString()}] FALLO TRANSACCIÓN - Remitente ID: ${senderUserId}, Destinatario ID: ${receiverUserId}, Monto: ${monto} - Motivo: ${
        error.message
      }\n`;
      await fs.appendFile(logPath, logEntry);
    } catch (logError) {
      console.error("Error al escribir en el log:", logError.message);
    }
    // Propagar el error hacia el controlador
    throw error;
  } finally {
    // 5. Liberar la conexión de vuelta al pool
    connection.release();
  }
};

const obtenerHistorialUsuario = async (userId) => {
  // 1. Encontrar la cuenta del usuario
  const queryCuenta =
    "SELECT account_id FROM accounts WHERE user_id = ? AND is_default = 1";
  const [cuentas] = await pool.query(queryCuenta, [userId]);

  if (cuentas.length === 0) return [];
  const miCuentaId = cuentas[0].account_id;

  // 2. Buscar transacciones donde sea emisor (sender) o receptor (receive)
  const queryHistorial = `
    SELECT transaction_id, importe, transaction_date, sender_account_id, receive_account_id
    FROM transactions 
    WHERE sender_account_id = ? OR receive_account_id = ?
    ORDER BY transaction_date DESC
  `;
  const [transacciones] = await pool.query(queryHistorial, [
    miCuentaId,
    miCuentaId,
  ]);

  // 3. Formatear y determinar el "tipo" de transacción para el frontend
  return transacciones.map((t) => {
    let tipo = "envio";

    // Si el sistema (cuenta 1) lo envió y yo lo recibo, es depósito
    if (t.sender_account_id === 1 && t.receive_account_id === miCuentaId) {
      tipo = "deposito";
    }
    // Si otro usuario lo envió y yo lo recibo, es ingreso
    else if (t.receive_account_id === miCuentaId) {
      tipo = "ingreso";
    }

    return {
      id: t.transaction_id,
      importe: Number(t.importe), // Convertir a número para evitar undefinedNaN
      fecha: t.transaction_date,
      tipo: tipo,
    };
  });
};

module.exports = {
  obtenerSaldoUsuario,
  procesarTransferencia,
  procesarDeposito,
  obtenerHistorialUsuario,
  simularOperacionTransaccional,
};
