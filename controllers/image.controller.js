const cloudinary = require('../config/cloudinary.config');
const uploader = require('../middleware/uploader.middleware');

const uploadImage = async (req, res, next) => {
  console.log("Subiendo imagen...");
  if (!req.file) {
    return res.status(400).json({ message: 'No se ha subido ningún archivo.' });
  }

  // Obtenemos el contexto del cuerpo de la petición (enviado desde el frontend)
  const { context } = req.body;
  const { entityId } = req.params;

  

  // Lógica para determinar la carpeta en Cloudinary
  let folderPath = 'jocsa-autopartes/misc';
  if (context === 'profile') {
    folderPath = `jocsa-autopartes/users/${entityId}/profile-picture`;
  } else if (context === 'product') {
    folderPath = `jocsa-autopartes/products/${entityId}`;
  }
  // ... puedes añadir más contextos aquí (ej. 'category', 'brand')

  try {
    // Subimos la imagen desde el buffer de memoria a Cloudinary
    const uploadResult = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: folderPath },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      );
      uploadStream.end(req.file.buffer);
    });

    res.status(200).json({ imageUrl: uploadResult.secure_url });

  } catch (error) {
    console.error("Error al subir a Cloudinary:", error);
    res.status(500).json({ message: 'Error al subir la imagen.' });
  }
};

module.exports = {
    uploadImage
};