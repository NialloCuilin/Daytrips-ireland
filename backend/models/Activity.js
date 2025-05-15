  const mongoose = require('mongoose');

  const activitySchema = new mongoose.Schema({
    type: {
      type: String,
      enum: ['create', 'rate', 'save', 'follow', 'achievement'],
      required: true
    },
    actor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    targetUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User' // e.g., followed someone
    },
    daytrip: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Daytrip'
    },
    value: {
      type: Number,
      min: 1,
      max: 5
    },
    achievement: {
      type: String
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  });

  const Activity = mongoose.model('Activity', activitySchema);

  module.exports = Activity;
