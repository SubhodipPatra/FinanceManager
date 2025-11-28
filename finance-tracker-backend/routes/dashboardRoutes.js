
const express = require('express');
const { dashboardAnalytics } = require('../controllers/dashboardController');
const { authenticate } = require('../middleware/auth');

const router = express.Router();


router.get('/analytics', authenticate, dashboardAnalytics);
router.get('/dashboard/analytics', authenticate, dashboardAnalytics);

module.exports = router;
