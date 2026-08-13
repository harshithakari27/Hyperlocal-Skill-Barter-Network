const Message = require('../models/Message');

const getMessages = async (req, res) => {
  try {
    const { matchId } = req.params;
    const messages = await Message.find({ matchId }).sort({ createdAt: 1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = { getMessages };
