require("dotenv").config(); //Cargar variables de entorno
const app = require("./src/app");

const PORT = process.env.PORT || 3000;

// Inicia el servidor en el puerto definido.
const server = () => {
  app.listen(PORT, () => {
    console.log(`Servidor iniciado en http://localhost:${PORT}`);
  });
};

server();
