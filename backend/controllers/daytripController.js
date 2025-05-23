const Daytrip = require('../models/Daytrip');
const Activity = require('../models/Activity');
const mongoose = require('mongoose'); 
const asyncHandler = require('express-async-handler');

const createDaytrip = asyncHandler(async (req, res) => {
  try {
    console.log('USER:', req.user);

    const {
      title,
      description,
      locations,
      duration,
      tags,
      countyTags,
      images
    } = req.body;

    if (!title || !locations || !req.user) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const newTrip = new Daytrip({
      title,
      description,
      locations,
      duration,
      tags,
      countyTags,
      images,
      author: req.user._id,
    });

    const saved = await newTrip.save();
    res.status(201).json(saved);

  } catch (error) {
    console.error('CREATE DAYTRIP ERROR:', error.message);
    res.status(500).json({ message: 'Error creating daytrip', error: error.message });
  }
});
// GET /api/daytrips/user/:userId
const getUserDaytrips = async (req, res) => {
  try {
    const userId = req.params.userId;
    // Validate userId format
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: 'Invalid user ID format' });
    }
    //Query with string instead of forcing ObjectId instance
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
      .populate('ratings.user', 'firstName lastName avatar');

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

    //log the rating activity 
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
      .populate('author', 'firstName lastName avatar')        
      .populate('ratings.user', 'firstName lastName avatar')  
      .lean();
      
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

const deleteDaytrip = asyncHandler(async (req, res) => {
  const trip = await Daytrip.findById(req.params.id);

  if (!trip) {
    res.status(404);
    throw new Error('Daytrip not found');
  }

  if (trip.author.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('Not authorized to delete this daytrip');
  }

  await trip.deleteOne();
  res.json({ message: 'Daytrip deleted' });
});

//delete review
const deleteReview = asyncHandler(async (req, res) => {
  const { reviewId } = req.params;

  const daytrip = await Daytrip.findOne({ "ratings._id": reviewId });

  if (!daytrip) {
    res.status(404);
    throw new Error("Review not found");
  }

  const review = daytrip.ratings.id(reviewId);

  if (!review) {
    res.status(404);
    throw new Error("Review not found");
  }

  if (review.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Not authorized to delete this review");
  }

  review.remove();
  await daytrip.save();

  res.json({ message: "Review deleted successfully" });
});

module.exports = { 
  createDaytrip,  
  getUserDaytrips,
  getAllDaytrips,
  getDaytripById,
  rateDaytrip,
  getUserReviews,
  deleteDaytrip,
  deleteReview
};