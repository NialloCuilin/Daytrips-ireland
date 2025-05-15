const Activity = require('../models/Activity');
const User = require('../models/User');

const getUserFeed = async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const followingIds = user.following;

    const feed = await Activity.find({ actor: { $in: followingIds } })
        .sort({ createdAt: -1 })
        .populate('actor', 'firstName lastName avatar')
        .populate('targetUser', 'firstName lastName avatar')
        .populate('daytrip', 'title images averageRating')
        .select('type actor targetUser daytrip achievement createdAt value') // ✅ include 'value'
        .limit(50);

    res.json(feed);
  } catch (err) {
    console.error('getUserFeed error:', err);
    res.status(500).json({ message: 'Failed to load feed', error: err.message });
  }
};


module.exports = { getUserFeed };
