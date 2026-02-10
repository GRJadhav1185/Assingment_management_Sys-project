const express = require('express');
const cors = require('cors');
const path = require('path');
const authRoutes = require('./routes/auth.routes');
const assignmentRoutes = require('./routes/assignment.routes');
const submissionRoutes = require('./routes/submission.routes');
const { errorHandler } = require('./middleware/error.middleware');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/assignments', assignmentRoutes);
app.use('/api/submissions', submissionRoutes);

app.get('/', (req, res) => {
    res.send('API is running...');
});

// Error Handling (Custom middleware needed)
app.use((err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode);
    res.json({
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
});

module.exports = app;
