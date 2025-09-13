const Alumni = require('../models/Alumni');
const User = require('../models/User');

// Get all alumni (optionally filtered by collegeId)
const getAllAlumni = async (req, res) => {
  try {
    const { collegeId } = req.query;
    
    let filter = {};
    if (collegeId) {
      filter.collegeId = collegeId;
    }
    
    const alumni = await Alumni.find(filter)
      .populate('userId', 'name email')
      .populate('collegeId', 'name')
      .sort({ graduationYear: -1 });
    
    res.json(alumni);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get alumni by ID
const getAlumniById = async (req, res) => {
  try {
    const alumni = await Alumni.findById(req.params.id)
      .populate('userId', 'name email')
      .populate('collegeId', 'name address');
    
    if (!alumni) {
      return res.status(404).json({ message: 'Alumni not found' });
    }
    
    res.json(alumni);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create new alumni profile
const createAlumni = async (req, res) => {
  try {
    const { userId, collegeId, graduationYear, degree, currentJob, achievements, linkedin } = req.body;
    
    // Check if user exists and has alumni role
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    if (user.role !== 'alumni') {
      return res.status(400).json({ message: 'User must have alumni role' });
    }
    
    // Check if alumni profile already exists for this user
    const existingAlumni = await Alumni.findOne({ userId });
    if (existingAlumni) {
      return res.status(400).json({ message: 'Alumni profile already exists for this user' });
    }
    
    const alumni = new Alumni({
      userId,
      collegeId,
      graduationYear,
      degree,
      currentJob,
      achievements,
      linkedin
    });
    
    const savedAlumni = await alumni.save();
    const populatedAlumni = await Alumni.findById(savedAlumni._id)
      .populate('userId', 'name email')
      .populate('collegeId', 'name');
    
    res.status(201).json(populatedAlumni);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update alumni profile
const updateAlumni = async (req, res) => {
  try {
    const { graduationYear, degree, currentJob, achievements, linkedin } = req.body;
    
    const alumni = await Alumni.findByIdAndUpdate(
      req.params.id,
      { graduationYear, degree, currentJob, achievements, linkedin },
      { new: true, runValidators: true }
    ).populate('userId', 'name email').populate('collegeId', 'name');
    
    if (!alumni) {
      return res.status(404).json({ message: 'Alumni not found' });
    }
    
    res.json(alumni);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete alumni profile
const deleteAlumni = async (req, res) => {
  try {
    const alumni = await Alumni.findByIdAndDelete(req.params.id);
    if (!alumni) {
      return res.status(404).json({ message: 'Alumni not found' });
    }
    res.json({ message: 'Alumni profile deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllAlumni,
  getAlumniById,
  createAlumni,
  updateAlumni,
  deleteAlumni
};