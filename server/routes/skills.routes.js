const express = require('express');
const router = express.Router();
const { createSkill, getAllSkills, getSkillById, getNearbySkills } = require('../controllers/skillController');
const protect = require('../middleware/authMiddleware');

router.post('/', protect, createSkill);
router.get('/nearby', getNearbySkills);
router.get('/', getAllSkills);
router.get('/:id', getSkillById);

module.exports = router;