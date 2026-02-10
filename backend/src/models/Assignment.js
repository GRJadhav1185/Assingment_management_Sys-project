const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  courseCode: {
    type: String,
    required: true,
  },
  dueDate: {
    type: Date,
    required: true,
  },
  facultyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, {
  timestamps: true,
});

const Assignment = mongoose.model('Assignment', assignmentSchema);

module.exports = Assignment;
