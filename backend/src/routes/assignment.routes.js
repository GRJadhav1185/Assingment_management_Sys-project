const express = require('express');
const router = express.Router();
const {
  createAssignment,
  getAssignments,
  getAssignmentById,
  deleteAssignment,
} = require('../controllers/assignment.controller');
const { protect } = require('../middleware/auth.middleware');
const { role } = require('../middleware/role.middleware');

router.route('/')
  .post(protect, role(['FACULTY']), createAssignment)
  .get(protect, getAssignments);

router.route('/:id')
  .get(protect, getAssignmentById)
  .delete(protect, role(['FACULTY']), deleteAssignment);

module.exports = router;
