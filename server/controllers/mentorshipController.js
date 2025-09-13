const MentorshipRequest = require('../models/Mentorship');
const User = require('../models/User');

// @desc    Create mentorship request
// @route   POST /api/mentorship
// @access  Private (Student only)
const createMentorshipRequest = async (req, res) => {
  try {
    const { alumniId, message } = req.body;
    const studentId = req.user._id;
    const collegeId = req.user.collegeId;

    // Validate required fields
    if (!alumniId || !message) {
      return res.status(400).json({
        success: false,
        message: 'Alumni ID and message are required'
      });
    }

    // Verify alumni exists and is from same college
    const alumni = await User.findOne({
      _id: alumniId,
      role: 'alumni',
      collegeId: collegeId
    });

    if (!alumni) {
      return res.status(404).json({
        success: false,
        message: 'Alumni not found or not from your college'
      });
    }

    // Check if request already exists
    const existingRequest = await MentorshipRequest.findOne({
      studentId,
      alumniId,
      status: { $in: ['pending', 'accepted'] }
    });

    if (existingRequest) {
      return res.status(400).json({
        success: false,
        message: 'You already have a pending or active mentorship request with this alumni'
      });
    }

    // Create mentorship request
    const mentorshipRequest = await MentorshipRequest.create({
      studentId,
      alumniId,
      collegeId,
      message
    });

    // Populate user data
    await mentorshipRequest.populate([
      { path: 'studentId', select: 'name email' },
      { path: 'alumniId', select: 'name email' },
      { path: 'collegeId', select: 'name' }
    ]);

    res.status(201).json({
      success: true,
      message: 'Mentorship request sent successfully',
      data: mentorshipRequest
    });

  } catch (error) {
    console.error('Create mentorship request error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating mentorship request'
    });
  }
};

// @desc    Get student's mentorship requests
// @route   GET /api/mentorship/student
// @access  Private (Student only)
const getStudentRequests = async (req, res) => {
  try {
    const studentId = req.user._id;
    const collegeId = req.user.collegeId;

    const requests = await MentorshipRequest.find({
      studentId,
      collegeId
    })
    .populate('alumniId', 'name email')
    .populate('collegeId', 'name')
    .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: requests
    });

  } catch (error) {
    console.error('Get student requests error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching mentorship requests'
    });
  }
};

// @desc    Get alumni's incoming mentorship requests
// @route   GET /api/mentorship/alumni
// @access  Private (Alumni only)
const getAlumniRequests = async (req, res) => {
  try {
    const alumniId = req.user._id;
    const collegeId = req.user.collegeId;

    const requests = await MentorshipRequest.find({
      alumniId,
      collegeId
    })
    .populate('studentId', 'name email')
    .populate('collegeId', 'name')
    .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: requests
    });

  } catch (error) {
    console.error('Get alumni requests error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching mentorship requests'
    });
  }
};

// @desc    Update mentorship request status
// @route   PUT /api/mentorship/:id
// @access  Private (Alumni only)
const updateMentorshipRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, responseMessage } = req.body;
    const alumniId = req.user._id;

    // Validate status
    if (!['accepted', 'declined'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be accepted or declined'
      });
    }

    // Find and update request
    const request = await MentorshipRequest.findOneAndUpdate(
      {
        _id: id,
        alumniId,
        status: 'pending'
      },
      {
        status,
        responseMessage: responseMessage || ''
      },
      { new: true }
    )
    .populate('studentId', 'name email')
    .populate('alumniId', 'name email')
    .populate('collegeId', 'name');

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Mentorship request not found or already processed'
      });
    }

    res.status(200).json({
      success: true,
      message: `Mentorship request ${status}`,
      data: request
    });

  } catch (error) {
    console.error('Update mentorship request error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating mentorship request'
    });
  }
};

module.exports = {
  createMentorshipRequest,
  getStudentRequests,
  getAlumniRequests,
  updateMentorshipRequest
};