const express = require("express");
const path = require("path");
const app = express();

// Middleware para procesar JSON
app.use(express.json());

// middleware express.static()
// Contenido estático desde /public
app.use(express.static(path.join(__dirname, "../public")));

// Rutas públicas (/ y /status)
app.get("/", (req, res) => {
  // Devuelve el archivo HTML estático del login
  const rutaHtml = path.join(__dirname, "../public/auth/login/login.html");
  res.sendFile(rutaHtml);
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
