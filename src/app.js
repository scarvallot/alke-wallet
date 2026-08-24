const express = require("express");
const path = require("path");
const app = express();

// Configuración del motor de plantillas EJS
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middleware para procesar JSON
app.use(express.json());

// Middleware para servir archivos estáticos (CSS y JS)
app.use(express.static(path.join(__dirname, "../public")));

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
