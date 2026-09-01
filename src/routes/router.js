const express = require("express");
const router = express.Router();
const { obtenerUsuarios } = require("../controllers/usersController");

// 1. MIDDLEWARE DE PROTECCIÓN DE RUTAS
const protegerRuta = (req, res, next) => {
  if (!req.session.usuario) {
    return res.redirect("/login");
  }
  next();
};

// 2. RUTAS PÚBLICAS (No requieren sesión)
// Ruta raíz: Redirige inteligentemente
router.get("/", (req, res) => {
  if (req.session.usuario) {
    return res.redirect("/menu"); // Si ya inició sesión, va al menú
  }
  res.redirect("/login"); // Si no, va al login
});

// Ruta de Login real
router.get("/login", (req, res) => {
  res.render("auth/login", {
    tituloPagina: "Iniciar Sesión - Mi Wallet",
    tagline: "Bienvenido a tu billetera virtual",
    layout: "layouts/auth",
  });
});
// Procesar el formulario de inicio de sesión
router.post("/login", (req, res) => {
  // Capturamos los datos enviados desde el formulario HTML (gracias al atributo "name")
  const { username, password } = req.body;

  // Validación estática basada en tus credenciales de prueba
  if (username === "admin" && password === "12345") {
    // 1. Crear la sesión del usuario
    req.session.usuario = {
      id: 1,
      username: username,
      nombre: "Usuario Administrador",
    };

    // 2. Redirigir al área privada
    return res.redirect("/menu");
  } else {
    // Si las credenciales fallan, recargamos la vista de login inyectando un mensaje de error
    return res.render("auth/login", {
      tituloPagina: "Error - Mi Wallet",
      tagline: "Credenciales incorrectas. Por favor, intenta de nuevo.",
      layout: "layouts/auth",
    });
  }
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

// Obtener usuarios desde la BD
router.get("/usuarios", obtenerUsuarios);

// Ruta para cerrar sesión (imprescindible ahora que tienes el botón)
router.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    res.redirect("/login");
  });
});

module.exports = router;
