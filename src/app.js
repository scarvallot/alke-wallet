const express = require("express");
const path = require("path");
const fs = require("fs");
const session = require("express-session");
const expressLayouts = require("express-ejs-layouts");
const indexRouter = require("./routes/router");

const app = express();

// 1. CONFIGURACIÓN DEL MOTOR DE PLANTILLAS (EJS + Layouts)
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(expressLayouts);
app.set("layout", "layouts/main"); // Define el esqueleto base

// 2. MIDDLEWARES BÁSICOS Y DE FORMULARIOS
app.use(express.json()); // Para procesar JSON
app.use(express.urlencoded({ extended: true })); // VITAL para leer datos de formularios (ej. Login)
app.use(express.static(path.join(__dirname, "../public"))); // Archivos estáticos

// 3. CONFIGURACIÓN DE SESIONES
app.use(
  session({
    secret: "mi-secreto-super-seguro", // Cámbialo en producción o usa variables de entorno
    resave: false,
    saveUninitialized: false,
  }),
);

// 4. MIDDLEWARE PARA VARIABLES GLOBALES (Evita errores "is not defined" en EJS)
app.use((req, res, next) => {
  res.locals.usuario =
    req.session && req.session.usuario ? req.session.usuario : null;
  res.locals.tituloPagina = "Mi Wallet";
  res.locals.cssFile = null;
  res.locals.jsFile = null;
  next();
});

// 5. MIDDLEWARE DE REGISTRO DE VISITAS (Debe ir ANTES de las rutas)
const registrarVisita = (req, res, next) => {
  const fechaActual = new Date();
  const fecha = fechaActual.toISOString().split("T")[0];
  const hora = fechaActual.toTimeString().split(" ")[0];
  const ruta = req.originalUrl;
  const textoRegistro = `${fecha} | ${hora} | Ruta accedida: ${ruta}\n`;

  const rutaLog = path.join(__dirname, "../data/log.txt");

  fs.appendFile(rutaLog, textoRegistro, "utf8", (err) => {
    if (err) {
      console.error("Error al escribir en log.txt:", err);
    }
  });

  // next() es crucial para que la petición continúe hacia indexRouter
  next();
};

app.use(registrarVisita);

// 6. RUTAS (Endpoints) - Se evalúan al final
app.use("/", indexRouter);

module.exports = app;
