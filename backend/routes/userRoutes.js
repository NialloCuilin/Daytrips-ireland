const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { uploadPhoto } = require('../controllers/photoController');
const {
    registerUser,
    loginUser,
    updateAvatar,
    saveDaytrip,
    unsaveDaytrip,
    getSavedDaytrips,
    getUserById,
  } = require('../controllers/userController'); 

const router = express.Router();

// @route POST /api/users/register
router.post('/register', registerUser);

// @route POST /api/users/login
router.post('/login', loginUser);

// @route POST /api/users/upload-photo
router.post('/upload-photo', uploadPhoto);

// @route POST /api/users/update-avatar
router.post('/update-avatar', updateAvatar);

// Save a daytrip
router.post('/save-daytrip/:daytripId', protect, saveDaytrip);

// Unsave a daytrip
router.delete('/unsave-daytrip/:daytripId', protect, unsaveDaytrip);

// Get saved daytrips
router.get('/:userId/saved-daytrips', protect, getSavedDaytrips);

router.get('/:id', getUserById);

module.exports = router;    