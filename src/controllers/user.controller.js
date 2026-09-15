const fs = require("fs");
const path = require("path");
const { User, Account } = require("../models"); // Importamos los modelos

const obtenerCuentasUsuarioORM = async (req, res) => {
  try {
    const { id } = req.params;

    // findByPk recupera el usuario principal por su clave primaria e incluye sus cuentas
    const usuarioConCuentas = await User.findByPk(id, {
      attributes: ["user_id", "first_name", "last_name", "email"],
      include: [
        {
          model: Account,
          as: "cuentas",
          attributes: ["account_id", "cbu", "current_balance", "is_default"],
        },
      ],
    });

    if (!usuarioConCuentas) {
      return res.status(404).json({
        success: false,
        message: "El usuario no existe.",
      });
    }

    // Retorna el JSON estructurado automáticamente por el ORM
    res.status(200).json({
      success: true,
      data: usuarioConCuentas,
    });
  } catch (error) {
    console.error("Error ORM Relacional:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const subirAvatar = async (req, res) => {
  try {
    // 1. Validar que multer haya procesado un archivo
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Por favor, selecciona una imagen para subir.",
      });
    }
    const userId = req.session.usuario.user_id;
    const nuevoAvatarUrl = `/uploads/${req.file.filename}`;

    // 2. Buscar el avatar anterior en la Base de Datos ANTES de sobrescribirlo
    const usuario = await User.findByPk(userId, { attributes: ["avatar"] });
    if (usuario && usuario.avatar) {
      // Construir la ruta física completa del archivo viejo
      const rutaAvatarViejo = path.join(
        process.cwd(),
        "public",
        usuario.avatar,
      );

      // Verificar si el archivo viejo existe físicamente y borrarlo
      if (fs.existsSync(rutaAvatarViejo)) {
        fs.unlinkSync(rutaAvatarViejo);
        //console.log("Avatar anterior eliminado del servidor:", rutaAvatarViejo);
      }
    }

    // 3. Guardar la nueva ruta en la base de datos (Modelo User)
    await User.update(
      { avatar: nuevoAvatarUrl },
      { where: { user_id: userId } },
    );
    // 4. Actualizar la memoria de la sesión
    req.session.usuario.avatar = nuevoAvatarUrl;
    // 5. Forzar el guardado físico de la sesión antes de responder
    req.session.save((err) => {
      if (err) console.error("Error al guardar sesión:", err);

      return res.status(200).json({
        success: true,
        message: "Imagen de perfil actualizada correctamente.",
        url: nuevoAvatarUrl,
      });
    });
  } catch (error) {
    console.error("Error al subir archivo:", error);
    return res.status(500).json({
      success: false,
      message: "Error interno al procesar la imagen.",
    });
  }
};

module.exports = {
  obtenerCuentasUsuarioORM,
  subirAvatar,
};
