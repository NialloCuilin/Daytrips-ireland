const Daytrip = require('../models/Daytrip');
const Activity = require('../models/Activity');
const mongoose = require('mongoose');

const createDaytrip = async (req, res) => {
  try {
    const {
      title,
      description,
      author,
      locations,
      images,
      countyTags,
      tags,
      duration,
      travelType,
    } = req.body;

    const daytrip = new Daytrip({
      title,
      author,
      description,
      locations,
      images,
      countyTags,
      tags,
      duration,
      travelType,
    });

    await daytrip.save();
    await Activity.create({
      type: 'create',
      actor: author, // assuming `author` is the user ID
      daytrip: daytrip._id
    });
    res.status(201).json(daytrip);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create daytrip', error: err.message });
  }
};

// GET /api/daytrips/user/:userId
const getUserDaytrips = async (req, res) => {
  try {
    const userId = req.params.userId;

    // ✅ Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: 'Invalid user ID format' });
    }

    // ✅ Query with string instead of forcing ObjectId instance
    const daytrips = await Daytrip.find({ author: userId });

    res.json(daytrips);
  } catch (err) {
    console.error('getUserDaytrips error:', err.message, err.stack);
    res.status(500).json({ error: 'Failed to fetch user daytrips', details: err.message });;
  }
};
// GET /api/daytrips
const getAllDaytrips = async (req, res) => {
  try {
    const trips = await Daytrip.find().then(trips =>
      trips.map(trip => trip.toJSON({ virtuals: true }))
    );
    res.json(trips);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch daytrips' });
  }
};

//GET Daytrip by Id
const getDaytripById = async (req, res) => {
  try {
    const daytrip = await Daytrip.findById(req.params.id)
      .populate('author', 'firstName lastName')
      .populate('ratings.user', 'firstName lastName avatar'); // ✅ populate rating users

    if (!daytrip) {
      return res.status(404).json({ message: 'Daytrip not found' });
    }

    res.json(daytrip);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const rateDaytrip = async (req, res) => {
  const { value, comment, title } = req.body;
  const userId = req.user.id;
  const { id } = req.params;

  if (!value || value < 1 || value > 5) {
    return res.status(400).json({ message: 'Rating must be between 1 and 5' });
  }

  try {
    const daytrip = await Daytrip.findById(id);
    if (!daytrip) {
      return res.status(404).json({ message: 'Daytrip not found' });
    }

    const existingRating = daytrip.ratings.find(
      (r) => r.user.toString() === userId
    );

    if (existingRating) {
      existingRating.value = value;
      existingRating.comment = comment;
      existingRating.title = title;
      existingRating.createdAt = new Date();
    } else {
      daytrip.ratings.push({
        user: userId,
        value,
        comment,
        title,
        createdAt: new Date()
      });
    }

    // ✅ Always log the rating activity (whether new or updated)
    await Activity.create({
      type: 'rate',
      actor: userId,
      daytrip: daytrip._id,
      value: value,
    });

    const sum = daytrip.ratings.reduce((acc, r) => acc + r.value, 0);
    daytrip.averageRating = sum / daytrip.ratings.length;

    await daytrip.save();

    res.status(200).json({
      message: 'Rating saved',
      average: daytrip.averageRating,
      total: daytrip.ratings.length,
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to rate daytrip', error: err.message });
  }
};


// GET /api/reviews/user/:userId
const getUserReviews = async (req, res) => {
  try {
    const userId = req.params.userId;

    const reviews = await Daytrip.find({
      ratings: { $elemMatch: { user: userId } }
    })
      .populate('author', 'firstName lastName avatar')         // trip creator
      .populate('ratings.user', 'firstName lastName avatar')   // reviewer info
      .lean();

    // ✅ Safely compare populated user._id to userId string
    const userReviews = reviews.flatMap(daytrip => {
      return daytrip.ratings
        .filter(r => r.user?._id?.toString() === userId)
        .map(r => ({
          ...r,
          createdAt: r.createdAt || daytrip.createdAt || new Date(),
          daytripId: daytrip._id,
          daytripTitle: daytrip.title,
          daytripImage: daytrip.images?.[0],
          author: daytrip.author,
          user: r.user
        }));
    });

    res.json(userReviews);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch reviews", error: err.message });
  }
};

module.exports = { 
  createDaytrip,
  getUserDaytrips,
  getAllDaytrips,
  getDaytripById,
  rateDaytrip,
  getUserReviews
};