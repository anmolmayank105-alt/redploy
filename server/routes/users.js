const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { auth } = require('../middleware/auth');

// @route   GET /api/users/alumni/:collegeId
// @desc    Get alumni from specific college
// @access  Private
router.get('/alumni/:collegeId', auth, async (req, res) => {
  try {
    const { collegeId } = req.params;
    
    // Find alumni from the specified college
    const alumni = await User.find({
      collegeId: collegeId,
      role: 'alumni',
      isActive: true
    })
    .populate('collegeId', 'name address')
    .select('-password')
    .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      data: alumni,
      count: alumni.length
    });
    
  } catch (error) {
    console.error('Error fetching alumni:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching alumni'
    });
  }
});

// @route   GET /api/users/alumni/my-college
// @desc    Get alumni from current user's college
// @access  Private
router.get('/alumni/my-college', auth, async (req, res) => {
  try {
    const currentUser = await User.findById(req.user.id);
    
    if (!currentUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    let alumni = [];
    
    if (currentUser.collegeId) {
      // User has a college from database
      alumni = await User.find({
        collegeId: currentUser.collegeId,
        role: 'alumni',
        isActive: true,
        _id: { $ne: currentUser._id } // Exclude current user
      })
      .populate('collegeId', 'name address')
      .select('-password')
      .sort({ createdAt: -1 });
    } else if (currentUser.customCollegeName) {
      // User has custom college name
      alumni = await User.find({
        customCollegeName: currentUser.customCollegeName,
        role: 'alumni',
        isActive: true,
        _id: { $ne: currentUser._id } // Exclude current user
      })
      .select('-password')
      .sort({ createdAt: -1 });
    }
    
    res.json({
      success: true,
      data: alumni,
      count: alumni.length,
      collegeName: currentUser.collegeId ? 
        (currentUser.collegeId.name || 'Unknown College') : 
        currentUser.customCollegeName
    });
    
  } catch (error) {
    console.error('Error fetching college alumni:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching college alumni'
    });
  }
});

// @route   GET /api/users/students/:collegeId
// @desc    Get students from specific college
// @access  Private
router.get('/students/:collegeId', auth, async (req, res) => {
  try {
    const { collegeId } = req.params;
    
    // Find students from the specified college
    const students = await User.find({
      collegeId: collegeId,
      role: 'student',
      isActive: true
    })
    .populate('collegeId', 'name address')
    .select('-password')
    .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      data: students,
      count: students.length
    });
    
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching students'
    });
  }
});

module.exports = router;