const { Payee, Account } = require("../models");

const agregarPayeeService = async (userId, payeeData) => {
  const { full_name, cbu, alias, currency_id } = payeeData;
  // 1. Validar que el CBU no esté ya registrado en SU libreta de contactos
  const existente = await Payee.findOne({
    where: { user_id: userId, cbu },
  });

  if (existente) {
    throw new Error(
      "Este CBU ya se encuentra registrado en tu libreta de contactos.",
    );
  }
  // 2. Guardar el contacto (interno o externo)
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
  const contactos = await Payee.findAll({
    where: { user_id: userId },
    order: [["full_name", "ASC"]],
    attributes: ["payee_id", "full_name", "cbu", "alias", "currency_id"],
  });

  return contactos;
};

module.exports = { agregarPayeeService, obtenerPayeesService };
