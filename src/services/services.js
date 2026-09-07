const { pool } = require("../config/db");

const obtenerUsuarios = async (req, res) => {
  // 1. Extraer query params para filtro y paginación (con valores por defecto)
  const nombre = req.query.nombre;
  const page = parseInt(req.query.page) || 1; // Página actual (por defecto 1)
  const limit = parseInt(req.query.limit) || 10; // Límite por página (por defecto 10)
  const offset = (page - 1) * limit; // Registros a omitir

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
  const mainQueryParams = [...queryParams, limit, offset];

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
  const totalPages = Math.ceil(totalRecords / limit);
};

//  8. Valida credenciales de usuario contra valores fijos (mock).
function validarCredenciales(username, password) {
  if (username === "admin" && password === "12345") {
    return { id: 1, username, nombre: "Usuario Administrador" };
  }
  return null;
}

module.exports = {
  obtenerUsuarios,
  validarCredenciales,
};
