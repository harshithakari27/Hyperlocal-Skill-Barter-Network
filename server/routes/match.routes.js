const express = require('express');
const router = express.Router();
const { requestMatch, getMyMatches, updateMatchStatus, completeMatch } = require('../controllers/matchController');
const protect = require('../middleware/authMiddleware');

router.post('/', protect, requestMatch);
router.get('/user/:userId', getMyMatches);
router.patch('/:id', protect, updateMatchStatus);
router.patch('/:id/complete', protect, completeMatch);

module.exports = router;