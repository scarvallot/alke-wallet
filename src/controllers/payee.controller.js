const {
  agregarPayeeService,
  obtenerPayeesService,
} = require("../services/payee.service");

const agregarContacto = async (req, res) => {
  try {
    // El ID del usuario siempre se obtiene de la sesión por seguridad, nunca del body
    const userId = req.session.usuario.user_id;
    const { full_name, cbu, alias, currency_id } = req.body;

    // Validación 1: Campos obligatorios
    if (!full_name || !cbu || !currency_id) {
      return res.status(400).json({
        success: false,
        message: "El nombre completo, CBU y la divisa son obligatorios.",
      });
    }

    // Validación 2: Regla de negocio DDL (CBU de mínimo 10 caracteres)
    if (cbu.length < 10) {
      return res.status(400).json({
        success: false,
        message: "El CBU debe contener al menos 10 dígitos.",
      });
    }

    // Ejecutar el servicio
    const nuevoContacto = await agregarPayeeService(userId, {
      full_name,
      cbu,
      alias,
      currency_id,
    });

    return res.status(201).json({
      success: true,
      message: "Contacto agregado exitosamente.",
      data: nuevoContacto,
    });
  } catch (error) {
    console.error("Error al agregar destinatario:", error);

    // Si el error es de duplicado (lanzado por nuestro servicio), mandamos un 409 Conflict
    const statusCode = error.message.includes("registrado") ? 409 : 500;

    return res.status(statusCode).json({
      success: false,
      message: error.message || "Error interno al procesar la solicitud.",
    });
  }
};

const obtenerContactos = async (req, res) => {
  try {
    const userId = req.session.usuario.user_id;
    const contactos = await obtenerPayeesService(userId);

    return res.status(200).json({ success: true, data: contactos });
  } catch (error) {
    console.error("Error al obtener contactos:", error);
    return res.status(500).json({
      success: false,
      message: "Error al cargar la libreta de contactos.",
    });
  }
};

module.exports = { agregarContacto, obtenerContactos };
