const {
  obtenerSaldoUsuario,
  procesarTransferencia,
  procesarDeposito,
  obtenerHistorialUsuario,
} = require("../services/transaction.service");
const { obtenerCuentaPorUsuarioId } = require("../services/wallet-service");

// Consulta el saldo del usuario autenticado en sesión.
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

// Procesa un depósito con validaciones mínimas de entrada.
const realizarDeposito = async (req, res) => {
  try {
    const userId = req.session.usuario.user_id;
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "El monto del depósito es inválido.",
      });
    }

    if (amount < 1000) {
      return res.status(400).json({
        success: false,
        message: "El monto mínimo de depósito es $1.000.",
      });
    }

    const resultado = await procesarDeposito(userId, amount);
    return res.status(200).json(resultado);
  } catch (error) {
    console.error("Error al procesar el depósito:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Error interno al procesar el depósito.",
    });
  }
};

const realizarTransferencia = async (req, res) => {
  try {
    const senderId = req.session.usuario.user_id;

    // === AGREGA ESTA LÍNEA PARA DIAGNOSTICAR ===
    console.log("Datos recibidos desde el Frontend:", req.body);

    const cbuDestino = req.body.cbu || req.body.receiverId;
    const { amount } = req.body;

    // Validación de entrada
    if (!cbuDestino || !amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message:
          "Datos inválidos para la transferencia. Verifica el CBU del destinatario y el monto.",
      });
    }

    // Nota: Eliminamos la antigua validación "senderId === parseInt(receiverId)"
    // porque ahora estamos trabajando con CBUs, no con IDs de usuario directos.

    // Llamada al servicio transaccional (pasándole el CBU correctamente)
    const resultado = await procesarTransferencia(senderId, cbuDestino, amount);
    return res.status(200).json(resultado);
  } catch (error) {
    console.error("Error en el controlador de transferencia:", error);

    // Si el error es de negocio (ej. "No se encontró el CBU" o "Saldo insuficiente"), enviamos 400
    const statusCode =
      error.message.includes("No se encontro") ||
      error.message.includes("Saldo")
        ? 400
        : 500;

    return res.status(statusCode).json({
      success: false,
      message:
        error.message || "Ocurrió un error al procesar la transferencia.",
    });
  }
};
// Devuelve el historial de transacciones del usuario en sesión.
const obtenerHistorial = async (req, res) => {
  try {
    const userId = req.session.usuario.user_id;
    const historial = await obtenerHistorialUsuario(userId);
    res.status(200).json({ success: true, data: historial });
  } catch (error) {
    console.error("Error al obtener historial:", error);
    res
      .status(500)
      .json({ success: false, message: "Error al cargar las transacciones" });
  }
};

const obtenerDatosCuenta = async (req, res) => {
  try {
    // 1. Usamos user_id tal como en el resto de tus controladores
    const userId = req.session.usuario.user_id;
    // 2. Llamamos al servicio correctamente
    const cuenta = await obtenerCuentaPorUsuarioId(userId);
    // 3. Lógica de respuesta: Si no hay cuenta, error 404
    if (!cuenta) {
      return res.status(404).json({
        success: false,
        message: "No se encontraron datos de la cuenta asociada al usuario.",
      });
    }
    // 4. Éxito 200, enviamos el CBU
    res.status(200).json({
      success: true,
      cbu: cuenta.cbu || cuenta.numero_cuenta,
    });
  } catch (error) {
    console.error("Error en obtenerDatosCuenta (Controller):", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor al procesar la solicitud.",
    });
  }
};

module.exports = {
  consultarSaldo,
  realizarTransferencia,
  realizarDeposito,
  obtenerHistorial,
  obtenerDatosCuenta,
};
