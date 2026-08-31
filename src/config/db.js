const mysql = require("mysql2/promise");
require("dotenv").config();

// Pool de conexiones MySQL reutilizado por la app para ejecutar consultas.
const pool = mysql.createPool({
  uri: process.env.DATABASE_URL,
  connectionLimit: 10,
  idleTimeout: 30000, // Tiempo de inactividad 30 segundos (por defecto 60000 ms)
  connectTimeout: 2000, // Tiempo máximo para adquirir conexión 2 segundos (por defecto 10000 ms)
  waitForConnections: true,
});

// Comprueba que la conexión inicial a la base de datos funcione correctamente.
const testConnection = async () => {
  let connection;
  try {
    connection = await pool.getConnection();
    console.log("Conexión exitosa a la base de datos MySQL");
    connection.release();
  } catch (error) {
    console.error("Error al conectar con la base de datos.", error.message);
  } finally {
    if (connection) connection.release(); // Asegura que la conexión se libere en caso de error
    console.log("Conexión liberada al poll.");
    // await pool.end(); // Cierra el pool de conexiones al finalizar la prueba
    // console.log("Pool de conexiones cerrado.");
  }
};

module.exports = {
  pool,
  testConnection,
};
