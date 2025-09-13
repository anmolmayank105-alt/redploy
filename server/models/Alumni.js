const mongoose = require('mongoose');

const alumniSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  collegeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'College',
    required: true
  },
  graduationYear: {
    type: Number,
    required: true
  },
  degree: {
    type: String,
    required: true,
    trim: true
  },
  currentJob: {
    type: String,
    trim: true
  },
  achievements: {
    type: String,
    trim: true
  },
  linkedin: {
    type: String,
    trim: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Alumni', alumniSchema);