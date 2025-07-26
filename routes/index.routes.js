const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../middleware/jwt.middleware');
const userRoutes = require('./user.routes');
const imageRoutes = require('./image.routes');

router.get("/", (req, res, next) => {
  res.json("All good in here");
});

router.use('/users', isAuthenticated, userRoutes);
router.use('/files', isAuthenticated, imageRoutes);


module.exports = router;
