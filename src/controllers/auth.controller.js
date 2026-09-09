const {
  validarCredenciales,
  registrarUsuarioService,
  actualizarPerfilUsuario,
  actualizarPasswordUsuario,
} = require("../services/user.service");

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

const registrarUsuario = async (req, res) => {
  try {
    const { first_name, last_name, user_name, email, password } = req.body;

    if (!first_name || !last_name || !user_name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Todos los campos son obligatorios.",
      });
    }

    await registrarUsuarioService({
      first_name,
      last_name,
      user_name,
      email,
      password,
    });

    return res.status(201).json({
      success: true,
      message: "Registro exitoso.",
      redirect: "/login",
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

const actualizarPerfil = async (req, res) => {
  try {
    const userId = req.session.usuario.user_id;
    const { first_name, last_name, email } = req.body;

    await actualizarPerfilUsuario(userId, { first_name, last_name, email });

    return res.status(200).json({
      success: true,
      message: "Perfil actualizado correctamente.",
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "No se pudo actualizar el perfil.",
    });
  }
};

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
