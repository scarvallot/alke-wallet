const {
  obtenerUsuarios: obtenerUsuariosService,
  validarCredenciales,
  obtenerSaldoUsuario,
  eliminarUsuarioAdmin,
} = require("../services/services");

// Obtiene usuarios aplicando filtros y paginación.
const obtenerUsuarios = async (req, res) => {
  try {
    const { nombre, page, limit } = req.query;
    const resultado = await obtenerUsuariosService({ nombre, page, limit });
    res.status(200).json({
      status: "success",
      message: "Usuarios obtenidos correctamente",
      meta: resultado.meta,
      data: resultado.data,
    });
  } catch (error) {
    console.error("Error al consultar la tabla Users:", error);
    res.status(500).json({
      status: "error",
      message: "Error interno del servidor",
      data: null,
    });
  }
};

// Muestra la pantalla de inicio de sesión.
const mostrarLogin = (req, res) => {
  if (req.session.usuario) return res.redirect("/menu");
  res.render("auth/login", {
    tituloPagina: "Iniciar Sesión - Mi Wallet",
    tagline: "Bienvenido a tu billetera virtual",
    layout: "layouts/auth",
  });
};

// Valida las credenciales e inicia la sesión.
const procesarLogin = async (req, res) => {
  const { username, password } = req.body;

  const usuario = await validarCredenciales(username, password);
  if (!usuario) {
    return res.render("auth/login", {
      tituloPagina: "Error - Mi Wallet",
      tagline: "Credenciales incorrectas. Por favor, intenta de nuevo.",
      layout: "layouts/auth",
    });
  }

  // Si todo está bien, guardamos el usuario real de la BD en la sesión
  req.session.usuario = usuario;
  res.redirect("/menu");
};

// Endpoint API para consultar el saldo
const consultarSaldo = async (req, res) => {
  try {
    // Tomamos el user_id de la sesión protegida
    const userId = req.session.usuario.user_id;
    const saldoData = await obtenerSaldoUsuario(userId);

    res.status(200).json(saldoData);
  } catch (error) {
    console.error("Error al obtener saldo:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Renderizar la tabla de administración con soporte para filtros
const mostrarDashboardAdmin = async (req, res) => {
  try {
    // 1. Capturamos el parámetro 'nombre' desde la URL (ej: ?nombre=texto)
    const filtroNombre = req.query.nombre || "";

    // 2. Pasamos el filtro al servicio de búsqueda/paginación
    const resultado = await obtenerUsuariosService({
      page: 1,
      limit: 10,
      nombre: filtroNombre, // Enviamos el filtro a la lógica de base de datos
    });

    // 3. Renderizamos la vista enviando los datos y el valor del filtro actual
    res.render("dashboard/dashboard", {
      tituloPagina: "Panel de Administración",
      usuarios: resultado.data,
      jsFile: "/js/dashboard.js",
      nombreFiltro: filtroNombre, // mantener el texto escrito en tu input de búsqueda
    });
  } catch (error) {
    console.error("Error al cargar el panel de administración:", error);
    res.status(500).send("Error al cargar el panel.");
  }
};

// Procesar el borrado lógico
const desactivarUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    await eliminarUsuarioAdmin(id);
    res.redirect("/admin/usuarios");
  } catch (error) {
    res.status(500).send("Error al desactivar el usuario.");
  }
};

// Destruye la sesión actual y redirige al inicio.
const cerrarSesion = (req, res) => {
  req.session.destroy(() => {
    res.redirect("/login");
  });
};

// Redirige al menú o al inicio de sesión según el estado de la sesión.
const redireccionarInicio = (req, res) => {
  if (req.session.usuario) {
    return res.redirect("/menu"); // Si ya inició sesión, va al menú
  }
  res.redirect("/login"); // Si no, va al login
};

// Muestra el menú principal para usuarios autenticados.
const mostrarMenu = (req, res) => {
  res.render("menu/menu", {
    tituloPagina: "Menú Principal - Mi Wallet",
    jsFile: "/js/menu.js",
  });
};

// Muestra la vista para depositar dinero.
const mostrarDeposit = (req, res) => {
  res.render("deposit/deposit", {
    tituloPagina: "Depositar Dinero - Mi Wallet",
    jsFile: "/js/deposit.js",
  });
};

// Muestra la vista para enviar dinero.
const mostrarSendMoney = (req, res) => {
  res.render("sendmoney/sendmoney", {
    tituloPagina: "Enviar Dinero - Mi Wallet",
    jsFile: "/js/sendmoney.js",
  });
};

// Muestra el historial de transacciones.
const mostrarTransaction = (req, res) => {
  res.render("transaction/transaction", {
    tituloPagina: "Historial de Transacciones - Mi Wallet",
    jsFile: "/js/transaction.js",
  });
};

// Verifica que el servidor esté funcionando.
const verificarStatus = (req, res) => {
  res.status(200).json({
    estado: "activo",
    mensaje: "Servidor funcionando correctamente",
    fecha: new Date().toISOString(),
  });
};

module.exports = {
  obtenerUsuarios,
  mostrarLogin,
  procesarLogin,
  consultarSaldo,
  mostrarDashboardAdmin,
  desactivarUsuario,
  cerrarSesion,
  redireccionarInicio,
  mostrarMenu,
  mostrarDeposit,
  mostrarSendMoney,
  mostrarTransaction,
  verificarStatus,
};
