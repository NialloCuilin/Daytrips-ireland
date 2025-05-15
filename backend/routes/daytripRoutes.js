const express = require('express');
const { 
  createDaytrip, 
  getUserDaytrips, 
  getAllDaytrips, 
  getDaytripById, 
  rateDaytrip, 
  getUserReviews,
  deleteDaytrip,
  deleteReview
} = require('../controllers/daytripController');
const { protect } = require('../middleware/authMiddleware');    
const router = express.Router();

// POST
router.post('/create', protect, createDaytrip);
router.post('/:id/rate', protect, rateDaytrip);

// GET
router.get('/user/:userId', getUserDaytrips);
router.get('/reviews/user/:userId', getUserReviews); 
router.get('/:id', getDaytripById);
router.get('/', getAllDaytrips);

// DELETE
router.delete('/:id', protect, deleteDaytrip);
router.delete('/reviews/:userId/:reviewId', protect, deleteReview);

module.exports = router;
