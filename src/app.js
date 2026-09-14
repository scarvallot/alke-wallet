const express = require("express");
const path = require("path");
const fs = require("fs");
const session = require("express-session");
const expressLayouts = require("express-ejs-layouts");
const indexRouter = require("./routes/routes");

// ==========================================
// 1. IMPORTACIONES DE SWAGGER (Automático)
// ==========================================
const swaggerUi = require("swagger-ui-express");
// Importamos el archivo JSON generado automáticamente en la raíz
const swaggerDocument = require("../swagger-output.json");

// Importar middlewares globales
const {
  variablesGlobales,
  registrarVisita,
} = require("./middlewares/middlewares");

const app = express();

// CONFIGURACIÓN DEL MOTOR DE PLANTILLAS (EJS + Layouts)
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(expressLayouts);
app.set("layout", "layouts/main");

// MIDDLEWARES BÁSICOS Y DE FORMULARIOS
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "../public")));

// Configuración de la sesión
app.use(
  session({
    secret: process.env.SESSION_SECRET || "mi-secreto-super-seguro",
    resave: false,
    saveUninitialized: false,
  }),
);

// MIDDLEWARES GLOBALES (inyección de variables y logging)
app.use(variablesGlobales);
app.use(registrarVisita);

// ==========================================
// 2. ACTIVAR LA INTERFAZ DE SWAGGER
// ==========================================
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// RUTAS
app.use("/", indexRouter);

module.exports = app;
