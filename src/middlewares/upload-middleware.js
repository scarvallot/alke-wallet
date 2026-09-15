const multer = require("multer");
const path = require("path");

// 1. Configuración de almacenamiento
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // CORREGIDO: ../../public/uploads/
    cb(null, path.join(__dirname, "../../public/uploads/"));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, "avatar-" + uniqueSuffix + path.extname(file.originalname));
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
