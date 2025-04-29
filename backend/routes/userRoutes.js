const express = require('express');
const { registerUser, loginUser, updateAvatar } = require('../controllers/userController');
const { uploadPhoto } = require('../controllers/photoController'); 

const router = express.Router();

// @route POST /api/users/register
router.post('/register', registerUser);

// @route POST /api/users/login
router.post('/login', loginUser);

// @route POST /api/users/upload-photo
router.post('/upload-photo', uploadPhoto);

// @route POST /api/users/update-avatar
router.post('/update-avatar', updateAvatar);

module.exports = router;    