const Daytrip = require('../models/Daytrip');

const createDaytrip = async (req, res) => {
  try {
    const {
      title,
      author,
      locations,
      images,
      countyTags,
      tags,
      travelType,
    } = req.body;

    const daytrip = new Daytrip({
      title,
      author,
      locations,
      images,
      countyTags,
      tags,
      travelType,
    });

    await daytrip.save();
    res.status(201).json(daytrip);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create daytrip', error: err.message });
  }
};

module.exports = { createDaytrip };
