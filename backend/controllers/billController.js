const Bill = require('../models/Bill');
const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');
const Patient = require('../models/Patient');
const { logActivity } = require('../utils/activityLogger');

// @desc    Generate bill
// @route   POST /api/bills
// @access  Private (Admin, Receptionist)
exports.createBill = async (req, res, next) => {
    try {
        const {
            appointmentId,
            labFee,
            medicineFee,
            otherCharges,
            paymentMethod,
            paymentStatus
        } = req.body;

        // 1. Validate Appointment
        const appointment = await Appointment.findById(appointmentId);
        if (!appointment) {
            return res.status(404).json({ success: false, message: 'Appointment not found' });
        }

        // 2. Prevent Duplicate Bill for same appointment
        const existingBill = await Bill.findOne({ appointment: appointmentId });
        if (existingBill) {
            return res.status(400).json({
                success: false,
                message: 'Bill already exists for this appointment',
                billId: existingBill._id
            });
        }

        // 3. Get Doctor Consultation Fee automatically
        const doctor = await Doctor.findById(appointment.doctor);
        if (!doctor) {
            return res.status(404).json({ success: false, message: 'Doctor associated with appointment not found' });
        }

        // 4. Create Bill
        const bill = await Bill.create({
            patient: appointment.patient,
            appointment: appointmentId,
            doctor: appointment.doctor,
            consultationFee: doctor.consultationFee, // Auto-fetched from doctor profile
            labFee: labFee || 0,
            medicineFee: medicineFee || 0,
            otherCharges: otherCharges || 0,
            paymentMethod,
            paymentStatus: paymentStatus || 'pending',
            createdBy: req.user.id
        });

        const populatedBill = await Bill.findById(bill._id)
            .populate('patient')
            .populate('doctor')
            .populate('appointment');

        // Log Activity
        await logActivity(
            'payment',
            `Invoice Generated: ${populatedBill.invoiceNumber} for ${populatedBill.patient?.user?.name || 'Patient'}`,
            req.user.id
        );

        res.status(201).json({
            success: true,
            data: populatedBill
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get all bills
// @route   GET /api/bills
// @access  Private (Admin, Receptionist)
exports.getBills = async (req, res, next) => {
    try {
        const bills = await Bill.find()
            .populate({
                path: 'patient',
                populate: { path: 'user', select: 'name email phone' }
            })
            .populate({
                path: 'doctor',
                populate: { path: 'user', select: 'name specialization' }
            })
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: bills.length,
            data: bills
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get single bill
// @route   GET /api/bills/:id
// @access  Private
exports.getBill = async (req, res, next) => {
    try {
        const bill = await Bill.findById(req.params.id)
            .populate({
                path: 'patient',
                populate: { path: 'user', select: 'name email phone' }
            })
            .populate({
                path: 'doctor',
                populate: { path: 'user', select: 'name specialization' }
            })
            .populate('appointment');

        if (!bill) {
            return res.status(404).json({
                success: false,
                message: 'Bill not found'
            });
        }

        res.status(200).json({
            success: true,
            data: bill
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update bill status (Mark as Paid)
// @route   PUT /api/bills/:id
// @access  Private (Admin, Receptionist)
exports.updateBillStatus = async (req, res, next) => {
    try {
        let bill = await Bill.findById(req.params.id);

        if (!bill) {
            return res.status(404).json({
                success: false,
                message: 'Bill not found'
            });
        }

        const { paymentStatus, paymentMethod, transactionId } = req.body;

        // If trying to update status to paid
        if (paymentStatus === 'paid' && bill.paymentStatus !== 'paid') {
            bill.paymentStatus = 'paid';
            if (paymentMethod) bill.paymentMethod = paymentMethod;
            if (transactionId) bill.transactionId = transactionId;
            await bill.save();
        } else if (paymentStatus === 'cancelled') {
            bill.paymentStatus = 'cancelled';
            await bill.save();
        } else {
            // For generic updates (e.g. updating extra charges)
            // Using create to make sure totals recalculate if we changed fees?
            // Simple update for now
            bill = await Bill.findByIdAndUpdate(req.params.id, req.body, {
                new: true,
                runValidators: true
            });
        }

        // Log Payment if just paid
        if (req.body.paymentStatus === 'paid') {
            const patient = await Patient.findById(bill.patient).populate('user');
            await logActivity(
                'payment',
                `Payment Received: $${bill.totalAmount} from ${patient?.user?.name || 'Patient'}`,
                req.user.id
            );
        }

        res.status(200).json({
            success: true,
            data: bill
        });
    } catch (error) {
        next(error);
    }
};
