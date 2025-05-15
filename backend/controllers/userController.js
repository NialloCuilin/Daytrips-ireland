const User = require('../models/User');
const Activity = require('../models/Activity');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const asyncHandler = require('express-async-handler');

// @desc    Register a new user
// @route   POST /api/users/register
// @access  Public
const registerUser = async (req, res) => {
  const { firstName, lastName, email, password, county } = req.body;

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: 'User already exists' });
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create new user
  const user = new User({
    firstName,
    lastName,
    email,
    password: hashedPassword,
    county, 
  });

  await user.save();

  // Create JWT Token
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });

  res.status(201).json({
    _id: user._id,
    firstName: user.firstName,
    email: user.email,
    token,
  });
};

// @desc    Login a user
// @route   POST /api/users/login
// @access  Public
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  // Find user by email
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(400).json({ message: 'Invalid credentials' });
  }

  // Compare password
  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return res.status(400).json({ message: 'Invalid credentials' });
  }

  // Create JWT Token
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });

  res.json({
    _id: user._id,
    firstName: user.firstName,
    email: user.email,
    county: user.county,
    avatar: user.avatar,
    token,
  });
};

//update user avatar
const updateAvatar = async (req, res) => {  
  const { userId, avatarUrl } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.avatar = avatarUrl;
    await user.save();

    res.json({ message: "Avatar updated successfully", avatar: user.avatar });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const saveDaytrip = async (req, res) => {
  const userId = req.user.id;
  const daytripId = req.params.daytripId;

  console.log("Saving daytrip:", daytripId);

  if (!mongoose.Types.ObjectId.isValid(daytripId)) {
    return res.status(400).json({ message: "Invalid daytrip ID" });
  }

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (!user.savedDaytrips.includes(daytripId)) {
      user.savedDaytrips.push(daytripId);
      await user.save();

      //Create activity for save
      await Activity.create({
        type: 'save',
        actor: userId,
        daytrip: daytripId
      });
    }

    res.status(200).json({ message: "Daytrip saved" });
  } catch (err) {
    console.error("Error in saveDaytrip:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Unsave a daytrip
const unsaveDaytrip = async (req, res) => {
  const userId = req.user._id;
  const { daytripId } = req.params;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    user.savedDaytrips = user.savedDaytrips.filter(
      id => id.toString() !== daytripId
    );
    await user.save();

    res.json({ message: 'Daytrip unsaved successfully.' });
  } catch (err) {
    console.error('unsaveDaytrip error:', err.message);
    res.status(500).json({ error: 'Failed to unsave daytrip.' });
  }
};

// Get all saved daytrips for a user
const getSavedDaytrips = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).populate('savedDaytrips');
    if (!user) return res.status(404).json({ error: 'User not found' });

    res.json(user.savedDaytrips);
  } catch (err) {
    console.error('getSavedDaytrips error:', err.message);
    res.status(500).json({ error: 'Failed to load saved daytrips.' });
  }
};

const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id)
  .select('-password')
  .populate('followers', 'firstName lastName avatar')
  .populate('following', 'firstName lastName avatar');
  if (user) {
    res.json(user);
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

const followUser = async (req, res) => {
  const userId = req.user._id;
  const targetId = req.params.id;

  if (userId.toString() === targetId) {
    return res.status(400).json({ message: "You can't follow yourself." });
  }

  const user = await User.findById(userId);
  const target = await User.findById(targetId);

  if (!user || !target) {
    return res.status(404).json({ message: "User not found." });
  }

  if (!user.following.includes(targetId)) {
    user.following.push(targetId);
    target.followers.push(userId);  
    await user.save();
    await target.save();

    //Log follow activity only
    await Activity.create({
      type: 'follow',
      actor: userId,
      targetUser: targetId
    });
  }

  res.status(200).json({ message: "Followed successfully." });
};

// @desc    Unfollow a user
// @route   POST /api/users/:id/unfollow
// @access  Private
const unfollowUser = async (req, res) => {
  const userId = req.user._id;
  const targetId = req.params.id;

  await User.findByIdAndUpdate(userId, { $pull: { following: targetId } });
  await User.findByIdAndUpdate(targetId, { $pull: { followers: userId } });

  res.status(200).json({ message: "Unfollowed successfully." });
};

module.exports = {
  registerUser,
  loginUser,
  updateAvatar,
  saveDaytrip,
  unsaveDaytrip,
  getSavedDaytrips,
  getUserById,
  followUser,    
  unfollowUser, 
};
