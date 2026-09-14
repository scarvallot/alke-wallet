const { Payee } = require("../models");

const agregarPayeeService = async (userId, payeeData) => {
  const { full_name, cbu, alias, currency_id } = payeeData;

  // 1. Validar que el CBU no esté registrado utilizando findOne[cite: 9]
  const existente = await Payee.findOne({
    where: { user_id: userId, cbu },
  });

  if (existente) {
    throw new Error(
      "Este CBU ya se encuentra registrado en tu libreta de contactos.",
    );
  }

  // 2. Insertar el nuevo destinatario utilizando create[cite: 9]
  const nuevoPayee = await Payee.create({
    user_id: userId,
    full_name,
    cbu,
    alias: alias || null,
    currency_id,
  });

  return { payee_id: nuevoPayee.payee_id };
};

const obtenerPayeesService = async (userId) => {
  // Reemplaza la consulta SELECT con ORDER BY[cite: 9]
  const contactos = await Payee.findAll({
    where: { user_id: userId },
    order: [["full_name", "ASC"]],
    attributes: ["payee_id", "full_name", "cbu", "alias", "currency_id"],
  });

  return contactos;
};

module.exports = { agregarPayeeService, obtenerPayeesService };
