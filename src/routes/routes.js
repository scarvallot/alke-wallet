const express = require("express");
const router = express.Router();
const {
  protegerRuta,
  requerirAdmin,
  upload,
  verificarToken,
} = require("../middlewares/middlewares");

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
  obtenerDatosCuenta,
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
const {
  obtenerCuentasUsuarioORM,
  subirAvatar,
} = require("../controllers/user.controller");

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

//! 1. Ruta para la Interfaz Web (Lo que ve el usuario en su navegador)
// Utiliza "protegerRuta" (que revisa la sesión de cookies) y renderiza el HTML
router.get("/profile", protegerRuta, mostrarProfile);

//! 2. Ruta para la API y la Consigna de Evaluación (Lo que pruebas en Postman)
// Utiliza "verificarToken" (que revisa el JWT) y devuelve un JSON
router.get("/perfil", verificarToken, (req, res) => {
  res.status(200).json({
    success: true,
    message: "Acceso concedido a la ruta protegida.",
    perfil: req.usuario_jwt, // Mostramos los datos que venían dentro del token
  });
});
router.put("/profile/update", protegerRuta, actualizarPerfil);
router.put(
  "/profile/password",
  protegerRuta,
  verificarToken,
  actualizarPassword,
);
//! Obtener el CBU de las cuentas de usuario
router.get("/api/cuenta", protegerRuta, obtenerDatosCuenta);

//! Rutas de operaciones de la cartera y transacciones
router.get("/menu", protegerRuta, mostrarMenu);
router.get("/deposit", protegerRuta, mostrarDeposit);
router.post("/deposit", protegerRuta, realizarDeposito);
router.get("/sendmoney", protegerRuta, mostrarSendMoney);
router.get("/transaction", protegerRuta, mostrarTransaction);
router.get("/dashboard", protegerRuta, requerirAdmin, mostrarDashboardAdmin);

//! Rutas de API para operaciones de la cartera y transacciones
router.get("/api/saldo", protegerRuta, consultarSaldo);
router.post(
  "/api/transfer",
  protegerRuta,
  verificarToken,
  realizarTransferencia,
);
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
//! Ruta de API carga de Avatar
router.post(
  "/upload",
  protegerRuta, // Verificamos sesión
  upload.single("avatar"), // Multer procesa el archivo del campo "avatar"
  subirAvatar, // Nuestro controlador guarda en DB
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
