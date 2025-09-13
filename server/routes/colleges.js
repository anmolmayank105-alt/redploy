const express = require('express');
const router = express.Router();
const {
  getAllColleges,
  getCollegeById,
  createCollege,
  updateCollege,
  deleteCollege,
  getCollegePublicData
} = require('../controllers/collegeController');

// GET /api/colleges - Get all colleges
router.get('/', getAllColleges);

// GET /api/colleges/:id - Get college by ID
router.get('/:id', getCollegeById);

// GET /api/colleges/:id/public - Get public college data
router.get('/:id/public', getCollegePublicData);

// POST /api/colleges - Create new college
router.post('/', createCollege);

// PUT /api/colleges/:id - Update college
router.put('/:id', updateCollege);

// DELETE /api/colleges/:id - Delete college
router.delete('/:id', deleteCollege);

module.exports = router;