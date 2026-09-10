const { pool } = require("../config/db");

const obtenerSaldoUsuario = async (userId) => {
  const query = `
    SELECT a.current_balance, c.currency_symbol
    FROM AlkeWallet.Accounts a
    JOIN AlkeWallet.Currencies c ON a.currency_id = c.currency_id
    WHERE a.user_id = ? AND a.is_default = 1
  `;

  const [rows] = await pool.query(query, [userId]);

  if (rows.length > 0) {
    return rows[0];
  }

  return { current_balance: 0, currency_symbol: "$" };
};

module.exports = {
  obtenerSaldoUsuario,
};
