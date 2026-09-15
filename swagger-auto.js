const swaggerAutogen = require("swagger-autogen")();

const doc = {
  info: {
    title: "Alke Wallet API",
    description: "Documentación auto-generada",
  },
  host: "localhost:3000",
};

// Apunta a la raíz para guardar el JSON
const outputFile = "./swagger-output.json";
// Apunta a la carpeta src/routes/ para leer tus rutas
const routes = ["./src/routes/routes.js"];

/* Ejecuta el auto-generador */
swaggerAutogen(outputFile, routes, doc);
