const { validarCredenciales } = require("../services/services");

const mostrarLogin = (req, res) => {
  if (req.session.usuario) return res.redirect("/menu");
  res.render("auth/login", {
    tituloPagina: "Iniciar Sesión - Mi Wallet",
    tagline: "Bienvenido a tu billetera virtual",
    layout: "layouts/auth",
  });
};

const procesarLogin = async (req, res) => {
  const { username, password } = req.body;
  const usuario = await validarCredenciales(username, password);

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

module.exports = { mostrarLogin, procesarLogin, cerrarSesion };
