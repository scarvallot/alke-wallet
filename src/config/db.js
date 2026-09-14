const { Sequelize } = require("sequelize");
require("dotenv").config();

// Inicialización de la instancia de Sequelize mediante URI
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "mysql",
  logging: false,
  define: {
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  },
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});

// Prueba de conexión interna
(async () => {
  try {
    await sequelize.authenticate();
    console.log("Sequelize conectado correctamente");
  } catch (error) {
    console.error("No se pudo conectar con Sequelize:", error.message);
  }
})();

module.exports = sequelize;
