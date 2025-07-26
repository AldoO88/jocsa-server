const { Router } = require('express');

const { uploadImage } = require('../controllers/image.controller');
const uploader = require('../middleware/uploader.middleware');

const router = Router();

router.post('/uploadImage/:entityId', uploader.single('imageFile'), uploadImage);

module.exports = router;