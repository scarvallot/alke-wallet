require("dotenv").config(); // Carga las variables de entorno.
const app = require("./src/app");
const { testConnection } = require("./src/config/db"); // Importa la función para verificar la conexión a la base de datos.

const PORT = process.env.PORT || 3000;

// Verifica la conexión antes de iniciar el servidor.
testConnection();

// Inicia el servidor en el puerto definido.
const server = () => {
  app.listen(PORT, () => {
    console.log(`Servidor iniciado en http://localhost:${PORT}`);
  });
};

server();
