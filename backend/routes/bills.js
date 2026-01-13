const express = require('express');
const {
    createBill,
    getBills,
    getBill,
    updateBillStatus
} = require('../controllers/billController');
const { protect, authorize } = require('../middleware/auth');
const { billValidation, validate } = require('../middleware/validator');

const router = express.Router();

router
    .route('/')
    .get(protect, authorize('admin', 'receptionist'), getBills)
    .post(protect, authorize('admin', 'receptionist'), billValidation, validate, createBill);

router
    .route('/:id')
    .get(protect, getBill)
    .put(protect, authorize('admin', 'receptionist'), updateBillStatus);

module.exports = router;
