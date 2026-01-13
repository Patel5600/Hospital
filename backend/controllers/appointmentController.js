const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');
const Patient = require('../models/Patient');
const Activity = require('../models/Activity'); // Import Activity Model
const { getIO } = require('../utils/socketUtils'); // Import Socket IO

const { logActivity } = require('../utils/activityLogger'); // Central Logger

// @desc    Get all appointments
// @route   GET /api/appointments
// @access  Private (Admin, Doctor, Receptionist)
exports.getAppointments = async (req, res, next) => {
    try {
        let query;

        // If doctor, only show their appointments
        if (req.user.role === 'doctor') {
            // Find doctor profile for this user
            const doctor = await Doctor.findOne({ user: req.user.id });
            if (!doctor) {
                return res.status(404).json({ success: false, message: 'Doctor profile not found' });
            }
            query = Appointment.find({ doctor: doctor._id });
        } else if (req.user.role === 'patient') {
            // If patient, only show their appointments
            const patient = await Patient.findOne({ user: req.user.id });
            if (!patient) {
                return res.status(404).json({ success: false, message: 'Patient profile not found' });
            }
            query = Appointment.find({ patient: patient._id });
        } else {
            // Admin/Receptionist see all
            query = Appointment.find();
        }

        const appointments = await query
            .populate({
                path: 'patient',
                populate: { path: 'user', select: 'name email phone' }
            })
            .populate({
                path: 'doctor',
                populate: { path: 'user', select: 'name specialization' }
            })
            .sort({ appointmentDate: 1 }); // Sort by date

        res.status(200).json({
            success: true,
            count: appointments.length,
            data: appointments
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get single appointment
// @route   GET /api/appointments/:id
// @access  Private
exports.getAppointment = async (req, res, next) => {
    try {
        const appointment = await Appointment.findById(req.params.id)
            .populate({
                path: 'patient',
                populate: { path: 'user', select: 'name email phone' }
            })
            .populate({
                path: 'doctor',
                populate: { path: 'user', select: 'name specialization' }
            });

        if (!appointment) {
            return res.status(404).json({
                success: false,
                message: 'Appointment not found'
            });
        }

        res.status(200).json({
            success: true,
            data: appointment
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Book appointment
// @route   POST /api/appointments
// @access  Private (Admin, Receptionist, Patient)
exports.createAppointment = async (req, res, next) => {
    try {
        const { patientId, doctorId, appointmentDate, timeSlot, notes } = req.body;

        // 1. Validate Patient
        const patient = await Patient.findById(patientId).populate('user');
        if (!patient) {
            return res.status(404).json({ success: false, message: 'Patient not found' });
        }

        // 2. Validate Doctor
        const doctor = await Doctor.findById(doctorId).populate('user');
        if (!doctor) {
            return res.status(404).json({ success: false, message: 'Doctor not found' });
        }

        // 3. Check for conflict (Double Booking)
        const existingAppointment = await Appointment.findOne({
            doctor: doctorId,
            appointmentDate,
            timeSlot,
            status: { $ne: 'cancelled' }
        });

        if (existingAppointment) {
            return res.status(400).json({
                success: false,
                message: 'Doctor is already booked for this time slot'
            });
        }

        // 4. Create appointment
        const appointment = await Appointment.create({
            patient: patientId,
            doctor: doctorId,
            appointmentDate,
            timeSlot,
            notes,
            createdBy: req.user.id
        });

        // Log Activity
        await logActivity(
            'appointment',
            `New Appointment: ${patient.user.name} with Dr. ${doctor.user.name}`,
            req.user.id
        );

        const populatedAppointment = await Appointment.findById(appointment._id)
            .populate('patient')
            .populate('doctor');

        res.status(201).json({
            success: true,
            data: populatedAppointment
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update appointment status/notes
// @route   PUT /api/appointments/:id
// @access  Private (Admin, Doctor, Receptionist)
exports.updateAppointment = async (req, res, next) => {
    try {
        let appointment = await Appointment.findById(req.params.id);

        if (!appointment) {
            return res.status(404).json({
                success: false,
                message: 'Appointment not found'
            });
        }

        appointment = await Appointment.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        // Log if status changed
        if (req.body.status) {
            await logActivity(
                'appointment',
                `Appointment status updated to ${req.body.status}`,
                req.user.id
            );
        }

        res.status(200).json({
            success: true,
            data: appointment
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Cancel appointment
// @route   DELETE /api/appointments/:id
// @access  Private (Admin, Receptionist, *Doctor)
exports.deleteAppointment = async (req, res, next) => {
    try {
        const appointment = await Appointment.findById(req.params.id);

        if (!appointment) {
            return res.status(404).json({
                success: false,
                message: 'Appointment not found'
            });
        }

        appointment.status = 'cancelled';
        await appointment.save();

        await logActivity(
            'appointment',
            `Appointment cancelled`,
            req.user.id
        );

        res.status(200).json({
            success: true,
            data: {},
            message: 'Appointment cancelled successfully'
        });
    } catch (error) {
        next(error);
    }
};
