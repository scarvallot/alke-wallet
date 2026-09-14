const express = require("express");
const router = express.Router();
const { protegerRuta, requerirAdmin } = require("../middlewares/middlewares");

// Importaciones modulares desde los nuevos controladores
const {
  procesarLogin,
  registrarUsuario,
  actualizarPerfil,
  actualizarPassword,
  cerrarSesion,
} = require("../controllers/auth.controller");

const {
  obtenerUsuarios,
  actualizarUsuario,
  eliminarUsuario,
  desactivarUsuario,
} = require("../controllers/admin.controller");

const {
  consultarSaldo,
  realizarTransferencia,
  realizarDeposito,
  obtenerHistorial,
} = require("../controllers/wallet.controller");

const {
  agregarContacto,
  obtenerContactos,
} = require("../controllers/payee.controller");

const {
  redireccionarInicio,
  mostrarLogin,
  mostrarRegistro,
  mostrarMenu,
  mostrarDeposit,
  mostrarSendMoney,
  mostrarTransaction,
  mostrarProfile,
  mostrarDashboardAdmin,
  verificarStatus,
} = require("../controllers/views.controller");

// NUEVA IMPORTACIÓN: Controlador de Usuarios (ORM)
const { obtenerCuentasUsuarioORM } = require("../controllers/user.controller");

//! Rutas de administración de usuarios
router.get("/usuarios", obtenerUsuarios);
router.put("/usuarios/:id", actualizarUsuario);
router.delete("/usuarios/:id", eliminarUsuario);

//! Redirecciones y vistas
router.get("/", redireccionarInicio);

//! Rutas de autenticación y gestión de sesión
router.get("/login", mostrarLogin);
router.post("/login", procesarLogin);
router.get("/logout", cerrarSesion);

//! Rutas de Registro de perfil de usuario
router.get("/register", mostrarRegistro);
router.post("/register", registrarUsuario);

//! Rutas de perfil y actualización de datos
router.get("/profile", protegerRuta, mostrarProfile);
router.put("/profile/update", protegerRuta, actualizarPerfil);
router.put("/profile/password", protegerRuta, actualizarPassword);

//! Rutas de operaciones de la cartera y transacciones
router.get("/menu", protegerRuta, mostrarMenu);
router.get("/deposit", protegerRuta, mostrarDeposit);
router.post("/deposit", protegerRuta, realizarDeposito);
router.get("/sendmoney", protegerRuta, mostrarSendMoney);
router.get("/transaction", protegerRuta, mostrarTransaction);
router.get("/dashboard", protegerRuta, requerirAdmin, mostrarDashboardAdmin);

//! Rutas de API para operaciones de la cartera y transacciones
router.get("/api/saldo", protegerRuta, consultarSaldo);
router.post("/api/transfer", protegerRuta, realizarTransferencia);
router.get("/api/transactions", protegerRuta, obtenerHistorial);

//! Rutas de API para agenda de contactos
router.get("/api/contacts", protegerRuta, obtenerContactos);
router.post("/api/contacts", protegerRuta, agregarContacto);

//! Rutas de API ORM (Consultas relacionales con Sequelize)
router.get(
  "/api/orm/users/:id/accounts",
  protegerRuta,
  obtenerCuentasUsuarioORM,
);

//! Ruta de verificación de estado del servidor
router.get("/status", verificarStatus);

// Ruta para Gestion de usuariosS
router.post(
  "/admin/usuarios/:id/delete",
  protegerRuta,
  requerirAdmin,
  desactivarUsuario,
);

module.exports = router;
