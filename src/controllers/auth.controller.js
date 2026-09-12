const {
  validarCredenciales,
  registrarUsuarioService,
  actualizarPerfilUsuario,
  actualizarPasswordUsuario,
} = require("../services/user.service");

// Inicia sesión validando usuario y contraseña y guardando datos en sesión.
const procesarLogin = async (req, res) => {
  const { username, password } = req.body;
  const usuario = await validarCredenciales(username, password);

  if (!usuario) {
    return res.status(401).json({
      success: false,
      message: "Credenciales incorrectas. Por favor, intenta de nuevo.",
    });
  }
  req.session.usuario = usuario;
  return res.status(200).json({
    success: true,
    redirect: "/menu",
  });
};

// Registra al usuario y lo deja autenticado de forma inmediata.
const registrarUsuario = async (req, res) => {
  try {
    const { first_name, last_name, user_name, email, password } = req.body;

    if (!first_name || !last_name || !user_name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Todos los campos son obligatorios.",
      });
    }

    // 1. Ejecutamos el servicio transaccional y capturamos el ID generado
    const nuevoUserId = await registrarUsuarioService({
      first_name,
      last_name,
      user_name,
      email,
      password,
    });

    // 2. Autenticación automática: Inyectamos los datos en la sesión activa
    req.session.usuario = {
      user_id: nuevoUserId,
      user_name: user_name,
      first_name: first_name,
      last_name: last_name,
      email: email,
    };

    // 3. Redirigimos directamente al dashboard/menú en lugar del login
    return res.status(201).json({
      success: true,
      message: "Registro exitoso. Iniciando sesión...",
      redirect: "/menu",
    });
  } catch (error) {
    console.error("Error al registrar usuario:", error);
    return res.status(409).json({
      success: false,
      message:
        "No se pudo registrar el usuario. Verifica email o usuario duplicado.",
    });
  }
};

// Actualiza el perfil y sincroniza el estado visible de la sesión.
const actualizarPerfil = async (req, res) => {
  try {
    const userId = req.session.usuario?.user_id;
    if (!userId) {
      return res
        .status(401)
        .json({ success: false, message: "Sesión expirada." });
    }

    const { first_name, last_name, email } = req.body;
    await actualizarPerfilUsuario(userId, { first_name, last_name, email });

    // Actualizar también los datos en la sesión activa para mantener coherencia en la interfaz
    req.session.usuario.first_name = first_name;
    req.session.usuario.last_name = last_name;
    req.session.usuario.email = email;

    return res.status(200).json({
      success: true,
      message: "Perfil actualizado correctamente.",
    });
  } catch (error) {
    console.error("Error detallado al actualizar perfil:", error);
    return res.status(400).json({
      success: false,
      message: error.message || "No se pudo actualizar el perfil.",
    });
  }
};

// Cambia la contraseña del usuario autenticado.
const actualizarPassword = async (req, res) => {
  try {
    const userId = req.session.usuario.user_id;
    const { current_password, new_password } = req.body;

    await actualizarPasswordUsuario(userId, current_password, new_password);

    return res.status(200).json({
      success: true,
      message: "Contraseña actualizada correctamente.",
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message || "No se pudo actualizar la contraseña.",
    });
  }
};

// Cierra la sesión y redirige al login.
const cerrarSesion = (req, res) => {
  req.session.destroy(() => {
    res.redirect("/login");
  });
};

module.exports = {
  procesarLogin,
  registrarUsuario,
  actualizarPerfil,
  actualizarPassword,
  cerrarSesion,
};
