const { Op } = require("sequelize");
const sequelize = require("../config/sequelize"); // Tu instancia de conexión
const { User, Account } = require("../models");

const obtenerUsuarios = async ({ nombre, page, limit }) => {
  const parsedPage = parseInt(page) || 1;
  const parsedLimit = parseInt(limit) || 10;
  const offset = (parsedPage - 1) * parsedLimit;

  // Construcción dinámica de la condición WHERE[cite: 15]
  const whereClause = {};
  if (nombre) {
    whereClause.user_name = { [Op.like]: `%${nombre}%` };
  }

  // Sequelize ejecuta el COUNT y el SELECT simultáneamente
  const { count, rows } = await User.findAndCountAll({
    where: whereClause,
    limit: parsedLimit,
    offset: offset,
    attributes: { exclude: ["password"] }, // Elimina la contraseña de los resultados[cite: 15]
  });

  return {
    meta: {
      total_records: count,
      current_page: parsedPage,
      total_pages: Math.ceil(count / parsedLimit),
      limit: parsedLimit,
    },
    data: rows,
  };
};

const registrarUsuarioService = async ({
  first_name,
  last_name,
  user_name,
  email,
  password,
}) => {
  // 1. Solicitar conexión exclusiva para la transacción ACID[cite: 15]
  const t = await sequelize.transaction();

  try {
    // ACCIÓN A: Crear el Usuario[cite: 15]
    const nuevoUsuario = await User.create(
      {
        first_name,
        last_name,
        user_name,
        email,
        password,
        is_active: 1,
      },
      { transaction: t },
    );

    // ACCIÓN B: Generar un CBU único[cite: 15]
    const cbuGenerado = "20" + String(nuevoUsuario.user_id).padStart(18, "0");

    // ACCIÓN C: Crear la Cuenta Principal[cite: 15]
    await Account.create(
      {
        user_id: nuevoUsuario.user_id,
        cbu: cbuGenerado,
        currency_id: 1, // Peso Chileno[cite: 15]
        current_balance: 0,
        is_default: 1,
      },
      { transaction: t },
    );

    // 3. Confirmar la transacción[cite: 15]
    await t.commit();
    return nuevoUsuario.user_id;
  } catch (error) {
    // 4. ROLLBACK en caso de fallo[cite: 15]
    await t.rollback();
    throw error;
  }
};

// Devuelve el perfil público del usuario[cite: 15]
const obtenerPerfilUsuario = async (userId) => {
  const usuario = await User.findByPk(userId, {
    attributes: ["user_id", "user_name", "first_name", "last_name", "email"],
  });
  return usuario ? usuario.toJSON() : null;
};

// Actualiza los datos básicos del perfil[cite: 15]
const actualizarPerfilUsuario = async (
  userId,
  { first_name, last_name, email },
) => {
  await User.update(
    { first_name, last_name, email },
    { where: { user_id: userId } },
  );
};

// Actualiza un usuario con validación previa de existencia[cite: 15]
const actualizarUsuarioService = async (
  id,
  { user_name, first_name, last_name, email },
) => {
  const usuarioExistente = await User.findByPk(id, { attributes: ["user_id"] });

  if (!usuarioExistente) {
    throw new Error("El ID de usuario proporcionado no existe en el sistema.");
  }

  await User.update(
    { user_name, first_name, last_name, email },
    { where: { user_id: id } },
  );
};

// Comprueba la contraseña actual antes de actualizar[cite: 15]
const actualizarPasswordUsuario = async (
  userId,
  current_password,
  new_password,
) => {
  const usuario = await User.findOne({
    where: { user_id: userId, password: current_password },
    attributes: ["user_id"],
  });

  if (!usuario) {
    throw new Error("La contraseña actual no coincide.");
  }

  await User.update({ password: new_password }, { where: { user_id: userId } });
};

// Valida al usuario mediante nombre o correo electrónico[cite: 15]
const validarCredenciales = async (identificador, password) => {
  const usuario = await User.findOne({
    where: {
      [Op.or]: [{ user_name: identificador }, { email: identificador }],
      password: password,
    },
    attributes: ["user_id", "user_name", "first_name", "email"],
  });

  return usuario ? usuario.toJSON() : null;
};

// Eliminación lógica controlada (is_active = 0)[cite: 15]
const eliminarUsuarioAdmin = async (id) => {
  const usuario = await User.findByPk(id, { attributes: ["user_id"] });

  if (!usuario) {
    throw new Error("El ID de usuario proporcionado no existe en el sistema.");
  }

  await User.update({ is_active: 0 }, { where: { user_id: id } });
};

module.exports = {
  obtenerUsuarios,
  registrarUsuarioService,
  obtenerPerfilUsuario,
  actualizarPerfilUsuario,
  actualizarUsuarioService,
  actualizarPasswordUsuario,
  validarCredenciales,
  eliminarUsuarioAdmin,
};
