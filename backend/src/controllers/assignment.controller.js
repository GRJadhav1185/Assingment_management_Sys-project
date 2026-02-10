const asyncHandler = require('express-async-handler');
const Assignment = require('../models/Assignment');

// @desc    Create a new assignment
// @route   POST /api/assignments
// @access  Private/Faculty
const createAssignment = asyncHandler(async (req, res) => {
  const { title, description, courseCode, dueDate } = req.body;

  const assignment = await Assignment.create({
    title,
    description,
    courseCode,
    dueDate,
    facultyId: req.user._id,
  });

  res.status(201).json(assignment);
});

// @desc    Get all assignments
// @route   GET /api/assignments
// @access  Private
const getAssignments = asyncHandler(async (req, res) => {
  const assignments = await Assignment.find().populate('facultyId', 'name email');
  res.json(assignments);
});

// @desc    Get assignment by ID
// @route   GET /api/assignments/:id
// @access  Private
const getAssignmentById = asyncHandler(async (req, res) => {
  const assignment = await Assignment.findById(req.params.id).populate('facultyId', 'name email');

  if (assignment) {
    res.json(assignment);
  } else {
    res.status(404);
    throw new Error('Assignment not found');
  }
});

// @desc    Delete assignment
// @route   DELETE /api/assignments/:id
// @access  Private/Faculty
const deleteAssignment = asyncHandler(async (req, res) => {
  const assignment = await Assignment.findById(req.params.id);

  if (!assignment) {
    res.status(404);
    throw new Error('Assignment not found');
  }

  // Check if user is the faculty who created the assignment
  if (assignment.facultyId.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('Not authorized to delete this assignment');
  }

  await assignment.deleteOne();
  res.json({ message: 'Assignment removed' });
});

module.exports = {
  createAssignment,
  getAssignments,
  getAssignmentById,
  deleteAssignment,
};
