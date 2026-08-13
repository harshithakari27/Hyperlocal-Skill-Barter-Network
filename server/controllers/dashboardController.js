const mongoose = require('mongoose');
const SkillOffer = require('../models/SkillOffer');
const Match = require('../models/Match');
const User = require('../models/User');

const getDashboardStats = async (req, res) => {
  try {
    const { userId } = req.params;

    const skillsPosted = await SkillOffer.countDocuments({ userId });

    const skillsByCategoryRaw = await SkillOffer.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);
    const skillsByCategory = skillsByCategoryRaw.map(c => ({ category: c._id, count: c.count }));

    const matches = await Match.find({
      $or: [{ requesterId: userId }, { offererId: userId }]
    });

    const matchesByStatus = { pending: 0, accepted: 0, rejected: 0, completed: 0 };
    matches.forEach((m) => {
      matchesByStatus[m.status] = (matchesByStatus[m.status] || 0) + 1;
    });

    const user = await User.findById(userId);

    res.json({
      skillsPosted,
      skillsByCategory,
      matchesByStatus,
      creditBalance: user ? user.creditBalance : 0
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = { getDashboardStats };