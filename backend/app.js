const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const userRoutes = require('./routes/userRoutes');
const daytripRoutes = require('./routes/daytripRoutes');
const activityRoutes = require('./routes/activityRoutes');

const app = express();

app.use(cors());
app.use(express.json({ limit: '10mb' }));

app.use('/api/users', userRoutes);
app.use('/api/daytrips', daytripRoutes);
app.use('/api/activity', activityRoutes);

app.get('/', (req, res) => {
  res.send('API running');
});

module.exports = app;
