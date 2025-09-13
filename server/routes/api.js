const express = require('express');
const router = express.Router();

// Import route modules
const authRoutes = require('./auth');
const collegeRoutes = require('./colleges');
const alumniRoutes = require('./alumni');
const usersRoutes = require('./users');
const mentorshipRoutes = require('./mentorshipRoutes');
const adminRoutes = require('./adminRoutes');
const eventsRoutes = require('./eventsRoutes');
const donationsRoutes = require('./donationsRoutes');

// Test route to verify API is working
router.get('/test', (req, res) => {
  res.json({ 
    message: "API working",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Mount route modules
router.use('/auth', authRoutes);
router.use('/colleges', collegeRoutes);
router.use('/alumni', alumniRoutes);
router.use('/users', usersRoutes);
router.use('/mentorship', mentorshipRoutes);
router.use('/admin', adminRoutes);
router.use('/events', eventsRoutes);
router.use('/donations', donationsRoutes);

module.exports = router;