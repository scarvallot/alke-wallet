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
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Por favor, selecciona una imagen para subir.",
      });
    }
    const userId = req.session.usuario.user_id;
    const nuevoAvatarUrl = `/uploads/${req.file.filename}`;

    const usuario = await User.findByPk(userId, { attributes: ["avatar"] });

    if (usuario && usuario.avatar) {
      // 1. Le quitamos el "/" inicial a la URL si lo tiene (para que no rompa el path.join en Windows)
      const rutaRelativa = usuario.avatar.startsWith("/")
        ? usuario.avatar.substring(1)
        : usuario.avatar;
      // 2. Construimos la ruta física absoluta de forma segura
      const rutaAvatarViejo = path.join(process.cwd(), "public", rutaRelativa);

      //  console.log("Buscando imagen antigua en:", rutaAvatarViejo);
      // 3. Verificamos y eliminamos
      if (fs.existsSync(rutaAvatarViejo)) {
        fs.unlinkSync(rutaAvatarViejo);
        //  console.log("Avatar anterior eliminado del disco duro.");
      } else {
        //  console.log("La imagen antigua no se encontró físicamente.");
      }
    }

    // Guardar la nueva ruta en la BD
    await User.update(
      { avatar: nuevoAvatarUrl },
      { where: { user_id: userId } },
    );
    // Actualizar la sesión
    req.session.usuario.avatar = nuevoAvatarUrl;

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
