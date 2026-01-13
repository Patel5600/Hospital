const Prescription = require('../models/Prescription');

// @desc    Get all prescriptions
// @route   GET /api/prescriptions
// @access  Private
exports.getPrescriptions = async (req, res) => {
    try {
        let query = {};

        // Filter by role
        if (req.user.role === 'patient') {
            const Patient = require('../models/Patient');
            const patient = await Patient.findOne({ user: req.user._id });
            if (patient) {
                query.patient = patient._id;
            }
        } else if (req.user.role === 'doctor') {
            const Doctor = require('../models/Doctor');
            const doctor = await Doctor.findOne({ user: req.user._id });
            if (doctor) {
                query.doctor = doctor._id;
            }
        }

        const prescriptions = await Prescription.find(query)
            .populate({
                path: 'patient',
                populate: { path: 'user', select: 'name email phone' }
            })
            .populate({
                path: 'doctor',
                populate: { path: 'user', select: 'name email phone' }
            })
            .populate('appointment')
            .sort('-prescriptionDate');

        res.status(200).json({
            success: true,
            count: prescriptions.length,
            data: prescriptions
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get single prescription
// @route   GET /api/prescriptions/:id
// @access  Private
exports.getPrescription = async (req, res) => {
    try {
        const prescription = await Prescription.findById(req.params.id)
            .populate({
                path: 'patient',
                populate: { path: 'user', select: 'name email phone' }
            })
            .populate({
                path: 'doctor',
                populate: { path: 'user', select: 'name email phone' }
            })
            .populate('appointment');

        if (!prescription) {
            return res.status(404).json({
                success: false,
                message: 'Prescription not found'
            });
        }

        res.status(200).json({
            success: true,
            data: prescription
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Create prescription
// @route   POST /api/prescriptions
// @access  Private (Doctor)
exports.createPrescription = async (req, res) => {
    try {
        const Doctor = require('../models/Doctor');
        const doctor = await Doctor.findOne({ user: req.user._id });

        if (!doctor) {
            return res.status(403).json({
                success: false,
                message: 'Only doctors can create prescriptions'
            });
        }

        req.body.doctor = doctor._id;

        const prescription = await Prescription.create(req.body);

        const populatedPrescription = await Prescription.findById(prescription._id)
            .populate({
                path: 'patient',
                populate: { path: 'user', select: 'name email phone' }
            })
            .populate({
                path: 'doctor',
                populate: { path: 'user', select: 'name email phone' }
            })
            .populate('appointment');

        res.status(201).json({
            success: true,
            data: populatedPrescription
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Update prescription
// @route   PUT /api/prescriptions/:id
// @access  Private (Doctor)
exports.updatePrescription = async (req, res) => {
    try {
        let prescription = await Prescription.findById(req.params.id);

        if (!prescription) {
            return res.status(404).json({
                success: false,
                message: 'Prescription not found'
            });
        }

        prescription = await Prescription.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        })
            .populate({
                path: 'patient',
                populate: { path: 'user', select: 'name email phone' }
            })
            .populate({
                path: 'doctor',
                populate: { path: 'user', select: 'name email phone' }
            })
            .populate('appointment');

        res.status(200).json({
            success: true,
            data: prescription
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Delete prescription
// @route   DELETE /api/prescriptions/:id
// @access  Private (Admin, Doctor)
exports.deletePrescription = async (req, res) => {
    try {
        const prescription = await Prescription.findById(req.params.id);

        if (!prescription) {
            return res.status(404).json({
                success: false,
                message: 'Prescription not found'
            });
        }

        await prescription.deleteOne();

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
