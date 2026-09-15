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

// Ejecuta una transferencia entre el usuario activo y un destinatario válido.
const realizarTransferencia = async (req, res) => {
  try {
    // El senderId se obtiene de forma segura desde la sesión activa
    const senderId = req.session.usuario.user_id;
    const { receiverId, amount } = req.body;

    // Validación de entrada
    if (!receiverId || !amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message:
          "Datos inválidos para la transferencia. Verifica el destinatario y el monto.",
      });
    }

    if (senderId === parseInt(receiverId)) {
      return res.status(400).json({
        success: false,
        message: "No puedes transferir dinero a ti mismo.",
      });
    }

    // Llamada al servicio transaccional
    const resultado = await procesarTransferencia(senderId, receiverId, amount);
    return res.status(200).json(resultado);
  } catch (error) {
    console.error("Error en el controlador de transferencia:", error);
    return res.status(500).json({
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
