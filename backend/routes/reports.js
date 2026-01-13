const express = require('express');
const { getDailyReport, getMonthlyReport } = require('../controllers/reportController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/daily', protect, authorize('admin'), getDailyReport);
router.get('/monthly', protect, authorize('admin'), getMonthlyReport);

module.exports = router;
