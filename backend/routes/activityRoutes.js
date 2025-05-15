const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { getUserFeed } = require('../controllers/activityController');

router.get('/feed', protect, getUserFeed);

module.exports = router;