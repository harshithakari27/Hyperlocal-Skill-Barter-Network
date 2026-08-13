const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], default: [0, 0] }
  },
  creditBalance: { type: Number, default: 50 }
}, { timestamps: true });

userSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('User', userSchema);