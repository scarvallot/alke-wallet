const express = require("express");
const router = express.Router();
const { protegerRuta, requerirAdmin } = require("../middlewares/middlewares");
// Importaciones modulares desde los nuevos controladores
// Controlador de autenticación: login, logout y sesión.
const {
  procesarLogin,
  registrarUsuario,
  actualizarPerfil,
  actualizarPassword,
  cerrarSesion,
} = require("../controllers/auth.controller");
// Controlador administrativo: usuarios y panel de administración.
const {
  obtenerUsuarios,
  actualizarUsuario,
  eliminarUsuario,
  desactivarUsuario,
} = require("../controllers/admin.controller");
// Controlador de cartera: consulta del saldo del usuario.
const {
  consultarSaldo,
  realizarTransferencia,
  realizarDeposito,
  obtenerHistorial,
} = require("../controllers/wallet.controller");
// Controlador de vistas: redirecciones y render de páginas.
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

//! Rutas de administración de usuarios
//  Obtiene la lista de usuarios.
router.get("/usuarios", obtenerUsuarios);
router.put("/usuarios/:id", actualizarUsuario);
router.delete("/usuarios/:id", eliminarUsuario);

//! Redirecciones y vistas
// Muestra el formulario de inicio de sesión.
router.get("/", redireccionarInicio);

//! Rutas de autenticación y gestión de sesión
//  Muestra el formulario de inicio de sesión.
router.get("/login", mostrarLogin);
// Procesa las credenciales de acceso.
router.post("/login", procesarLogin);
// Cierra la sesión del usuario.
router.get("/logout", cerrarSesion);

//! Rutas de Registro de perfil de usuario
//  Muestra el formulario de registro de usuario.
router.get("/register", mostrarRegistro);
// Registro asíncrono-compatible.
router.post("/register", registrarUsuario);

//! Rutas de perfil y actualización de datos
// Perfil y actualización de datos.
router.get("/profile", protegerRuta, mostrarProfile);
router.put("/profile/update", protegerRuta, actualizarPerfil);
router.put("/profile/password", protegerRuta, actualizarPassword);

//! Rutas de operaciones de la cartera y transacciones
// Muestra el menú principal para usuarios autenticados.
router.get("/menu", protegerRuta, mostrarMenu);
// Muestra la vista para depositar dinero.
router.get("/deposit", protegerRuta, mostrarDeposit);
// Procesa el depósito de dinero para la cuenta principal del usuario autenticado.
router.post("/deposit", protegerRuta, realizarDeposito);
// Muestra la vista para enviar dinero.
router.get("/sendmoney", protegerRuta, mostrarSendMoney);
// Muestra el historial de transacciones.
router.get("/transaction", protegerRuta, mostrarTransaction);
//  Muestra el panel de administración para usuarios con privilegios.
router.get("/dashboard", protegerRuta, requerirAdmin, mostrarDashboardAdmin);

//! Rutas de API para operaciones de la cartera y transacciones
// Ruta API para obtener el saldo (protegida)
router.get("/api/saldo", protegerRuta, consultarSaldo);
// Ruta API para procesar la transferencia de dinero (protegida)
router.post("/api/transfer", protegerRuta, realizarTransferencia);
//  Ruta API para procesar el depósito de dinero (protegida)
router.get("/api/transactions", protegerRuta, obtenerHistorial);

//! Ruta de verificación de estado del servidor
// Verifica que el servidor esté funcionando.
router.get("/status", verificarStatus);

// Ruta para Gestion de usuarios
router.post(
  "/admin/usuarios/:id/delete",
  protegerRuta,
  requerirAdmin,
  desactivarUsuario,
);

module.exports = router;
