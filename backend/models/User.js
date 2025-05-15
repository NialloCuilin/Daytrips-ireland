const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    achievements: {
      type: [String],
      default: [],
    },
    avatar: {
      type: String,
      default: '', 
    },
    county: {
      type: String,
      required: true,
    },
    savedDaytrips: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Daytrip' }],

    // ✅ Add these fields for the social system
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  },
  { timestamps: true }
);

const User = mongoose.model('User', userSchema);

module.exports = User;
// module.exports = {