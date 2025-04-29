const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); 
require('dotenv').config();

const app = express();
const userRoutes = require('./routes/userRoutes');
const daytripRoutes = require('./routes/daytripRoutes');

// Middleware
app.use(cors()); 
app.use(express.json({ limit: '10mb' }));
app.use('/api/users', userRoutes);
app.use('/api/daytrips', daytripRoutes);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB Atlas!'))
  .catch((err) => console.error('MongoDB connection failed:', err));

// Basic Route
app.get('/', (req, res) => {
  res.send('DayTrips Ireland API is running 🚀');
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));