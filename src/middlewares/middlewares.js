const fs = require("fs");
const path = require("path");

//  Protege rutas exigiendo sesión activa.
function protegerRuta(req, res, next) {
  if (!req.session?.usuario) {
    return res.redirect("/login");
  }
  next();
}

//  Registra cada petición en un archivo de log.
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

// Función de validación (NO middleware)
const validarCredenciales = (username, password) => {
  if (username === "admin" && password === "12345") {
    return { id: 1, username, nombre: "Usuario Administrador" };
  }
  return null;
};

//  Inyecta variables globales en todas las vistas EJS.
function variablesGlobales(req, res, next) {
  res.locals.usuario =
    req.session && req.session.usuario ? req.session.usuario : null;
  res.locals.tituloPagina = "Mi Wallet";
  res.locals.cssFile = null;
  res.locals.jsFile = null;
  next();
}

module.exports = {
  protegerRuta,
  registrarVisita,
  validarCredenciales,
  variablesGlobales,
};
