const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { auth } = require('../middleware/auth');
const roleAuth = require('../middleware/roleAuth');

// All admin routes require authentication and admin role
router.use(auth);
router.use(roleAuth(['admin']));

// GET /api/admin/stats - Get dashboard statistics
router.get('/stats', adminController.getStats);

// GET /api/admin/alumni - Get all alumni for management
router.get('/alumni', adminController.getAllAlumni);

// DELETE /api/admin/alumni/:alumniId - Delete alumni
router.delete('/alumni/:alumniId', adminController.deleteAlumni);

// GET /api/admin/students - Get all students for management
router.get('/students', adminController.getAllStudents);

module.exports = router;