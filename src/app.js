const express = require("express");
const path = require("path");
const fs = require("fs");
const session = require("express-session");
const expressLayouts = require("express-ejs-layouts");
const indexRouter = require("./routes/routes");

// Importar middlewares globales
const {
  variablesGlobales,
  registrarVisita,
} = require("./middlewares/middlewares");

const app = express();

// 1. CONFIGURACIÓN DEL MOTOR DE PLANTILLAS (EJS + Layouts)
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(expressLayouts);
app.set("layout", "layouts/main");

// 2. MIDDLEWARES BÁSICOS Y DE FORMULARIOS
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "../public")));

// 3. CONFIGURACIÓN DE SESIONES
app.use(
  session({
    secret: process.env.SESSION_SECRET || "mi-secreto-super-seguro",
    resave: false,
    saveUninitialized: false,
  }),
);

// 4. MIDDLEWARES GLOBALES (inyección de variables y logging)
app.use(variablesGlobales);
app.use(registrarVisita);

// 5. RUTAS
app.use("/", indexRouter);

module.exports = app;
