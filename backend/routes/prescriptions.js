const express = require('express');
const {
    getPrescriptions,
    getPrescription,
    createPrescription,
    updatePrescription,
    deletePrescription
} = require('../controllers/prescriptionController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router
    .route('/')
    .get(protect, getPrescriptions)
    .post(protect, authorize('doctor'), createPrescription);

router
    .route('/:id')
    .get(protect, getPrescription)
    .put(protect, authorize('doctor'), updatePrescription)
    .delete(protect, authorize('admin', 'doctor'), deletePrescription);

module.exports = router;
