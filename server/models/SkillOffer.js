const mongoose = require('mongoose');

const skillOfferSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  category: { type: String, required: true },
  description: { type: String },
  hourlyCreditRate: { type: Number, default: 1 },
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], default: [0, 0] }
  }
}, { timestamps: true });

skillOfferSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('SkillOffer', skillOfferSchema);