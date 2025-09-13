const College = require('../models/College');
const Alumni = require('../models/Alumni');
const Event = require('../models/Event');
const DonationCampaign = require('../models/DonationCampaign');

// Get all colleges
const getAllColleges = async (req, res) => {
  try {
    const colleges = await College.find().sort({ name: 1 });
    res.json(colleges);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get college by ID
const getCollegeById = async (req, res) => {
  try {
    const college = await College.findById(req.params.id);
    if (!college) {
      return res.status(404).json({ message: 'College not found' });
    }
    res.json(college);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create new college
const createCollege = async (req, res) => {
  try {
    const { name, address, description, logoUrl } = req.body;
    
    const college = new College({
      name,
      address,
      description,
      logoUrl
    });
    
    const savedCollege = await college.save();
    res.status(201).json(savedCollege);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'College name already exists' });
    }
    res.status(400).json({ message: error.message });
  }
};

// Update college
const updateCollege = async (req, res) => {
  try {
    const { name, address, description, logoUrl } = req.body;
    
    const college = await College.findByIdAndUpdate(
      req.params.id,
      { name, address, description, logoUrl },
      { new: true, runValidators: true }
    );
    
    if (!college) {
      return res.status(404).json({ message: 'College not found' });
    }
    
    res.json(college);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'College name already exists' });
    }
    res.status(400).json({ message: error.message });
  }
};

// Delete college
const deleteCollege = async (req, res) => {
  try {
    const college = await College.findByIdAndDelete(req.params.id);
    if (!college) {
      return res.status(404).json({ message: 'College not found' });
    }
    res.json({ message: 'College deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get public college data (alumni highlights, events, donation campaigns)
const getCollegePublicData = async (req, res) => {
  try {
    const collegeId = req.params.id;
    
    // Get college info
    const college = await College.findById(collegeId);
    if (!college) {
      return res.status(404).json({ message: 'College not found' });
    }

    // Get alumni highlights (top 6 recent alumni)
    const alumniHighlights = await Alumni.find({ collegeId })
      .populate('userId', 'name email')
      .sort({ createdAt: -1 })
      .limit(6)
      .select('graduationYear degree currentJob skills bio');

    // Get upcoming events (next 5)
    const upcomingEvents = await Event.find({
      collegeId,
      date: { $gte: new Date() },
      isActive: true
    })
      .sort({ date: 1 })
      .limit(5)
      .select('title description date location eventType maxAttendees');

    // Get active donation campaigns (top 3)
    const activeCampaigns = await DonationCampaign.find({
      collegeId,
      isActive: true,
      endDate: { $gte: new Date() }
    })
      .sort({ createdAt: -1 })
      .limit(3)
      .select('campaignName description targetAmount currentAmount endDate category');

    // Add completion percentage to campaigns
    const campaignsWithStats = activeCampaigns.map(campaign => {
      const campaignObj = campaign.toObject();
      campaignObj.completionPercentage = campaign.targetAmount > 0 
        ? Math.round((campaign.currentAmount / campaign.targetAmount) * 100) 
        : 0;
      campaignObj.daysRemaining = Math.max(0, Math.ceil((campaign.endDate - new Date()) / (1000 * 60 * 60 * 24)));
      return campaignObj;
    });

    // Get some basic statistics
    const totalAlumni = await Alumni.countDocuments({ collegeId });
    const totalEvents = await Event.countDocuments({ collegeId });
    const totalActiveCampaigns = await DonationCampaign.countDocuments({
      collegeId,
      isActive: true,
      endDate: { $gte: new Date() }
    });

    const publicData = {
      college: {
        _id: college._id,
        name: college.name,
        description: college.description,
        logoUrl: college.logoUrl,
        address: college.address
      },
      statistics: {
        totalAlumni,
        totalEvents,
        totalActiveCampaigns
      },
      alumniHighlights,
      upcomingEvents,
      activeCampaigns: campaignsWithStats
    };

    res.json({
      success: true,
      data: publicData
    });

  } catch (error) {
    console.error('Get college public data error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch college public data' 
    });
  }
};

module.exports = {
  getAllColleges,
  getCollegeById,
  createCollege,
  updateCollege,
  deleteCollege,
  getCollegePublicData
};