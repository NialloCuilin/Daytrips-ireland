const mongoose = require('mongoose');

const daytripSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  locations: [String], // e.g., ["Coffee Shop", "Waterfall"]
  images: [String], // array of Cloudinary URLs
  countyTags: [String], // e.g., ["County Derry", "County Antrim"]
  tags: [String], // e.g., ["Hike", "Waterfall", "Birdwatching"]
  travelType: {
    type: String,
    enum: ['Car', 'Bus', 'Train'],
    required: true,
  },
});

const Daytrip = mongoose.model('Daytrip', daytripSchema);
module.exports = Daytrip;
