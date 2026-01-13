const User = require('../models/User');
const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');

// @desc    Get current user profile
// @route   GET /api/profile/me
// @access  Private
exports.getProfile = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        let profileData = { user };

        if (user.role === 'patient') {
            const patient = await Patient.findOne({ user: user._id });
            if (patient) {
                profileData.patientProfile = patient;
            }
        } else if (user.role === 'doctor') {
            const doctor = await Doctor.findOne({ user: user._id });
            if (doctor) {
                profileData.doctorProfile = doctor;
            }
        }

        res.status(200).json({
            success: true,
            data: profileData
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update current user profile
// @route   PUT /api/profile/me
// @access  Private
exports.updateProfile = async (req, res, next) => {
    try {
        const { name, phone, address, gender, bloodGroup, specialization, consultationFee } = req.body;

        // 1. Update Core User Details
        const updatedUser = await User.findByIdAndUpdate(req.user.id, {
            name,
            phone
        }, { new: true, runValidators: true });

        let profileData = { user: updatedUser };

        // 2. Update Role specific details
        if (req.user.role === 'patient') {
            let patient = await Patient.findOne({ user: req.user.id });

            if (patient) {
                patient.address = address || patient.address;
                patient.gender = gender || patient.gender;
                patient.bloodGroup = bloodGroup || patient.bloodGroup;
                await patient.save();
                profileData.patientProfile = patient;
            }
        } else if (req.user.role === 'doctor') {
            let doctor = await Doctor.findOne({ user: req.user.id });

            if (doctor) {
                if (specialization) doctor.specialization = specialization;
                if (consultationFee) doctor.consultationFee = consultationFee;
                await doctor.save();
                profileData.doctorProfile = doctor;
            }
        }

        res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
            data: profileData
        });
    } catch (error) {
        next(error);
    }
};
