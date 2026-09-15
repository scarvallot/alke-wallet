const { Account } = require("../models");

const obtenerCuentaPorUsuarioId = async (usuarioId) => {
  try {
    const cuenta = await Account.findOne({
      // La columna en BD se llama user_id, pero el valor viene en usuarioId
      where: { user_id: usuarioId },
    });
    return cuenta; // Retorna los datos crudos a quien lo llame
  } catch (error) {
    // Capturamos el error de BD y lo lanzamos hacia arriba (al controlador)
    throw new Error(
      "Error en la base de datos al buscar la cuenta: " + error.message,
    );
  }
};

module.exports = {
  obtenerCuentaPorUsuarioId,
};
