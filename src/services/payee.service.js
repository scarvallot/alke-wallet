const { pool } = require("../config/db");

const agregarPayeeService = async (userId, payeeData) => {
  const { full_name, cbu, alias, currency_id } = payeeData;

  // 1. Validar que el CBU no esté ya registrado para este mismo usuario
  const queryCheck =
    "SELECT payee_id FROM payees WHERE user_id = ? AND cbu = ?";
  const [existentes] = await pool.query(queryCheck, [userId, cbu]);

  if (existentes.length > 0) {
    throw new Error(
      "Este CBU ya se encuentra registrado en tu libreta de contactos.",
    );
  }

  // 2. Insertar el nuevo destinatario
  const queryInsert = `
    INSERT INTO payees (user_id, full_name, cbu, alias, currency_id)
    VALUES (?, ?, ?, ?, ?)
  `;

  const [resultado] = await pool.query(queryInsert, [
    userId,
    full_name,
    cbu,
    alias || null,
    currency_id,
  ]);

  return { payee_id: resultado.insertId };
};

const obtenerPayeesService = async (userId) => {
  const query =
    "SELECT payee_id, full_name, cbu, alias, currency_id FROM payees WHERE user_id = ? ORDER BY full_name ASC";
  const [contactos] = await pool.query(query, [userId]);
  return contactos;
};

module.exports = { agregarPayeeService, obtenerPayeesService };
