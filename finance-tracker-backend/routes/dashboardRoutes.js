// routes/dashboardRoutes.js
const express = require('express');
const { dashboardAnalytics } = require('../controllers/dashboardController');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// Make sure the handler is a function
router.get('/analytics', authenticate, dashboardAnalytics);
router.get('/dashboard/analytics', authenticate, dashboardAnalytics);

module.exports = router;
