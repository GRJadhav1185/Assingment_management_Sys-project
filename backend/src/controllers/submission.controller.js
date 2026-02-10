const asyncHandler = require('express-async-handler');
const Submission = require('../models/Submission');
const Assignment = require('../models/Assignment');
const { checkPlagiarism } = require('../utils/plagiarism.service');

// @desc    Submit an assignment
// @route   POST /api/submissions
// @access  Private/Student
const submitAssignment = asyncHandler(async (req, res) => {
  const { assignmentId } = req.body;
  const file = req.file;

  if (!file) {
    res.status(400);
    throw new Error('Please upload a file');
  }

  const assignment = await Assignment.findById(assignmentId);
  if (!assignment) {
    res.status(404);
    throw new Error('Assignment not found');
  }

  // Check if already submitted
  const existingSubmission = await Submission.findOne({
    assignmentId,
    studentId: req.user._id,
  });

  if (existingSubmission) {
    res.status(400);
    throw new Error('You have already submitted this assignment');
  }

  // Determine status
  const now = new Date();
  const dueDate = new Date(assignment.dueDate);
  const status = now <= dueDate ? 'ON_TIME' : 'LATE';

  // Check plagiarism (Mock)
  const plagiarismScore = await checkPlagiarism(file.path);

  const submission = await Submission.create({
    assignmentId,
    studentId: req.user._id,
    filePath: file.path,
    plagiarismScore,
    status,
    submittedAt: now,
  });

  res.status(201).json(submission);
});

// @desc    Get submissions for a specific assignment
// @route   GET /api/submissions/assignment/:assignmentId
// @access  Private/Faculty
const getSubmissionsForAssignment = asyncHandler(async (req, res) => {
  const submissions = await Submission.find({ assignmentId: req.params.assignmentId })
    .populate('studentId', 'name email')
    .populate('assignmentId', 'title');

  res.json(submissions);
});

// @desc    Get my submissions
// @route   GET /api/submissions/my
// @access  Private/Student
const getMySubmissions = asyncHandler(async (req, res) => {
  const submissions = await Submission.find({ studentId: req.user._id })
    .populate('assignmentId', 'title courseCode dueDate');
  res.json(submissions);
});

// @desc    Grade a submission
// @route   PUT /api/submissions/:id/grade
// @access  Private/Faculty
const gradeSubmission = asyncHandler(async (req, res) => {
  const { grade, feedback } = req.body;
  const submission = await Submission.findById(req.params.id);

  if (!submission) {
    res.status(404);
    throw new Error('Submission not found');
  }

  submission.grade = grade;
  submission.feedback = feedback;
  submission.gradedAt = Date.now();

  const updatedSubmission = await submission.save();
  res.json(updatedSubmission);
});

module.exports = {
  submitAssignment,
  getSubmissionsForAssignment,
  getMySubmissions,
  gradeSubmission,
};
