const express = require("express");
const router = express.Router();
const { protegerRuta } = require("../middlewares/middlewares");
const {
  obtenerUsuarios,
  mostrarLogin,
  procesarLogin,
  cerrarSesion,
} = require("../controllers/controller");

router.get("/usuarios", obtenerUsuarios);
router.get("/login", mostrarLogin);
router.post("/login", procesarLogin);
router.get("/logout", cerrarSesion);

router.get("/", (req, res) => {
  if (req.session.usuario) {
    return res.redirect("/menu"); // Si ya inició sesión, va al menú
  }
  res.redirect("/login"); // Si no, va al login
});
// 3. RUTAS PRIVADAS (Usan el middleware)
// Nota cómo inyectamos "protegerRuta" como segundo parámetro
router.get("/menu", protegerRuta, (req, res) => {
  res.render("menu/menu", {
    tituloPagina: "Menú Principal - Mi Wallet",
    jsFile: "/js/menu.js",
  });
});

router.get("/deposit", protegerRuta, (req, res) => {
  res.render("deposit/deposit", {
    tituloPagina: "Depositar Dinero - Mi Wallet",
    jsFile: "/js/deposit.js",
  });
});

router.get("/sendmoney", protegerRuta, (req, res) => {
  res.render("sendmoney/sendmoney", {
    tituloPagina: "Enviar Dinero - Mi Wallet",
    jsFile: "/js/sendmoney.js",
  });
});

router.get("/transaction", protegerRuta, (req, res) => {
  res.render("transaction/transaction", {
    tituloPagina: "Historial de Transacciones - Mi Wallet",
    jsFile: "/js/transaction.js",
  });
});

router.get("/status", (req, res) => {
  res.status(200).json({
    estado: "activo",
    mensaje: "Servidor funcionando correctamente",
    fecha: new Date().toISOString(),
  });
});

module.exports = router;
