const { obtenerPerfilUsuario } = require("../services/user.service");

// VISTAS PÚBLICAS / AUTENTICACIÓN
const redireccionarInicio = (req, res) => {
  if (req.session.usuario) return res.redirect("/menu");
  res.redirect("/login");
};

const mostrarLogin = (req, res) => {
  if (req.session.usuario) return res.redirect("/menu");
  res.render("auth/login", {
    tituloPagina: "Iniciar Sesión - Mi Wallet",
    tagline: "Bienvenido a tu billetera virtual",
    layout: "layouts/auth",
    jsFile: "/js/login.js", 
  });
};

const mostrarRegistro = (req, res) => {
  if (req.session.usuario) return res.redirect("/menu");
  res.render("auth/register", {
    tituloPagina: "Registro - Mi Wallet",
    tagline: "Crea tu cuenta gratis",
    layout: "layouts/auth",
    jsFile: "/js/register.js", 
  });
};

// VISTAS PRIVADAS (Requieren sesión)
const mostrarMenu = (req, res) => {
  res.render("menu/menu", {
    tituloPagina: "Menú Principal - Mi Wallet",
    jsFile: "/js/menu.js",
  });
};

const mostrarDeposit = (req, res) => {
  res.render("deposit/deposit", {
    tituloPagina: "Depositar Dinero - Mi Wallet",
    jsFile: "/js/deposit.js",
  });
};

const mostrarSendMoney = (req, res) => {
  res.render("sendmoney/sendmoney", {
    tituloPagina: "Enviar Dinero - Mi Wallet",
    jsFile: "/js/sendmoney.js",
  });
};

const mostrarTransaction = (req, res) => {
  res.render("transaction/transaction", {
    tituloPagina: "Historial de Transacciones - Mi Wallet",
    jsFile: "/js/transaction.js",
  });
};

const mostrarProfile = async (req, res) => {
  try {
    const usuario = await obtenerPerfilUsuario(req.session.usuario.user_id);
    return res.render("auth/profile", {
      tituloPagina: "Mi Perfil - Mi Wallet",
      jsFile: "/js/profile.js",
      usuario, 
    });
  } catch (error) {
    console.error("Error al mostrar perfil:", error);
    return res.status(500).send("Error interno al cargar el perfil");
  }
};


// UTILIDADES
const verificarStatus = (req, res) => {
  res.status(200).json({
    estado: "activo",
    mensaje: "Servidor funcionando correctamente",
    fecha: new Date().toISOString(),
  });
};

module.exports = {
  redireccionarInicio,
  mostrarLogin,
  mostrarRegistro,
  mostrarMenu,
  mostrarDeposit,
  mostrarSendMoney,
  mostrarTransaction,
  mostrarProfile,
  verificarStatus,
};
