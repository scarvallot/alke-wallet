const { pool } = require("../config/db");

// Modificamos la firma para recibir un objeto desestructurado, no req/res
const obtenerUsuarios = async ({ nombre, page, limit }) => {
  // 1. Extraer params para filtro y paginación con valores por defecto locales
  const parsedPage = parseInt(page) || 1;
  const parsedLimit = parseInt(limit) || 10;
  const offset = (parsedPage - 1) * parsedLimit;

  // 2. Construir la consulta base y la consulta de conteo
  let query = "SELECT * FROM alkewallet.users";
  let countQuery = "SELECT COUNT(*) as total FROM alkewallet.users";
  const queryParams = [];

  // 3. Aplicar filtro dinámico si el parámetro 'nombre' existe
  if (nombre) {
    const whereClause = " WHERE user_name LIKE ?";
    query += whereClause;
    countQuery += whereClause;
    queryParams.push(`%${nombre}%`);
  }

  // 4. Añadir paginación a la consulta principal (LIMIT y OFFSET)
  query += " LIMIT ? OFFSET ?";
  // Añadimos limit y offset al final de los parámetros para la query principal
  const mainQueryParams = [...queryParams, parsedLimit, offset];

  // 5. Ejecutar ambas consultas (Conteo total y obtención de datos)
  const [countResult] = await pool.query(countQuery, queryParams);
  const totalRecords = countResult[0].total;

  const [rows] = await pool.query(query, mainQueryParams);

  // 6. Procesar resultados: EXCLUIR LA CONTRASEÑA por seguridad
  const usuariosSeguros = rows.map((usuario) => {
    const { password, ...restoDelUsuario } = usuario;
    return restoDelUsuario;
  });

  // 7. Calcular total de páginas
  const totalPages = Math.ceil(totalRecords / parsedLimit);

  // 8. RETORNAR los datos estructurados al controlador
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

// Validar credenciales contra la base de datos real
const validarCredenciales = async (username, password) => {
  // Nota: Buscamos por user_name, pero también podrías usar email
  const query =
    "SELECT user_id, user_name, email FROM alkewallet.users WHERE user_name = ? AND password = ?";

  // Ejecutamos la consulta pasándole los datos del formulario
  const [rows] = await pool.query(query, [username, password]);

  // Si encuentra una coincidencia, devuelve el usuario (sin el password). Si no, null.
  if (rows.length > 0) {
    return rows[0];
  }
  return null;
};

// Obtener el saldo de la cuenta principal del usuario
const obtenerSaldoUsuario = async (userId) => {
  const query = `
    SELECT a.current_balance, c.currency_symbol 
    FROM AlkeWallet.Accounts a
    JOIN AlkeWallet.Currencies c ON a.currency_id = c.currency_id
    WHERE a.user_id = ? AND a.is_default = 1
  `;

  const [rows] = await pool.query(query, [userId]);

  if (rows.length > 0) {
    return rows[0];
  }
  return { current_balance: 0, currency_symbol: "$" }; // Fallback si no tiene cuenta
};

// Borrado de usuario desde el panel admin
const eliminarUsuarioAdmin = async (id) => {
  /*
   * HARD DELETE (Comentado por seguridad)
   * Elimina físicamente el registro. En una billetera, esto daría error de
   * llave foránea (Foreign Key) si el usuario ya tiene cuentas o transacciones.
   *
   * const queryHard = "DELETE FROM AlkeWallet.Users WHERE user_id = ?";
   * await pool.query(queryHard, [id]);
   */
  // SOFT DELETE
  // Mantiene la integridad referencial, solo oculta al usuario desactivándolo.
  const querySoft =
    "UPDATE AlkeWallet.Users SET is_active = 0 WHERE user_id = ?";
  await pool.query(querySoft, [id]);
};


module.exports = {
  obtenerUsuarios,
  validarCredenciales,
  obtenerSaldoUsuario,
  eliminarUsuarioAdmin,
};
