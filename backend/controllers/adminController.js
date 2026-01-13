const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');
const Appointment = require('../models/Appointment');
const Bill = require('../models/Bill');
const Activity = require('../models/Activity');

// @desc    Get admin dashboard stats
// @route   GET /api/admin/dashboard
// @access  Private (Admin)
exports.getDashboardStats = async (req, res, next) => {
    try {
        const today = new Date();
        const startOfDay = new Date(today.setHours(0, 0, 0, 0));
        const endOfDay = new Date(today.setHours(23, 59, 59, 999));

        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

        // 1. Total Patients
        const totalPatients = await Patient.countDocuments({ isActive: true });

        // 2. Total Doctors
        const totalDoctors = await Doctor.countDocuments({ isActive: true });

        // 3. Appointments Today
        const todayAppointments = await Appointment.countDocuments({
            appointmentDate: {
                $gte: startOfDay,
                $lte: endOfDay
            },
            status: { $ne: 'cancelled' }
        });

        // 4. Pending Bills
        const pendingBills = await Bill.countDocuments({ paymentStatus: 'pending' });

        // 5. Total Revenue (This Month)
        const revenueAggregation = await Bill.aggregate([
            {
                $match: {
                    paymentStatus: 'paid',
                    updatedAt: {
                        $gte: startOfMonth
                    }
                }
            },
            {
                $group: {
                    _id: null,
                    totalRevenue: { $sum: '$totalAmount' }
                }
            }
        ]);

        const monthlyRevenue = revenueAggregation.length > 0 ? revenueAggregation[0].totalRevenue : 0;

        // 6. Recent Activities
        const recentActivities = await Activity.find()
            .populate('user', 'name')
            .sort({ createdAt: -1 })
            .limit(5);

        res.status(200).json({
            success: true,
            data: {
                totalPatients,
                totalDoctors,
                todayAppointments,
                monthlyRevenue,
                pendingBills,
                recentActivities
            }
        });
    } catch (error) {
        next(error);
    }
};
