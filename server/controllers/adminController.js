const User = require('../models/User');
const Alumni = require('../models/Alumni');
const Event = require('../models/Event');
const Donation = require('../models/Donation');
const DonationCampaign = require('../models/DonationCampaign');

// Get admin dashboard statistics
const getStats = async (req, res) => {
  try {
    const adminUser = req.user;
    const collegeId = adminUser.collegeId;

    // Get alumni count for this college
    const alumniCount = await Alumni.countDocuments({ collegeId });

    // Get student count for this college
    const studentCount = await User.countDocuments({ 
      collegeId, 
      role: 'student' 
    });

    // Get total users count for this college
    const totalUsersCount = await User.countDocuments({ collegeId });

    // Get upcoming events count for this college
    const upcomingEventsCount = await Event.countDocuments({
      collegeId,
      date: { $gte: new Date() },
      isActive: true
    });

    // Get total events for this college
    const totalEventsCount = await Event.countDocuments({ collegeId });

    // Get recent events
    const recentEvents = await Event.find({ collegeId })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('title date location registeredAttendees');

    // Get donation statistics
    const totalDonations = await Donation.aggregate([
      { $match: { collegeId, status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$amount' }, count: { $sum: 1 } } }
    ]);

    // Get active donation campaigns
    const activeCampaigns = await DonationCampaign.countDocuments({
      collegeId,
      isActive: true,
      endDate: { $gte: new Date() }
    });

    // Get donation campaigns progress
    const campaignStats = await DonationCampaign.find({
      collegeId,
      isActive: true
    }).select('campaignName targetAmount currentAmount endDate');

    // Calculate total campaign funds raised
    const totalCampaignFunds = campaignStats.reduce((sum, campaign) => sum + campaign.currentAmount, 0);

    const stats = {
      users: {
        total: totalUsersCount,
        alumni: alumniCount,
        students: studentCount
      },
      events: {
        total: totalEventsCount,
        upcoming: upcomingEventsCount,
        recent: recentEvents
      },
      donations: {
        totalAmount: totalDonations[0]?.total || 0,
        totalCount: totalDonations[0]?.count || 0,
        activeCampaigns,
        campaignFundsRaised: totalCampaignFunds,
        campaigns: campaignStats
      },
      collegeInfo: {
        collegeName: adminUser.collegeId?.name,
        collegeId: collegeId
      }
    };

    res.json({
      success: true,
      data: stats
    });

  } catch (error) {
    console.error('Admin stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch admin statistics'
    });
  }
};

// Get all alumni for admin management
const getAllAlumni = async (req, res) => {
  try {
    const adminUser = req.user;
    const collegeId = adminUser.collegeId;

    const alumni = await Alumni.find({ collegeId })
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: alumni
    });

  } catch (error) {
    console.error('Get alumni error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch alumni'
    });
  }
};

// Delete alumni (admin only)
const deleteAlumni = async (req, res) => {
  try {
    const adminUser = req.user;
    const collegeId = adminUser.collegeId;
    const { alumniId } = req.params;

    // Find and verify alumni belongs to same college
    const alumni = await Alumni.findOne({ 
      _id: alumniId, 
      collegeId 
    });

    if (!alumni) {
      return res.status(404).json({
        success: false,
        message: 'Alumni not found or access denied'
      });
    }

    // Delete alumni record
    await Alumni.findByIdAndDelete(alumniId);

    // Optional: Also delete the user account
    // await User.findByIdAndDelete(alumni.userId);

    res.json({
      success: true,
      message: 'Alumni deleted successfully'
    });

  } catch (error) {
    console.error('Delete alumni error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete alumni'
    });
  }
};

// Get all students for admin management
const getAllStudents = async (req, res) => {
  try {
    const adminUser = req.user;
    const collegeId = adminUser.collegeId;

    const students = await User.find({ 
      collegeId, 
      role: 'student' 
    }).select('name email createdAt').sort({ createdAt: -1 });

    res.json({
      success: true,
      data: students
    });

  } catch (error) {
    console.error('Get students error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch students'
    });
  }
};

module.exports = {
  getStats,
  getAllAlumni,
  deleteAlumni,
  getAllStudents
};