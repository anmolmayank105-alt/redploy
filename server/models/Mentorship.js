const mongoose = require('mongoose');

const mentorshipRequestSchema = new mongoose.Schema({
  studentId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  alumniId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  collegeId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'College', 
    required: true 
  },
  message: { 
    type: String, 
    required: true,
    maxlength: 500
  },
  status: { 
    type: String, 
    enum: ['pending', 'accepted', 'declined', 'completed'], 
    default: 'pending' 
  },
  responseMessage: {
    type: String,
    maxlength: 500
  }
}, { 
  timestamps: true 
});

// Index for efficient queries
mentorshipRequestSchema.index({ studentId: 1, collegeId: 1 });
mentorshipRequestSchema.index({ alumniId: 1, collegeId: 1 });

module.exports = mongoose.model('MentorshipRequest', mentorshipRequestSchema);