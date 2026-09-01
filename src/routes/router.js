const express = require("express");
const router = express.Router();
const { obtenerUsuarios } = require("../controllers/usersController");

router.get("/", (req, res) => {
  res.render("auth/login", {
    tituloPagina: "Iniciar Sesión - Mi Wallet",
    tagline: "Bienvenido a tu billetera virtual",
    layout: "layouts/auth",
  });
});

router.get("/status", (req, res) => {
  res.status(200).json({
    estado: "activo",
    mensaje: "Servidor funcionando correctamente",
    fecha: new Date().toISOString(),
  });
});

// Obtener usuarios desde la BD
router.get("/usuarios", obtenerUsuarios);

module.exports = router;
