const { Op } = require("sequelize");
const { Account, Currency, Transaction } = require("../models");

const obtenerSaldoUsuario = async (userId) => {
  // Reemplaza el JOIN manual utilizando el atributo include de Sequelize[cite: 10]
  const cuenta = await Account.findOne({
    where: { user_id: userId, is_default: 1 },
    include: [
      {
        model: Currency,
        attributes: ["currency_symbol"],
      },
    ],
  });

  if (!cuenta) {
    throw new Error("Cuenta no encontrada para este usuario");
  }

  const saldo = Number(cuenta.current_balance);
  return {
    current_balance: saldo,
    currency_symbol: cuenta.Currency.currency_symbol,
    balance: saldo,
  };
};

const obtenerHistorialUsuario = async (userId) => {
  const cuenta = await Account.findOne({
    where: { user_id: userId, is_default: 1 },
    attributes: ["account_id"],
  });

  if (!cuenta) return [];
  const miCuentaId = cuenta.account_id;

  // Buscar transacciones donde sea emisor (sender) o receptor (receive) usando Op.or[cite: 10]
  const transacciones = await Transaction.findAll({
    where: {
      [Op.or]: [
        { sender_account_id: miCuentaId },
        { receive_account_id: miCuentaId },
      ],
    },
    order: [["transaction_date", "DESC"]],
    attributes: [
      "transaction_id",
      "importe",
      "transaction_date",
      "sender_account_id",
      "receive_account_id",
    ],
  });

  // Formatear y determinar el "tipo" de transacción para el frontend[cite: 10]
  return transacciones.map((t) => {
    let tipo = "envio";
    if (t.sender_account_id === 1 && t.receive_account_id === miCuentaId) {
      tipo = "deposito";
    } else if (t.receive_account_id === miCuentaId) {
      tipo = "ingreso";
    }

    return {
      id: t.transaction_id,
      importe: Number(t.importe),
      fecha: t.transaction_date,
      tipo: tipo,
    };
  });
};

const procesarTransferencia = async (senderUserId, receiverCbu, amount) => {
  const sequelize = Account.sequelize;

  const resultado = await sequelize.transaction(async (t) => {
    // 1. Bloquear y validar cuenta origen
    const cuentaOrigen = await Account.findOne({
      where: { user_id: senderUserId, is_default: 1 },
      lock: t.LOCK.UPDATE,
      transaction: t,
    });
    if (!cuentaOrigen) {
      throw new Error("No se encontro la cuenta origen del emisor.");
    }

    const saldoActual = Number(cuentaOrigen.current_balance);
    const montoNumerico = Number(amount);
    if (saldoActual < montoNumerico) {
      throw new Error(
        `Saldo insuficiente. Disponible: ${saldoActual}, solicitado: ${montoNumerico}.`,
      );
    }
    // 2. Buscar si el destinatario es INTERNO (existe en accounts)
    const cuentaDestinoInterna = await Account.findOne({
      where: { cbu: receiverCbu },
      lock: t.LOCK.UPDATE,
      transaction: t,
    });

    let receiveAccountId;

    if (cuentaDestinoInterna) {
      // REGLA A: Transferencia Interna (Alke Wallet a Alke Wallet)
      await cuentaDestinoInterna.update(
        {
          current_balance:
            Number(cuentaDestinoInterna.current_balance) + montoNumerico,
        },
        { transaction: t },
      );
      receiveAccountId = cuentaDestinoInterna.account_id;
    } else {
      // REGLA B: Transferencia Externa (El CBU es de otro banco / solo está en Payees)
      // No sumamos saldo a nadie, pero usamos la cuenta del sistema (ID 1) para cumplir
      // con la restricción de llave foránea en la tabla transactions.
      receiveAccountId = 1;
    }

    // 3. Debito en cuenta origen (Ocurre en AMBOS casos)
    await cuentaOrigen.update(
      { current_balance: saldoActual - montoNumerico },
      { transaction: t },
    );

    // 4. Registrar la transaccion
    const nuevaTransaccion = await Transaction.create(
      {
        importe: montoNumerico,
        sender_account_id: cuentaOrigen.account_id,
        receive_account_id: receiveAccountId,
        transaction_date: new Date(),
      },
      { transaction: t },
    );

    // Determinar el mensaje de éxito según el tipo de transferencia
    const mensajeExito = cuentaDestinoInterna
      ? "Transferencia interna realizada con éxito."
      : "Transferencia a banco externo realizada (saldo descontado).";

    return {
      success: true,
      message: mensajeExito,
      transaction_id: nuevaTransaccion.transaction_id,
      importe: montoNumerico,
      saldo_restante: saldoActual - montoNumerico,
    };
  });

  return resultado;
};

const procesarDeposito = async (userId, amount) => {
  const sequelize = Account.sequelize;

  const resultado = await sequelize.transaction(async (t) => {
    // Bloquear cuenta destino
    const cuenta = await Account.findOne({
      where: { user_id: userId, is_default: 1 },
      lock: t.LOCK.UPDATE,
      transaction: t,
    });

    if (!cuenta) {
      throw new Error("No se encontro la cuenta del usuario.");
    }

    const montoNumerico = Number(amount);
    const nuevoSaldo = Number(cuenta.current_balance) + montoNumerico;

    // Acreditar el monto
    await cuenta.update({ current_balance: nuevoSaldo }, { transaction: t });

    // Registrar como transaccion (sender = cuenta sistema account_id=1)
    const nuevaTransaccion = await Transaction.create(
      {
        importe: montoNumerico,
        sender_account_id: 1,
        receive_account_id: cuenta.account_id,
        transaction_date: new Date(),
      },
      { transaction: t },
    );

    return {
      success: true,
      message: `Deposito de $${montoNumerico.toLocaleString(
        "es-AR",
      )} realizado con exito.`,
      transaction_id: nuevaTransaccion.transaction_id,
      nuevo_saldo: nuevoSaldo,
    };
  });

  return resultado;
};

module.exports = {
  obtenerSaldoUsuario,
  obtenerHistorialUsuario,
  procesarTransferencia,
  procesarDeposito,
};
