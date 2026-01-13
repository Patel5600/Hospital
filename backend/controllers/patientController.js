const Patient = require('../models/Patient');
const User = require('../models/User');
const { logActivity } = require('../utils/activityLogger');

// @desc    Get all patients
// @route   GET /api/patients
// @access  Private (Admin, Doctor, Receptionist)
exports.getPatients = async (req, res) => {
    try {
        const patients = await Patient.find().populate('user', 'name email phone');

        res.status(200).json({
            success: true,
            count: patients.length,
            data: patients
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get single patient
// @route   GET /api/patients/:id
// @access  Private
exports.getPatient = async (req, res) => {
    try {
        const patient = await Patient.findById(req.params.id).populate('user', 'name email phone');

        if (!patient) {
            return res.status(404).json({
                success: false,
                message: 'Patient not found'
            });
        }

        res.status(200).json({
            success: true,
            data: patient
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Create patient
// @route   POST /api/patients
// @access  Private (Admin, Receptionist)
exports.createPatient = async (req, res) => {
    try {
        const { name, email, password, phone, dateOfBirth, gender, bloodGroup, address, emergencyContact } = req.body;

        // Check if user exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({
                success: false,
                message: 'User with this email already exists'
            });
        }

        // Create user
        const user = await User.create({
            name,
            email,
            password,
            phone,
            role: 'patient'
        });

        // Create patient
        const patient = await Patient.create({
            user: user._id,
            dateOfBirth,
            gender,
            bloodGroup,
            address,
            emergencyContact
        });

        // Log Activity
        await logActivity(
            'registration',
            `New Patient Registered: ${user.name}`,
            req.user?.id
        );

        const populatedPatient = await Patient.findById(patient._id).populate('user', 'name email phone');

        res.status(201).json({
            success: true,
            data: populatedPatient
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Update patient
// @route   PUT /api/patients/:id
// @access  Private (Admin, Receptionist)
exports.updatePatient = async (req, res) => {
    try {
        let patient = await Patient.findById(req.params.id);

        if (!patient) {
            return res.status(404).json({
                success: false,
                message: 'Patient not found'
            });
        }

        patient = await Patient.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        }).populate('user', 'name email phone');

        res.status(200).json({
            success: true,
            data: patient
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Delete patient
// @route   DELETE /api/patients/:id
// @access  Private (Admin)
exports.deletePatient = async (req, res) => {
    try {
        const patient = await Patient.findById(req.params.id);

        if (!patient) {
            return res.status(404).json({
                success: false,
                message: 'Patient not found'
            });
        }

        await patient.deleteOne();

        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
