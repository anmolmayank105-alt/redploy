const express = require('express');
const { 
  createMentorshipRequest, 
  getStudentRequests, 
  getAlumniRequests, 
  updateMentorshipRequest 
} = require('../controllers/mentorshipController');
const { auth } = require('../middleware/auth');
const roleAuth = require('../middleware/roleAuth');

const router = express.Router();

// Apply authentication middleware to all routes
router.use(auth);

// @route   POST /api/mentorship
// @desc    Student requests mentorship
// @access  Private (Student only)
router.post('/', roleAuth(['student']), createMentorshipRequest);

// @route   GET /api/mentorship/student
// @desc    Get student's mentorship requests
// @access  Private (Student only)
router.get('/student', roleAuth(['student']), getStudentRequests);

// @route   GET /api/mentorship/alumni
// @desc    Get alumni's incoming mentorship requests
// @access  Private (Alumni only)
router.get('/alumni', roleAuth(['alumni']), getAlumniRequests);

// @route   PUT /api/mentorship/:id
// @desc    Update mentorship request status (accept/decline)
// @access  Private (Alumni only)
router.put('/:id', roleAuth(['alumni']), updateMentorshipRequest);

module.exports = router;