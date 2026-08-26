const { pool } = require("../config/db");

const obtenerUsuarios = async (req, res) => {
  try {
    // 1. Desestructuración del objeto req.query para extraer el parámetro 'nombre'
    //    Si la URL es /usuarios?nombre=Juan, req.query = { nombre: 'Juan' }
    //    Esto asigna 'Juan' a la variable 'nombre'
    const { nombre } = req.query;

    // 2. Consulta base: selecciona todos los campos de la tabla 'users' del esquema 'alkewallet'
    //    Se usa 'let' porque la consulta se modificará dinámicamente si hay filtro
    let query = "SELECT * FROM alkewallet.users;";

    // 3. Arreglo para almacenar los valores de los parámetros de la consulta (evita inyección SQL)
    //    Se pasa a pool.query() junto con la consulta
    const queryParams = [];

    // 4. Si el usuario proporcionó el parámetro 'nombre' en la URL
    //    Se agrega una cláusula WHERE con LIKE para búsqueda parcial (case-insensitive en MySQL)
    //    El placeholder '?' será reemplazado por el valor en queryParams, escapado automáticamente
    if (nombre) {
      query += " WHERE user_name LIKE ?";
      queryParams.push(`%${nombre}%`); // '%' permite coincidencia parcial (ej: 'Juan' encuentra 'Juanito')
    }

    // Ejecutar la consulta
    const [rows] = await pool.query(query, queryParams);

    // EXCLUIR LA CONTRASEÑA
    const usuariosSeguros = rows.map((usuario) => {
      // Extraemos 'password' y guardamos el resto
      const { password, ...restoDelUsuario } = usuario;
      return restoDelUsuario;
    });

    // Respuesta en JSON
    res.status(200).json({
      estado: "éxito",
      cantidad: usuariosSeguros.length,
      datos: usuariosSeguros,
    });
  } catch (error) {
    // Validar y manejar errores
    console.error("Error al consultar la tabla Users:", error);
    res.status(500).json({
      estado: "error",
      mensaje: "Error interno del servidor al obtener los datos.",
    });
  }
};

module.exports = {
  obtenerUsuarios,
};
