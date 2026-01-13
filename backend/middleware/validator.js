const { check, validationResult } = require('express-validator');

// Validation Rules
exports.registerValidation = [
    check('name', 'Name is required').not().isEmpty().trim().escape(),
    check('email', 'Please include a valid email').isEmail().normalizeEmail(),
    check('password', 'Password must be at least 8 characters').isLength({ min: 8 }),
    check('role', 'Invalid role').optional().isIn(['admin', 'doctor', 'receptionist', 'patient']),
    check('phone', 'Phone number is required').not().isEmpty().trim().escape()
];

exports.loginValidation = [
    check('email', 'Please include a valid email').isEmail().normalizeEmail(),
    check('password', 'Password is required').exists()
];

exports.patientValidation = [
    check('name', 'Name is required').not().isEmpty().trim().escape(),
    check('email', 'Please include a valid email').isEmail().normalizeEmail(),
    check('phone', 'Phone number is required').not().isEmpty().trim().escape(),
    check('dateOfBirth', 'Date of birth is required').not().isEmpty().toDate(),
    check('gender', 'Gender is required').isIn(['male', 'female', 'other']),
    check('bloodGroup', 'Invalid blood group').optional().isIn(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']),
    check('address.street', 'Street is required').optional().trim().escape(),
    check('address.city', 'City is required').optional().trim().escape(),
    check('address.state', 'State is required').optional().trim().escape(),
    check('address.zipCode', 'Zip code is required').optional().trim().escape(),
    check('address.country', 'Country is required').optional().trim().escape(),
    check('emergencyContact.name', 'Emergency contact name is required').optional().trim().escape(),
    check('emergencyContact.phone', 'Emergency contact phone is required').optional().trim().escape(),
    check('emergencyContact.relationship', 'Emergency contact relationship is required').optional().trim().escape()
];

exports.doctorValidation = [
    check('name', 'Name is required').not().isEmpty().trim().escape(),
    check('email', 'Please include a valid email').isEmail().normalizeEmail(),
    check('phone', 'Phone number is required').not().isEmpty().trim().escape(),
    check('specialization', 'Specialization is required').not().isEmpty().trim().escape(),
    check('consultationFee', 'Consultation fee must be a number').isNumeric(),
    check('experience', 'Experience must be a number').optional().isNumeric(),
    check('availability', 'Availability must be an array').optional().isArray()
];

exports.appointmentValidation = [
    check('patientId', 'Patient ID is required').not().isEmpty().isMongoId(),
    check('doctorId', 'Doctor ID is required').not().isEmpty().isMongoId(),
    check('appointmentDate', 'Valid date is required (YYYY-MM-DD)').not().isEmpty().isISO8601().toDate(),
    check('timeSlot', 'Time slot is required').not().isEmpty(),
    check('notes', 'Notes must be string').optional().trim().escape()
];

exports.billValidation = [
    check('appointmentId', 'Appointment ID is required').not().isEmpty().isMongoId(),
    check('labFee', 'Lab fee must be numeric').optional().isNumeric(),
    check('medicineFee', 'Medicine fee must be numeric').optional().isNumeric(),
    check('otherCharges', 'Other charges must be numeric').optional().isNumeric(),
    check('paymentStatus', 'Invalid payment status').optional().isIn(['pending', 'paid', 'cancelled']),
    check('paymentMethod', 'Invalid payment method').optional().isIn(['cash', 'card', 'upi', 'insurance'])
];

// Middleware to handle validation results
exports.validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log('Validation Errors:', errors.array()); // Log errors for debugging
        return res.status(400).json({
            success: false,
            message: errors.array()[0].msg, // Return the first error message
            errors: errors.array()
        });
    }
    next();
};
