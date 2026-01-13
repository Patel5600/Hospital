const express = require('express');
const {
    getPatients,
    getPatient,
    createPatient,
    updatePatient,
    deletePatient
} = require('../controllers/patientController');
const { protect, authorize } = require('../middleware/auth');
const { patientValidation, validate } = require('../middleware/validator');

const router = express.Router();

router
    .route('/')
    .get(protect, authorize('admin', 'doctor', 'receptionist'), getPatients)
    .post(protect, authorize('admin', 'receptionist'), patientValidation, validate, createPatient);

router
    .route('/:id')
    .get(protect, getPatient)
    .put(protect, authorize('admin', 'receptionist'), patientValidation, validate, updatePatient)
    .delete(protect, authorize('admin'), deletePatient);

module.exports = router;
