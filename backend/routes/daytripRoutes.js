const express = require('express');
const { createDaytrip } = require('../controllers/daytripController');
const router = express.Router();

router.post('/create', createDaytrip); // protected route later

module.exports = router;