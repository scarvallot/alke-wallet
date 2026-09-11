const { strict: assert } = require("assert");
const { pool } = require("../src/config/db");
const {
  simularOperacionTransaccional,
} = require("../src/services/transaction.service");

async function contarFilas(tabla) {
  const [rows] = await pool.query(`SELECT COUNT(*) AS total FROM ${tabla}`);
  return Number(rows[0].total);
}

(async () => {
  const antesUsers = await contarFilas("users");
  const antesTransactions = await contarFilas("transactions");

  try {
    await assert.rejects(
      async () => simularOperacionTransaccional({ forceError: true }),
      {
        name: "Error",
        message: "Error forzado para validar rollback",
      },
    );

    const despuesUsers = await contarFilas("users");
    const despuesTransactions = await contarFilas("transactions");

    assert.equal(
      despuesUsers,
      antesUsers,
      "El rollback debe dejar la tabla users intacta",
    );
    assert.equal(
      despuesTransactions,
      antesTransactions,
      "El rollback debe dejar la tabla transactions intacta",
    );

    console.log("rollback simulado verificado");
  } catch (error) {
    console.error(error);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
})();
