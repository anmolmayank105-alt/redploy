const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
  donor: { type: mongoose.Schema.Types.ObjectId, ref: 'Alumni', required: true },
  amount: { type: Number, required: true },
  date: { type: Date, default: Date.now },
  purpose: { type: String, required: true },
  status: { type: String, enum: ['pending', 'completed'], default: 'pending' },
  collegeId: { type: mongoose.Schema.Types.ObjectId, ref: 'College', required: true },
}, { timestamps: true });

module.exports = mongoose.model('Donation', donationSchema);