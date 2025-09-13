const mongoose = require('mongoose');

const collegeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  address: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  logoUrl: {
    type: String,
    default: null
  }
}, { timestamps: true });

module.exports = mongoose.model('College', collegeSchema);