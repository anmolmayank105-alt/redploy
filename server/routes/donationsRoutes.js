const express = require('express');
const router = express.Router();
const donationsController = require('../controllers/donationsController');
const { auth } = require('../middleware/auth');
const roleAuth = require('../middleware/roleAuth');

// All routes require authentication
router.use(auth);

// Public routes (for viewing campaigns)
router.get('/campaigns', donationsController.getCampaigns);

// Admin-only routes
router.use(roleAuth(['admin']));

// POST /api/donations/campaign - Create donation campaign (admin only)
router.post('/campaign', donationsController.createCampaign);

// PUT /api/donations/campaign/:campaignId - Update campaign (admin only)
router.put('/campaign/:campaignId', donationsController.updateCampaign);

// DELETE /api/donations/campaign/:campaignId - Delete campaign (admin only)
router.delete('/campaign/:campaignId', donationsController.deleteCampaign);

// GET /api/donations/history - Get donation history (admin only)
router.get('/history', donationsController.getDonationHistory);

module.exports = router;