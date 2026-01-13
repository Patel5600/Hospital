const Doctor = require('../models/Doctor');
const User = require('../models/User');
const { logActivity } = require('../utils/activityLogger');

// @desc    Get all doctors
// @route   GET /api/doctors
// @access  Public
exports.getDoctors = async (req, res, next) => {
    try {
        const doctors = await Doctor.find({ isActive: true }).populate('user', 'name email phone');

        res.status(200).json({
            success: true,
            count: doctors.length,
            data: doctors
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get single doctor
// @route   GET /api/doctors/:id
// @access  Public
exports.getDoctor = async (req, res, next) => {
    try {
        const doctor = await Doctor.findById(req.params.id).populate('user', 'name email phone');

        if (!doctor) {
            return res.status(404).json({
                success: false,
                message: 'Doctor not found'
            });
        }

        res.status(200).json({
            success: true,
            data: doctor
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Create doctor
// @route   POST /api/doctors
// @access  Private (Admin)
exports.createDoctor = async (req, res, next) => {
    try {
        const {
            name,
            email,
            password,
            phone,
            specialization,
            qualifications,
            experience,
            consultationFee,
            availability
        } = req.body;

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
            role: 'doctor'
        });

        // Create doctor profile
        const doctor = await Doctor.create({
            user: user._id,
            specialization,
            qualifications,
            experience,
            consultationFee,
            availability
        });

        // Log Activity
        await logActivity(
            'registration',
            `New Doctor Registered: Dr. ${user.name} (${specialization})`,
            req.user?.id
        );

        const populatedDoctor = await Doctor.findById(doctor._id).populate('user', 'name email phone');

        res.status(201).json({
            success: true,
            data: populatedDoctor
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update doctor
// @route   PUT /api/doctors/:id
// @access  Private (Admin, Doctor)
exports.updateDoctor = async (req, res, next) => {
    try {
        let doctor = await Doctor.findById(req.params.id);

        if (!doctor) {
            return res.status(404).json({
                success: false,
                message: 'Doctor not found'
            });
        }

        // Make sure user is doctor owner or admin
        if (req.user.role !== 'admin' && doctor.user.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to update this profile'
            });
        }

        doctor = await Doctor.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        }).populate('user', 'name email phone');

        res.status(200).json({
            success: true,
            data: doctor
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete doctor (Soft delete)
// @route   DELETE /api/doctors/:id
// @access  Private (Admin)
exports.deleteDoctor = async (req, res, next) => {
    try {
        let doctor = await Doctor.findById(req.params.id);

        if (!doctor) {
            return res.status(404).json({
                success: false,
                message: 'Doctor not found'
            });
        }

        // Soft delete
        doctor.isActive = false;
        await doctor.save();

        // Also deactivate user
        await User.findByIdAndUpdate(doctor.user, { isActive: false });

        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (error) {
        next(error);
    }
};
