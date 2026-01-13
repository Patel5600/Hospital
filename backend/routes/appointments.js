const express = require('express');
const {
    getAppointments,
    getAppointment,
    createAppointment,
    updateAppointment,
    deleteAppointment
} = require('../controllers/appointmentController');
const { protect, authorize } = require('../middleware/auth');
const { appointmentValidation, validate } = require('../middleware/validator');

const router = express.Router();

router
    .route('/')
    .get(protect, getAppointments)
    .post(protect, authorize('admin', 'receptionist', 'patient'), appointmentValidation, validate, createAppointment);

router
    .route('/:id')
    .get(protect, getAppointment)
    .put(protect, authorize('admin', 'receptionist', 'doctor'), updateAppointment)
    .delete(protect, authorize('admin', 'receptionist', 'doctor'), deleteAppointment);

module.exports = router;
