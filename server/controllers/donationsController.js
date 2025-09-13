const DonationCampaign = require('../models/DonationCampaign');
const Donation = require('../models/Donation');

// Create a new donation campaign (admin only)
const createCampaign = async (req, res) => {
  try {
    const adminUser = req.user;
    const collegeId = adminUser.collegeId;
    
    const { 
      campaignName, 
      description, 
      targetAmount, 
      endDate, 
      category,
      startDate 
    } = req.body;

    // Validate required fields
    if (!campaignName || !description || !targetAmount || !endDate) {
      return res.status(400).json({
        success: false,
        message: 'Campaign name, description, target amount, and end date are required'
      });
    }

    // Validate target amount
    if (targetAmount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Target amount must be greater than 0'
      });
    }

    // Validate end date is in the future
    const campaignEndDate = new Date(endDate);
    if (campaignEndDate <= new Date()) {
      return res.status(400).json({
        success: false,
        message: 'End date must be in the future'
      });
    }

    // Validate start date if provided
    const campaignStartDate = startDate ? new Date(startDate) : new Date();
    if (campaignStartDate >= campaignEndDate) {
      return res.status(400).json({
        success: false,
        message: 'Start date must be before end date'
      });
    }

    const newCampaign = new DonationCampaign({
      campaignName,
      description,
      targetAmount,
      endDate: campaignEndDate,
      startDate: campaignStartDate,
      collegeId,
      createdBy: adminUser._id,
      category: category || 'other'
    });

    const savedCampaign = await newCampaign.save();
    
    // Populate college and creator info
    const populatedCampaign = await DonationCampaign.findById(savedCampaign._id)
      .populate('collegeId', 'name')
      .populate('createdBy', 'name email');

    res.status(201).json({
      success: true,
      message: 'Donation campaign created successfully',
      data: populatedCampaign
    });

  } catch (error) {
    console.error('Create campaign error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create donation campaign'
    });
  }
};

// Get all donation campaigns for the admin's college
const getCampaigns = async (req, res) => {
  try {
    const adminUser = req.user;
    const collegeId = adminUser.collegeId;

    const campaigns = await DonationCampaign.find({ collegeId })
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 }); // Sort by newest first

    // Add virtual completion percentage to each campaign
    const campaignsWithStats = campaigns.map(campaign => {
      const campaignObj = campaign.toObject();
      campaignObj.completionPercentage = campaign.completionPercentage;
      campaignObj.daysRemaining = Math.max(0, Math.ceil((campaign.endDate - new Date()) / (1000 * 60 * 60 * 24)));
      return campaignObj;
    });

    res.json({
      success: true,
      data: campaignsWithStats
    });

  } catch (error) {
    console.error('Get campaigns error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch donation campaigns'
    });
  }
};

// Delete a donation campaign (admin only)
const deleteCampaign = async (req, res) => {
  try {
    const adminUser = req.user;
    const collegeId = adminUser.collegeId;
    const { campaignId } = req.params;

    // Find and verify campaign belongs to same college
    const campaign = await DonationCampaign.findOne({ 
      _id: campaignId, 
      collegeId 
    });

    if (!campaign) {
      return res.status(404).json({
        success: false,
        message: 'Campaign not found or access denied'
      });
    }

    // Check if campaign has donations
    if (campaign.currentAmount > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete campaign with existing donations (₹${campaign.currentAmount} raised)`
      });
    }

    await DonationCampaign.findByIdAndDelete(campaignId);

    res.json({
      success: true,
      message: 'Donation campaign deleted successfully'
    });

  } catch (error) {
    console.error('Delete campaign error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete donation campaign'
    });
  }
};

// Update a donation campaign (admin only)
const updateCampaign = async (req, res) => {
  try {
    const adminUser = req.user;
    const collegeId = adminUser.collegeId;
    const { campaignId } = req.params;
    
    const { 
      campaignName, 
      description, 
      targetAmount, 
      endDate, 
      category,
      isActive 
    } = req.body;

    // Find and verify campaign belongs to same college
    const campaign = await DonationCampaign.findOne({ 
      _id: campaignId, 
      collegeId 
    });

    if (!campaign) {
      return res.status(404).json({
        success: false,
        message: 'Campaign not found or access denied'
      });
    }

    // Validate target amount if provided
    if (targetAmount !== undefined && targetAmount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Target amount must be greater than 0'
      });
    }

    // Validate end date if provided
    if (endDate) {
      const campaignEndDate = new Date(endDate);
      if (campaignEndDate <= new Date()) {
        return res.status(400).json({
          success: false,
          message: 'End date must be in the future'
        });
      }
    }

    // Update campaign fields
    const updateData = {};
    if (campaignName) updateData.campaignName = campaignName;
    if (description) updateData.description = description;
    if (targetAmount !== undefined) updateData.targetAmount = targetAmount;
    if (endDate) updateData.endDate = new Date(endDate);
    if (category) updateData.category = category;
    if (isActive !== undefined) updateData.isActive = isActive;

    const updatedCampaign = await DonationCampaign.findByIdAndUpdate(
      campaignId, 
      updateData, 
      { new: true }
    ).populate('createdBy', 'name email');

    res.json({
      success: true,
      message: 'Campaign updated successfully',
      data: updatedCampaign
    });

  } catch (error) {
    console.error('Update campaign error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update campaign'
    });
  }
};

// Get donation history for admin's college
const getDonationHistory = async (req, res) => {
  try {
    const adminUser = req.user;
    const collegeId = adminUser.collegeId;

    const donations = await Donation.find({ collegeId })
      .populate('donor', 'name email')
      .sort({ date: -1 })
      .limit(50); // Last 50 donations

    res.json({
      success: true,
      data: donations
    });

  } catch (error) {
    console.error('Get donation history error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch donation history'
    });
  }
};

module.exports = {
  createCampaign,
  getCampaigns,
  deleteCampaign,
  updateCampaign,
  getDonationHistory
};