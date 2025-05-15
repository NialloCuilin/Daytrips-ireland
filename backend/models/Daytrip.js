const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  value: { type: Number, min: 1, max: 5 },
  title: { type: String },
  comment: { type: String }
}, {
  timestamps: true 
});

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
  images: [String], 
  countyTags: [String], 
  tags: [String], 
  duration: String,
  travelType: [String], 
  ratings: [ratingSchema] 
});

daytripSchema.virtual('averageRating').get(function () {
  if (!Array.isArray(this.ratings) || this.ratings.length === 0) return 0;
  const total = this.ratings.reduce((sum, r) => sum + r.value, 0);
  return total / this.ratings.length;
});

daytripSchema.set('toJSON', { virtuals: true });
daytripSchema.set('toObject', { virtuals: true });

const Daytrip = mongoose.model('Daytrip', daytripSchema);
module.exports = Daytrip;
