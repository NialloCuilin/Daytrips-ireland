const express = require('express');
const { 
  createDaytrip, 
  getUserDaytrips, 
  getAllDaytrips, 
  getDaytripById, 
  rateDaytrip, 
  getUserReviews // ✅ ADD THIS
} = require('../controllers/daytripController');
const { protect } = require('../middleware/authMiddleware');    
const router = express.Router();

// POST
router.post('/create', createDaytrip);
router.post('/:id/rate', protect, rateDaytrip);

// GET
router.get('/user/:userId', getUserDaytrips);
router.get('/reviews/user/:userId', getUserReviews); // ✅ ADD THIS
router.get('/:id', getDaytripById);
router.get('/', getAllDaytrips);

module.exports = router;
