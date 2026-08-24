const express = require("express");
const path = require("path");
const fs = require("fs");
const app = express();

// Configuración del motor de plantillas EJS
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middleware para procesar JSON
app.use(express.json());

// Middleware para servir archivos estáticos (CSS y JS)
app.use(express.static(path.join(__dirname, "../public")));

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

// Ruta que renderiza la vista dinámica
app.get("/", (req, res) => {
  res.render("login", {
    tituloPagina: "Login - Mi Wallet",
    nombreApp: "Mi Wallet",
    tagline: "Tu billetera digital segura",
  });
});

// Respuesta en JSON
app.get("/status", (req, res) => {
  res.status(200).json({
    estado: "activo",
    mensaje: "Servidor funcionando correctamente",
    fecha: new Date().toISOString(),
  });
});

module.exports = app;
