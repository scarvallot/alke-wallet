const express = require("express");
const path = require("path");
const fs = require("fs");
const indexRouter = require("./routes/router");

const app = express();

// Configuración del motor de plantillas EJS
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middleware para procesar JSON (debe ir antes de las rutas para que req.body exista)
app.use(express.json());

// Middleware para servir archivos estáticos (CSS y JS)
app.use(express.static(path.join(__dirname, "../public")));

// 3. RUTAS (Endpoints)
// Conectar las rutas a la aplicación (se evalúan al final)
app.use("/", indexRouter);

const registrarVisita = (req, res, next) => {
  const fechaActual = new Date();
  const fecha = fechaActual.toISOString().split("T")[0];
  const hora = fechaActual.toTimeString().split(" ")[0];
  const ruta = req.originalUrl;
  const textoRegistro = `${fecha} | ${hora} | Ruta accedida: ${ruta}\n`;

  // Ruta correcta para el archivo de log
  const rutaLog = path.join(__dirname, "../data/log.txt");

  fs.appendFile(rutaLog, textoRegistro, "utf8", (err) => {
    if (err) {
      console.error("Error al escribir en log.txt:", err);
    }
  });
  next();
};

app.use(registrarVisita);

module.exports = app;
