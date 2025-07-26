const { Router } = require('express');
const { updateUserProfile, updateUserPassword, getUserById } = require('../controllers/user.controller');

const router = Router();

router.get('/getUserById/:userId', getUserById);
router.put('/updateProfile/:userId', updateUserProfile);
router.put('/updatePassword/:userId', updateUserPassword);


module.exports = router;