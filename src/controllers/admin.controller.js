const {
  obtenerUsuarios: obtenerUsuariosService,
  eliminarUsuarioAdmin,
} = require("../services/user.service");

const obtenerUsuarios = async (req, res) => {
  try {
    const { nombre, page, limit } = req.query;
    const resultado = await obtenerUsuariosService({ nombre, page, limit });
    res.status(200).json({
      status: "success",
      message: "Usuarios obtenidos correctamente",
      meta: resultado.meta,
      data: resultado.data,
    });
  } catch (error) {
    console.error("Error al consultar la tabla Users:", error);
    res.status(500).json({
      status: "error",
      message: "Error interno del servidor",
      data: null,
    });
  }
};

const mostrarDashboardAdmin = async (req, res) => {
  try {
    const filtroNombre = req.query.nombre || "";
    const resultado = await obtenerUsuariosService({
      page: 1,
      limit: 10,
      nombre: filtroNombre,
    });

    res.render("dashboard/dashboard", {
      tituloPagina: "Panel de Administración",
      usuarios: resultado.data,
      jsFile: "/js/dashboard.js",
      nombreFiltro: filtroNombre,
    });
  } catch (error) {
    console.error("Error al cargar el panel de administración:", error);
    res.status(500).send("Error al cargar el panel.");
  }
};

const desactivarUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    // Llama al servicio que ahora valida la existencia del ID
    await eliminarUsuarioAdmin(id);

    return res.status(200).json({
      success: true,
      message: "Usuario desactivado correctamente.",
    });
  } catch (error) {
    console.error("Error al desactivar el usuario:", error);

    // Si el error proviene de que el usuario no existe, devolvemos 404
    const statusCode = error.message.includes("no existe") ? 404 : 500;
    return res.status(statusCode).json({
      success: false,
      message: error.message || "Error interno al procesar la desactivación.",
    });
  }
};

module.exports = { obtenerUsuarios, mostrarDashboardAdmin, desactivarUsuario };
