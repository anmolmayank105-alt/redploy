const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: Date, required: true },
  location: { type: String, required: true },
  maxAttendees: { type: Number },
  registeredAttendees: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  collegeId: { type: mongoose.Schema.Types.ObjectId, ref: 'College', required: true },
}, { timestamps: true });

module.exports = mongoose.model('Event', eventSchema);