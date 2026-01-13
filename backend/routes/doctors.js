const express = require('express');
const {
    getDoctors,
    getDoctor,
    createDoctor,
    updateDoctor,
    deleteDoctor
} = require('../controllers/doctorController');
const { protect, authorize } = require('../middleware/auth');
const { doctorValidation, validate } = require('../middleware/validator');

const router = express.Router();

router
    .route('/')
    .get(protect, authorize('admin', 'receptionist'), getDoctors)
    .post(protect, authorize('admin'), doctorValidation, validate, createDoctor);

router
    .route('/:id')
    .get(protect, AuthorizeDoctorOrAdmin, getDoctor)
    .put(protect, AuthorizeDoctorOrAdmin, updateDoctor)
    .delete(protect, authorize('admin'), deleteDoctor);

// Custom middleware to allow admin, receptionist, or the specific doctor
function AuthorizeDoctorOrAdmin(req, res, next) {
    // If admin or receptionist, allow
    if (req.user.role === 'admin' || req.user.role === 'receptionist') {
        return next();
    }
    // If doctor, check if fetching own profile 
    // This part is tricky because we need the doctor ID associated with the user ID
    // But getDoctor/updateDoctor uses Doctor ID in params.
    // So we might need to fetch the doctor first or rely on controller logic.
    // The controller currently does: if (doctor.user.toString() !== req.user.id)
    // So let's rely on the controller for ownership check if role is doctor.
    // Here we just check role.
    if (req.user.role === 'doctor') {
        return next();
    }

    return res.status(403).json({
        success: false,
        message: `User role '${req.user.role}' is not authorized to access this route`
    });
}

module.exports = router;
