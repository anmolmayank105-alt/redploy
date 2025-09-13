const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  enrollmentYear: { type: Number, required: true },
  department: { type: String, required: true },
  year: { type: Number, required: true },
  phone: { type: String },
  collegeId: { type: mongoose.Schema.Types.ObjectId, ref: 'College', required: true },
}, { timestamps: true });

module.exports = mongoose.model('Student', studentSchema);