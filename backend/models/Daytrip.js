const mongoose = require('mongoose');

const daytripSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
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
  locations: [{
    name: String,
    address: String,
    lat: Number,
    lng: Number,
  }],
  images: [String], // array of Cloudinary URLs
  countyTags: [String], // e.g., ["County Derry", "County Antrim"]  
  tags: [String], // e.g., ["Hike", "Waterfall", "Birdwatching"]
  duration: [String],
  travelType: {
    type: String,
    enum: ['Car', 'Bus', 'Train', 'Bike'],
    required: true,
  },
});

const Daytrip = mongoose.model('Daytrip', daytripSchema);
module.exports = Daytrip;
