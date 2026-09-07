const express = require("express");
const router = express.Router();
const { protegerRuta } = require("../middlewares/middlewares");
const {
  obtenerUsuarios,
  mostrarLogin,
  procesarLogin,
  cerrarSesion,
} = require("../controllers/controller");

// Obtiene la lista de usuarios.
router.get("/usuarios", obtenerUsuarios);
// Muestra el formulario de inicio de sesión.
router.get("/login", mostrarLogin);
// Procesa las credenciales de acceso.
router.post("/login", procesarLogin);
// Cierra la sesión del usuario.
router.get("/logout", cerrarSesion);

// Redirige al menú o al inicio de sesión según el estado de la sesión.
router.get("/", (req, res) => {
  if (req.session.usuario) {
    return res.redirect("/menu"); // Si ya inició sesión, va al menú
  }
  res.redirect("/login"); // Si no, va al login
});

// Muestra el menú principal para usuarios autenticados.
router.get("/menu", protegerRuta, (req, res) => {
  res.render("menu/menu", {
    tituloPagina: "Menú Principal - Mi Wallet",
    jsFile: "/js/menu.js",
  });
});

// Muestra la vista para depositar dinero.
router.get("/deposit", protegerRuta, (req, res) => {
  res.render("deposit/deposit", {
    tituloPagina: "Depositar Dinero - Mi Wallet",
    jsFile: "/js/deposit.js",
  });
});

// Muestra la vista para enviar dinero.
router.get("/sendmoney", protegerRuta, (req, res) => {
  res.render("sendmoney/sendmoney", {
    tituloPagina: "Enviar Dinero - Mi Wallet",
    jsFile: "/js/sendmoney.js",
  });
});

// Muestra el historial de transacciones.
router.get("/transaction", protegerRuta, (req, res) => {
  res.render("transaction/transaction", {
    tituloPagina: "Historial de Transacciones - Mi Wallet",
    jsFile: "/js/transaction.js",
  });
});

// Verifica que el servidor esté funcionando.
router.get("/status", (req, res) => {
  res.status(200).json({
    estado: "activo",
    mensaje: "Servidor funcionando correctamente",
    fecha: new Date().toISOString(),
  });
});

module.exports = router;
