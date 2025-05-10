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
    description: String,
    timeSpent: Number,
  }],
  images: [String], // array of Cloudinary URLs
  countyTags: [String], // e.g., ["County Derry", "County Antrim"]  
  tags: [String], // e.g., ["Hike", "Waterfall", "Birdwatching"]
  duration: String,
  travelType: [String], // e.g., ["Car", "Bus", "Bike"]
  ratings: [
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    value: { type: Number, min: 1, max: 5 },
    title: { type: String },      
    comment: {type: String},
    createdAt: { type: Date, default: Date.now } 
  }
  ] 
});

daytripSchema.virtual('averageRating').get(function () {
  if (!this.ratings.length) return 0;
  const total = this.ratings.reduce((sum, r) => sum + r.value, 0);
  return total / this.ratings.length;
});

daytripSchema.set('toJSON', { virtuals: true });
daytripSchema.set('toObject', { virtuals: true });

const Daytrip = mongoose.model('Daytrip', daytripSchema);
module.exports = Daytrip;
