const {
  obtenerUsuarios: obtenerUsuariosService,
  validarCredenciales,
} = require("../services/services");

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

const mostrarLogin = (req, res) => {
  if (req.session.usuario) return res.redirect("/menu");
  res.render("auth/login", {
    tituloPagina: "Iniciar Sesión - Mi Wallet",
    tagline: "Bienvenido a tu billetera virtual",
    layout: "layouts/auth",
  });
};

const procesarLogin = (req, res) => {
  const { username, password } = req.body;
  const usuario = validarCredenciales(username, password);
  if (!usuario) {
    return res.render("auth/login", {
      tituloPagina: "Error - Mi Wallet",
      tagline: "Credenciales incorrectas. Por favor, intenta de nuevo.",
      layout: "layouts/auth",
    });
  }
  req.session.usuario = usuario;
  res.redirect("/menu");
};

const cerrarSesion = (req, res) => {
  req.session.destroy(() => {
    res.redirect("/login");
  });
};

module.exports = { obtenerUsuarios, mostrarLogin, procesarLogin, cerrarSesion };
