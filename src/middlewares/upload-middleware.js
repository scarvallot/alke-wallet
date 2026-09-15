const multer = require("multer");
const path = require("path");

// 1. Configuración de almacenamiento
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Usamos path.resolve o una ruta absoluta basada en process.cwd()
    // para evitar errores de rutas relativas dependiendo de dónde se inicie el servidor.
    const uploadPath = path.join(process.cwd(), "public", "uploads");
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    // Limpiamos el nombre original opcionalmente o mantenemos tu estructura única segura
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `avatar-${uniqueSuffix}${ext}`);
  },
});

// 2. Filtro de archivos (Solo imágenes)
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

// 3. Inicializar multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 }, // Límite de 2MB
});

module.exports = upload;
