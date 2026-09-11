const { pool } = require("../config/db");

// Obtiene usuarios con filtro opcional por nombre y paginación.
const obtenerUsuarios = async ({ nombre, page, limit }) => {
  // 1) Normaliza los valores de página y límite para evitar errores de entrada.
  const parsedPage = parseInt(page) || 1;
  const parsedLimit = parseInt(limit) || 10;

  // 2) Calcula el desplazamiento de la paginación a partir de la página actual.
  const offset = (parsedPage - 1) * parsedLimit;

  // 3) Define la consulta base y la consulta de conteo, además de un array de parámetros.
  let query = "SELECT * FROM alkewallet.users";
  let countQuery = "SELECT COUNT(*) as total FROM alkewallet.users";
  const queryParams = [];

  // 4) Si el usuario indicó un filtro por nombre, se agrega la condición WHERE.
  if (nombre) {
    const whereClause = " WHERE user_name LIKE ?";
    query += whereClause;
    countQuery += whereClause;
    queryParams.push(`%${nombre}%`);
  }

  // 5) Agrega el límite y el desplazamiento para devolver solo una página de resultados.
  query += " LIMIT ? OFFSET ?";
  const mainQueryParams = [...queryParams, parsedLimit, offset];

  // 6) Ejecuta la consulta de conteo para saber la cantidad total de registros.
  const [countResult] = await pool.query(countQuery, queryParams);
  const totalRecords = countResult[0].total;

  // 7) Ejecuta la consulta principal con la paginación y el filtro aplicado.
  const [rows] = await pool.query(query, mainQueryParams);

  // 8) Elimina la contraseña antes de devolver datos al cliente, manteniendo solo información segura.
  const usuariosSeguros = rows.map((usuario) => {
    const { password, ...restoDelUsuario } = usuario;
    return restoDelUsuario;
  });

  // 9) Calcula cuántas páginas tendrá la paginación según el total de registros.
  const totalPages = Math.ceil(totalRecords / parsedLimit);

  // 10) Devuelve la respuesta estructurada con metadatos y usuarios seguros.
  return {
    meta: {
      total_records: totalRecords,
      current_page: parsedPage,
      total_pages: totalPages,
      limit: parsedLimit,
    },
    data: usuariosSeguros,
  };
};

// Registra un usuario nuevo de forma transaccional, genera su CBU y su cuenta en $0.
const registrarUsuarioService = async ({
  first_name,
  last_name,
  user_name,
  email,
  password,
}) => {
  // 1. Solicitar conexión exclusiva para la transacción ACID
  const connection = await pool.getConnection();

  try {
    // 2. Iniciar la transacción
    await connection.beginTransaction();

    // ACCIÓN A: Crear el Usuario
    // Nota: Mantenemos el guardado de la contraseña tal cual lo tienes estructurado actualmente.
    const queryUser = `
      INSERT INTO alkewallet.users (first_name, last_name, user_name, email, password, is_active)
      VALUES (?, ?, ?, ?, ?, 1)
    `;
    const [userResult] = await connection.query(queryUser, [
      first_name,
      last_name,
      user_name,
      email,
      password,
    ]);

    const nuevoUserId = userResult.insertId;

    // ACCIÓN B: Generar un CBU único de exactamente 20 dígitos
    // Cambiamos el prefijo a "20" para evitar colisiones con el seed original (que usa "10")
    const cbuGenerado = "20" + String(nuevoUserId).padStart(18, "0");

    // ACCIÓN C: Crear la Cuenta Principal
    // currency_id = 1 (Peso Chileno), current_balance = 0, is_default = 1
    const queryAccount = `
      INSERT INTO alkewallet.accounts (user_id, cbu, currency_id, current_balance, is_default)
      VALUES (?, ?, 1, 0, 1)
    `;
    await connection.query(queryAccount, [nuevoUserId, cbuGenerado]);

    // 3. Confirmar la transacción (Commit)
    await connection.commit();

    // Retornamos el ID insertado para mantener compatibilidad con tu controlador
    return nuevoUserId;
  } catch (error) {
    // 4. ROLLBACK: Revertir todo si alguna de las acciones falla (ej. email duplicado)
    await connection.rollback();
    throw error;
  } finally {
    // 5. Liberar la conexión
    connection.release();
  }
};
// Devuelve el perfil público del usuario identificado por su ID.
const obtenerPerfilUsuario = async (userId) => {
  const query = `
    SELECT user_id, user_name, first_name, last_name, email
    FROM AlkeWallet.Users
    WHERE user_id = ?
  `;

  const [rows] = await pool.query(query, [userId]);
  return rows[0] || null;
};

// Actualiza los datos básicos del perfil del usuario.
const actualizarPerfilUsuario = async (
  userId,
  { first_name, last_name, email },
) => {
  const query = `
    UPDATE AlkeWallet.Users
    SET first_name = ?, last_name = ?, email = ?
    WHERE user_id = ?
  `;

  await pool.query(query, [first_name, last_name, email, userId]);
};

// Actualiza un usuario identificado por ID con validación previa de existencia.
const actualizarUsuarioService = async (
  id,
  { user_name, first_name, last_name, email },
) => {
  const [checkRows] = await pool.query(
    "SELECT user_id FROM AlkeWallet.Users WHERE user_id = ?",
    [id],
  );

  if (checkRows.length === 0) {
    throw new Error("El ID de usuario proporcionado no existe en el sistema.");
  }

  const query = `
    UPDATE AlkeWallet.Users
    SET user_name = ?, first_name = ?, last_name = ?, email = ?
    WHERE user_id = ?
  `;

  await pool.query(query, [user_name, first_name, last_name, email, id]);
};

// Comprueba la contraseña actual antes de actualizar la nueva.
const actualizarPasswordUsuario = async (
  userId,
  current_password,
  new_password,
) => {
  const checkQuery = `
    SELECT user_id FROM AlkeWallet.Users
    WHERE user_id = ? AND password = ?
  `;

  const [checkRows] = await pool.query(checkQuery, [userId, current_password]);

  if (checkRows.length === 0) {
    throw new Error("La contraseña actual no coincide.");
  }

  const updateQuery = `
    UPDATE AlkeWallet.Users
    SET password = ?
    WHERE user_id = ?
  `;

  await pool.query(updateQuery, [new_password, userId]);
};

// Valida al usuario mediante nombre o correo electrónico y contraseña.
const validarCredenciales = async (identificador, password) => {
  const query = `
    SELECT user_id, user_name, first_name, email
    FROM AlkeWallet.Users
    WHERE (user_name = ? OR email = ?) AND password = ?
  `;

  const [rows] = await pool.query(query, [
    identificador,
    identificador,
    password,
  ]);

  if (rows.length > 0) {
    return rows[0];
  }

  return null;
};

// Eliminación lógica controlada con validación previa de existencia
const eliminarUsuarioAdmin = async (id) => {
  // 1. Validar que el ID exista físicamente en la base de datos
  const [rows] = await pool.query(
    "SELECT user_id FROM AlkeWallet.Users WHERE user_id = ?",
    [id],
  );

  if (rows.length === 0) {
    throw new Error("El ID de usuario proporcionado no existe en el sistema.");
  }

  // Opcional: Consulta para eliminación física (hard delete) en caso de requerirse
  // const queryHard = "DELETE FROM AlkeWallet.Users WHERE user_id = ?";

  // 2. Ejecutar la desactivación lógica si el registro existe
  const querySoft =
    "UPDATE AlkeWallet.Users SET is_active = 0 WHERE user_id = ?";

  await pool.query(querySoft, [id]);
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
