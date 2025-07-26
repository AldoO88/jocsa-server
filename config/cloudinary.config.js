const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Opcional: Configuración de almacenamiento para Multer
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    allowed_formats: ['jpg', 'png'],
    // El folder se determinará dinámicamente en la ruta
    folder: 'jocsa-autopartes', // Puedes cambiarlo a tu carpeta deseada
  }
});

module.exports = cloudinary;