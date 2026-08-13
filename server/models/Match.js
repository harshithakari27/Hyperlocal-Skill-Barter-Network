const mongoose = require('mongoose');

const matchSchema = new mongoose.Schema({
  skillId: { type: mongoose.Schema.Types.ObjectId, ref: 'SkillOffer', required: true },
  requesterId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  offererId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['pending', 'accepted', 'rejected', 'completed'], default: 'pending' }
}, { timestamps: true });

module.exports = mongoose.model('Match', matchSchema);