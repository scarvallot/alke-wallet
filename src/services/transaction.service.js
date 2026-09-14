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

module.exports = {
  obtenerSaldoUsuario,
  obtenerHistorialUsuario,
};
