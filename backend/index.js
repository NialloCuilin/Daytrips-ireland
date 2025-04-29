const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // <-- Add this line
require('dotenv').config();

const app = express();
const userRoutes = require('./routes/userRoutes');

// Middleware
app.use(cors()); // <-- Add this line
app.use(express.json({ limit: '10mb' }));
app.use('/api/users', userRoutes);

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