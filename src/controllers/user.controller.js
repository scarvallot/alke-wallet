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

module.exports = {
  obtenerCuentasUsuarioORM,
};
