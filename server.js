require("dotenv").config(); // Carga las variables de entorno.
const app = require("./src/app");
const { testConnection } = require("./src/config/db");
const { User } = require("./src/models");

const PORT = process.env.PORT || 3000;

// Inicia el servidor en el puerto definido.
const server = async () => {
  try {
    // 1. Opcional: Probar conexión si tu función lo requiere
    // await testConnection();

    // 2. SEQUELIZE: Alterar la tabla para agregar la columna avatar
    //  await User.sync({ alter: true });
    console.log("Tabla 'users' verificada y actualizada en la base de datos.");

    // 3. Levantar el servidor
    app.listen(PORT, () => {
      console.log(`Servidor iniciado en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Error al arrancar el servidor o sincronizar BD:", error);
  }
};

server();
