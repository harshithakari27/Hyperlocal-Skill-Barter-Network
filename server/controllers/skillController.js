const SkillOffer = require('../models/SkillOffer');

const createSkill = async (req, res) => {
  try {
    const userId = req.userId;
    const { title, category, description, hourlyCreditRate, coordinates } = req.body;

    const skill = await SkillOffer.create({
      userId,
      title,
      category,
      description,
      hourlyCreditRate,
      location: {
        type: 'Point',
        coordinates: coordinates || [0, 0]
      }
    });

    res.status(201).json(skill);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const getAllSkills = async (req, res) => {
  try {
    const skills = await SkillOffer.find().populate('userId', 'name email');
    res.json(skills);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const getSkillById = async (req, res) => {
  try {
    const skill = await SkillOffer.findById(req.params.id).populate('userId', 'name email');
    if (!skill) return res.status(404).json({ message: 'Skill not found' });
    res.json(skill);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const getNearbySkills = async (req, res) => {
  try {
    const { lat, lng, radius } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({ message: 'Latitude and longitude are required' });
    }

    const maxDistanceMeters = (radius ? parseFloat(radius) : 10) * 1000;

    const skills = await SkillOffer.find({
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(lng), parseFloat(lat)]
          },
          $maxDistance: maxDistanceMeters
        }
      }
    }).populate('userId', 'name email');

    res.json(skills);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = { createSkill, getAllSkills, getSkillById, getNearbySkills };