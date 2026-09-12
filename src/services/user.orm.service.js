const User = require("../models/User");

const obtenerUsuariosORM = async () => {
  try {
    // Equivalente a SELECT * FROM Users, pero excluyendo la contraseña por seguridad
    const usuarios = await User.findAll({
      attributes: { exclude: ["password"] },
      where: {
        is_active: 1,
      },
      order: [["created_at", "DESC"]],
    });
    return usuarios;
  } catch (error) {
    throw new Error(
      "Error al obtener usuarios con Sequelize: " + error.message,
    );
  }
};

module.exports = { obtenerUsuariosORM };
