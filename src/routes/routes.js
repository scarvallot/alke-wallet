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
const { consultarSaldo } = require("../controllers/wallet.controller");
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

// Obtiene la lista de usuarios.
router.get("/usuarios", requerirAdmin, obtenerUsuarios);
router.put("/usuarios/:id", protegerRuta, requerirAdmin, actualizarUsuario);
router.delete("/usuarios/:id", protegerRuta, requerirAdmin, eliminarUsuario);

// Procesa las credenciales de acceso.
router.post("/login", procesarLogin);
// Registro asíncrono-compatible.
router.post("/register", registrarUsuario);
// Perfil y actualización de datos.
router.get("/profile", protegerRuta, mostrarProfile);
router.put("/profile/update", protegerRuta, actualizarPerfil);
router.put("/profile/password", protegerRuta, actualizarPassword);
// Cierra la sesión del usuario.
router.get("/logout", cerrarSesion);
// Ruta API para obtener el saldo (protegida)
router.get("/api/saldo", protegerRuta, consultarSaldo);

// Ruta para Gestion de usuarios
router.post(
  "/admin/usuarios/:id/delete",
  protegerRuta,
  requerirAdmin,
  desactivarUsuario,
);

// Redirige al menú o al inicio de sesión según el estado de la sesión.
// Muestra el formulario de inicio de sesión.
router.get("/", redireccionarInicio);
//  Muestra el formulario de inicio de sesión.
router.get("/login", mostrarLogin);
//  Muestra el formulario de registro de usuario.
router.get("/register", mostrarRegistro);
// Muestra el menú principal para usuarios autenticados.
router.get("/menu", protegerRuta, mostrarMenu);
// Muestra la vista para depositar dinero.
router.get("/deposit", protegerRuta, mostrarDeposit);
// Muestra la vista para enviar dinero.
router.get("/sendmoney", protegerRuta, mostrarSendMoney);
// Muestra el historial de transacciones.
router.get("/transaction", protegerRuta, mostrarTransaction);
//  Muestra el panel de administración para usuarios con privilegios.
router.get("/dashboard", requerirAdmin, mostrarDashboardAdmin);
// Verifica que el servidor esté funcionando.
router.get("/status", verificarStatus);

module.exports = router;
