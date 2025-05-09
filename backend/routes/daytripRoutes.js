const express = require('express');
const { createDaytrip } = require('../controllers/daytripController');
const { getUserDaytrips } = require('../controllers/daytripController');
const { getAllDaytrips, getDaytripById } = require('../controllers/daytripController');
const { rateDaytrip } = require('../controllers/daytripController');
const { protect } = require('../middleware/authMiddleware');    
const router = express.Router();

//post
router.post('/create', createDaytrip);
router.post('/:id/rate', protect, rateDaytrip);
//get
router.get('/user/:userId', getUserDaytrips);     //For "My Daytrips"
router.get('/:id', getDaytripById); //For "Daytrip details"
router.get('/', getAllDaytrips); //For "All Daytrips"

module.exports = router;