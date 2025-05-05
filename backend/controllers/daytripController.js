const Daytrip = require('../models/Daytrip');
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
    res.status(201).json(daytrip);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create daytrip', error: err.message });
  }
};

// GET /api/daytrips/user/:userId
const getUserDaytrips = async (req, res) => {
  try {
    const userId = req.params.userId;
    const daytrips = await Daytrip.find({ author: new mongoose.Types.ObjectId(userId) });
    res.json(daytrips);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch user daytrips' });
  }
};

// GET /api/daytrips
const getAllDaytrips = async (req, res) => {
  try {
    const trips = await Daytrip.find();
    res.json(trips);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch daytrips' });
  }
};

//GET Daytrip by Id
const getDaytripById = async (req, res) => {
  try {
    const daytrip = await Daytrip.findById(req.params.id).populate('author', 'firstName lastName');;
    if (!daytrip) {
      return res.status(404).json({ message: 'Daytrip not found' });
    }
    res.json(daytrip);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};


module.exports = { 
  createDaytrip,
  getUserDaytrips,
  getAllDaytrips,
  getDaytripById, 
};
