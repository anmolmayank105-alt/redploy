const express = require('express');
const router = express.Router();
const eventsController = require('../controllers/eventsController');
const { auth } = require('../middleware/auth');
const roleAuth = require('../middleware/roleAuth');

// Public routes (for students/alumni to view events)
router.get('/', auth, eventsController.getEvents);

// Admin-only routes
router.use(roleAuth(['admin']));

// POST /api/events - Create new event (admin only)
router.post('/', eventsController.createEvent);

// PUT /api/events/:eventId - Update event (admin only)
router.put('/:eventId', eventsController.updateEvent);

// DELETE /api/events/:eventId - Delete event (admin only)
router.delete('/:eventId', eventsController.deleteEvent);

module.exports = router;