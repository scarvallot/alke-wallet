const {
  obtenerUsuarios: obtenerUsuariosService,
  eliminarUsuarioAdmin,
  actualizarUsuarioService,
} = require("../services/user.service");

// Devuelve JSON para búsquedas, filtros y paginación asíncrona
const obtenerUsuarios = async (req, res) => {
  try {
    const { nombre, page, limit } = req.query;
    const resultado = await obtenerUsuariosService({ nombre, page, limit });
    return res.status(200).json({
      status: "success",
      message: "Usuarios obtenidos correctamente",
      meta: resultado.meta,
      data: resultado.data,
    });
  } catch (error) {
    console.error("Error al consultar la tabla Users:", error);
    return res.status(500).json({
      status: "error",
      message: "Error interno del servidor",
      data: null,
    });
  }
};

// Modificación y baja lógica
const actualizarUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const { user_name, first_name, last_name, email } = req.body;

    if (!first_name || !last_name || !email) {
      return res.status(400).json({
        success: false,
        message: "Los campos first_name, last_name y email son obligatorios.",
      });
    }

    await actualizarUsuarioService(id, {
      user_name,
      first_name,
      last_name,
      email,
    });
    return res.status(200).json({
      success: true,
      message: "Usuario actualizado correctamente.",
    });
  } catch (error) {
    console.error("Error al actualizar el usuario:", error);
    const statusCode = error.message?.includes("no existe") ? 404 : 500;
    return res.status(statusCode).json({
      success: false,
      message: error.message || "Error interno al procesar la actualización.",
    });
  }
};

const eliminarUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    await eliminarUsuarioAdmin(id);

    return res.status(200).json({
      success: true,
      message: "Usuario desactivado correctamente.",
    });
  } catch (error) {
    console.error("Error al desactivar el usuario:", error);
    const statusCode = error.message?.includes("no existe") ? 404 : 500;
    return res.status(statusCode).json({
      success: false,
      message: error.message || "Error interno al procesar la desactivación.",
    });
  }
};

const desactivarUsuario = async (req, res) => {
  return eliminarUsuario(req, res);
};

module.exports = {
  obtenerUsuarios,
  actualizarUsuario,
  eliminarUsuario,
  desactivarUsuario,
};
