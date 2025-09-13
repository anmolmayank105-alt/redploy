const mongoose = require('mongoose');

const donationCampaignSchema = new mongoose.Schema({
  campaignName: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  targetAmount: {
    type: Number,
    required: true,
    min: 0
  },
  currentAmount: {
    type: Number,
    default: 0,
    min: 0
  },
  collegeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'College',
    required: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  startDate: {
    type: Date,
    default: Date.now
  },
  endDate: {
    type: Date,
    required: true
  },
  category: {
    type: String,
    enum: ['infrastructure', 'scholarship', 'research', 'sports', 'cultural', 'emergency', 'other'],
    default: 'other'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  donors: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    amount: {
      type: Number,
      required: true,
      min: 0
    },
    donatedAt: {
      type: Date,
      default: Date.now
    },
    isAnonymous: {
      type: Boolean,
      default: false
    }
  }]
}, {
  timestamps: true
});

// Index for efficient queries
donationCampaignSchema.index({ collegeId: 1, isActive: 1 });
donationCampaignSchema.index({ collegeId: 1, endDate: 1 });

// Virtual for completion percentage
donationCampaignSchema.virtual('completionPercentage').get(function() {
  return this.targetAmount > 0 ? Math.round((this.currentAmount / this.targetAmount) * 100) : 0;
});

// Method to add donation
donationCampaignSchema.methods.addDonation = function(userId, amount, isAnonymous = false) {
  this.donors.push({
    userId,
    amount,
    isAnonymous
  });
  this.currentAmount += amount;
  return this.save();
};

module.exports = mongoose.model('DonationCampaign', donationCampaignSchema);