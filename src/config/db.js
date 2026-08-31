const mysql = require("mysql2/promise");
require("dotenv").config();

// Pool de conexiones MySQL reutilizado por la app para ejecutar consultas.
const pool = mysql.createPool({
  uri: process.env.DATABASE_URL,
  connectionLimit: 10,
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
    console.log("Conexión liberada al poil.");
    // await pool.end(); // Cierra el pool de conexiones al finalizar la prueba
    // console.log("Pool de conexiones cerrado.");
  }
};

module.exports = {
  pool,
  testConnection,
};
