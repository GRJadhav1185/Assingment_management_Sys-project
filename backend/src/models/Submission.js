const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
  assignmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Assignment',
    required: true,
  },
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  filePath: {
    type: String,
    required: true,
  },
  plagiarismScore: {
    type: Number,
    default: 0,
  },
  grade: {
    type: Number,
  },
  feedback: {
    type: String,
  },
  status: {
    type: String,
    enum: ['ON_TIME', 'LATE'],
    required: true,
  },
  submittedAt: {
    type: Date,
    default: Date.now,
  },
  gradedAt: {
    type: Date,
  },
}, {
  timestamps: true,
});

const Submission = mongoose.model('Submission', submissionSchema);

module.exports = Submission;
