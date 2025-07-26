const multer = require('multer');

// Usaremos el almacenamiento en memoria porque solo pasaremos el archivo a Cloudinary,
// no necesitamos guardarlo en nuestro servidor.
const storage = multer.memoryStorage();

const uploader = multer({ 
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // Límite de 5 MB por archivo
  }
});

module.exports = uploader;