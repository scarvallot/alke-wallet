const { obtenerSaldoUsuario } = require("../services/services");

const consultarSaldo = async (req, res) => {
  try {
    const userId = req.session.usuario.user_id;
    const saldoData = await obtenerSaldoUsuario(userId);
    res.status(200).json(saldoData);
  } catch (error) {
    console.error("Error al obtener saldo:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

module.exports = { consultarSaldo };
