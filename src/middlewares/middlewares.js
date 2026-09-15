const fs = require("fs");
const path = require("path");
const multer = require("multer");
const jwt = require("jsonwebtoken");

// Protege rutas exigiendo sesión activa.
function protegerRuta(req, res, next) {
  if (!req.session?.usuario) {
    return res.redirect("/login");
  }
  next();
}

// Proteger rutas de administración
const requerirAdmin = (req, res, next) => {
  const usuario = req.session?.usuario;
  if (!usuario) {
    return res.redirect("/login");
  }
  const esAdmin =
    usuario.user_name === "admin" || usuario.email === "admin@alkewallet.com";
  if (!esAdmin) {
    return res
      .status(403)
      .send("Acceso denegado. Se requiere cuenta de administrador.");
  }
  next();
};

// Registra cada petición en un archivo de log.
const registrarVisita = (req, res, next) => {
  const fechaActual = new Date();
  const fecha = fechaActual.toISOString().split("T")[0];
  const hora = fechaActual.toTimeString().split(" ")[0];
  const ruta = req.originalUrl;
  const textoRegistro = `${fecha} | ${hora} | Ruta accedida: ${ruta}\n`;

  const rutaLog = path.join(__dirname, "../../data/log.txt");

  fs.appendFile(rutaLog, textoRegistro, "utf8", (err) => {
    if (err) {
      console.error("Error al escribir en log.txt:", err);
    }
  });
  next();
};

// Inyecta variables globales
function variablesGlobales(req, res, next) {
  res.locals.usuario =
    req.session && req.session.usuario ? req.session.usuario : null;
  res.locals.tituloPagina = "Mi Wallet";
  res.locals.cssFile = null;
  res.locals.jsFile = null;
  next();
}

// ==========================================
// CONFIGURACIÓN DE MULTER (Subida de Avatar)
// ==========================================
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Apunta a public/uploads
    cb(null, path.join(__dirname, "../../public/uploads/"));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, "avatar-" + uniqueSuffix + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  const extensionesPermitidas = /jpeg|jpg|png|webp/;
  const extname = extensionesPermitidas.test(
    path.extname(file.originalname).toLowerCase(),
  );
  const mimetype = extensionesPermitidas.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  }
  cb(new Error("Error: Solo se permiten imágenes (jpeg, jpg, png, webp)"));
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
});

const verificarToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];

  // CONSIGNA: 401 Token ausente
  if (!authHeader) {
    return res.status(401).json({
      error: "No autorizado",
      message: "Token ausente en la cabecera Authorization.",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario_jwt = decoded; // Guardamos los datos decodificados

    // CONSIGNA: En caso de éxito, permita continuar
    next();
  } catch (error) {
    // CONSIGNA: 403 Token inválido
    return res.status(403).json({
      error: "Prohibido",
      message: "Token inválido o expirado.",
    });
  }
};

module.exports = {
  protegerRuta,
  registrarVisita,
  variablesGlobales,
  requerirAdmin,
  upload,
  verificarToken,
};
