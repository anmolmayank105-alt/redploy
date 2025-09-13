const express = require('express');
const router = express.Router();
const {
  getAllAlumni,
  getAlumniById,
  createAlumni,
  updateAlumni,
  deleteAlumni
} = require('../controllers/alumniController');

// GET /api/alumni - Get all alumni (optionally filtered by collegeId)
router.get('/', getAllAlumni);

// GET /api/alumni/:id - Get alumni by ID
router.get('/:id', getAlumniById);

// POST /api/alumni - Create new alumni profile
router.post('/', createAlumni);

// PUT /api/alumni/:id - Update alumni profile
router.put('/:id', updateAlumni);

// DELETE /api/alumni/:id - Delete alumni profile
router.delete('/:id', deleteAlumni);

module.exports = router;