const Match = require('../models/Match');
const SkillOffer = require('../models/SkillOffer');
const User = require('../models/User');

const requestMatch = async (req, res) => {
  try {
    const requesterId = req.userId;
    const { skillId } = req.body;

    const skill = await SkillOffer.findById(skillId);
    if (!skill) return res.status(404).json({ message: 'Skill not found' });

    if (skill.userId.toString() === requesterId) {
      return res.status(400).json({ message: "You can't request your own skill" });
    }

    const match = await Match.create({
      skillId,
      requesterId,
      offererId: skill.userId,
      status: 'pending'
    });

    res.status(201).json(match);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const getMyMatches = async (req, res) => {
  try {
    const { userId } = req.params;

    const matches = await Match.find({
      $or: [{ requesterId: userId }, { offererId: userId }]
    })
      .populate('skillId', 'title category hourlyCreditRate')
      .populate('requesterId', 'name email')
      .populate('offererId', 'name email');

    res.json(matches);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const updateMatchStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const match = await Match.findById(id);
    if (!match) return res.status(404).json({ message: 'Match not found' });

    if (match.offererId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Only the skill offerer can accept or reject this request' });
    }

    match.status = status;
    await match.save();

    res.json(match);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const completeMatch = async (req, res) => {
  try {
    const { id } = req.params;

    const match = await Match.findById(id).populate('skillId');
    if (!match) return res.status(404).json({ message: 'Match not found' });

    if (match.requesterId.toString() !== req.userId && match.offererId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized for this match' });
    }

    if (match.status !== 'accepted') {
      return res.status(400).json({ message: 'Match must be accepted before completing' });
    }

    const creditAmount = match.skillId.hourlyCreditRate || 1;

    await User.findByIdAndUpdate(match.requesterId, { $inc: { creditBalance: -creditAmount } });
    await User.findByIdAndUpdate(match.offererId, { $inc: { creditBalance: creditAmount } });

    match.status = 'completed';
    await match.save();

    res.json({ message: 'Match completed, credits transferred', match });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = { requestMatch, getMyMatches, updateMatchStatus, completeMatch };