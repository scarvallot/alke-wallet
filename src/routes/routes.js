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
  mostrarDashboardAdmin,
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
  verificarStatus,
} = require("../controllers/views.controller");

// Obtiene la lista de usuarios.
router.get("/usuarios", obtenerUsuarios);

// Muestra el formulario de inicio de sesión.
router.get("/login", mostrarLogin);
// Procesa las credenciales de acceso.
router.post("/login", procesarLogin);
// Registro asíncrono-compatible.
router.post("/register", registrarUsuario);
router.get("/register", mostrarRegistro);
// Perfil y actualización de datos.
router.get("/profile", protegerRuta, mostrarProfile);
router.put("/profile/update", protegerRuta, actualizarPerfil);
router.put("/profile/password", protegerRuta, actualizarPassword);
// Cierra la sesión del usuario.
router.get("/logout", cerrarSesion);
// Ruta API para obtener el saldo (protegida)
router.get("/api/saldo", protegerRuta, consultarSaldo);
// Ruta para Gestion de usuarios
router.get("/admin/usuarios", requerirAdmin, mostrarDashboardAdmin);

router.post(
  "/admin/usuarios/:id/delete",
  protegerRuta,
  requerirAdmin,
  desactivarUsuario,
);

// Redirige al menú o al inicio de sesión según el estado de la sesión.
router.get("/", redireccionarInicio);
// Muestra el menú principal para usuarios autenticados.
router.get("/menu", protegerRuta, mostrarMenu);
// Muestra la vista para depositar dinero.
router.get("/deposit", protegerRuta, mostrarDeposit);
// Muestra la vista para enviar dinero.
router.get("/sendmoney", protegerRuta, mostrarSendMoney);
// Muestra el historial de transacciones.
router.get("/transaction", protegerRuta, mostrarTransaction);
// Verifica que el servidor esté funcionando.
router.get("/status", verificarStatus);

module.exports = router;
