const express = require('express');
const router = express.Router();
const {
  submitAssignment,
  getSubmissionsForAssignment,
  getMySubmissions,
  gradeSubmission,
} = require('../controllers/submission.controller');
const { protect } = require('../middleware/auth.middleware');
const { role } = require('../middleware/role.middleware');
const upload = require('../middleware/upload.middleware');

router.post('/', protect, role(['STUDENT']), upload.single('file'), submitAssignment);
router.get('/my', protect, role(['STUDENT']), getMySubmissions);
router.get('/assignment/:assignmentId', protect, role(['FACULTY']), getSubmissionsForAssignment);
router.put('/:id/grade', protect, role(['FACULTY']), gradeSubmission);

module.exports = router;
