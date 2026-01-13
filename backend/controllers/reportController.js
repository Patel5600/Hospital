const Patient = require('../models/Patient');
const Appointment = require('../models/Appointment');
const Bill = require('../models/Bill');
const Doctor = require('../models/Doctor');

// @desc    Get Daily Report
// @route   GET /api/reports/daily
// @access  Private (Admin)
exports.getDailyReport = async (req, res, next) => {
    try {
        const today = new Date();
        const startOfDay = new Date(today.setHours(0, 0, 0, 0));
        const endOfDay = new Date(today.setHours(23, 59, 59, 999));

        // 1. Patients Registered Today
        const newPatients = await Patient.countDocuments({
            createdAt: { $gte: startOfDay, $lte: endOfDay }
        });

        // 2. Appointments Today
        const appointments = await Appointment.countDocuments({
            appointmentDate: { $gte: startOfDay, $lte: endOfDay },
            status: { $ne: 'cancelled' }
        });

        // 3. Financials (Revenue & Bill Counts)
        const billStats = await Bill.aggregate([
            {
                $match: {
                    updatedAt: { $gte: startOfDay, $lte: endOfDay }
                }
            },
            {
                $group: {
                    _id: null,
                    totalRevenue: {
                        $sum: {
                            $cond: [{ $eq: ["$paymentStatus", "paid"] }, "$totalAmount", 0]
                        }
                    },
                    paidBillsCount: {
                        $sum: {
                            $cond: [{ $eq: ["$paymentStatus", "paid"] }, 1, 0]
                        }
                    },
                    pendingBillsCount: {
                        $sum: {
                            $cond: [{ $eq: ["$paymentStatus", "pending"] }, 1, 0]
                        }
                    }
                }
            }
        ]);

        const stats = billStats[0] || { totalRevenue: 0, paidBillsCount: 0, pendingBillsCount: 0 };

        res.status(200).json({
            success: true,
            report: {
                date: new Date().toISOString().split('T')[0],
                patientsRegistered: newPatients,
                appointments: appointments,
                revenue: stats.totalRevenue,
                paidBills: stats.paidBillsCount,
                pendingBills: stats.pendingBillsCount
            }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get Monthly Report
// @route   GET /api/reports/monthly?month=MM&year=YYYY
// @access  Private (Admin)
exports.getMonthlyReport = async (req, res, next) => {
    try {
        const { month, year } = req.query;

        const now = new Date();
        const currentMonth = month ? parseInt(month) - 1 : now.getMonth();
        const currentYear = year ? parseInt(year) : now.getFullYear();

        const startOfMonth = new Date(currentYear, currentMonth, 1);
        const endOfMonth = new Date(currentYear, currentMonth + 1, 0, 23, 59, 59);

        // 1. Total Patients Registered
        const totalPatients = await Patient.countDocuments({
            createdAt: { $gte: startOfMonth, $lte: endOfMonth }
        });

        // 2. Total Appointments
        const totalAppointments = await Appointment.countDocuments({
            appointmentDate: { $gte: startOfMonth, $lte: endOfMonth },
            status: { $ne: 'cancelled' }
        });

        // 3. Financial Aggregation
        const financialStats = await Bill.aggregate([
            {
                $match: {
                    updatedAt: { $gte: startOfMonth, $lte: endOfMonth }
                }
            },
            {
                $group: {
                    _id: null,
                    totalRevenue: {
                        $sum: {
                            $cond: [{ $eq: ["$paymentStatus", "paid"] }, "$totalAmount", 0]
                        }
                    },
                    paidBills: {
                        $sum: {
                            $cond: [{ $eq: ["$paymentStatus", "paid"] }, 1, 0]
                        }
                    },
                    pendingBills: {
                        $sum: {
                            $cond: [{ $eq: ["$paymentStatus", "pending"] }, 1, 0]
                        }
                    }
                }
            }
        ]);

        const stats = financialStats[0] || { totalRevenue: 0, paidBills: 0, pendingBills: 0 };

        // 4. Doctor-wise Revenue
        const doctorRevenue = await Bill.aggregate([
            {
                $match: {
                    updatedAt: { $gte: startOfMonth, $lte: endOfMonth },
                    paymentStatus: 'paid'
                }
            },
            {
                $group: {
                    _id: "$doctor",
                    revenue: { $sum: "$totalAmount" },
                    consultations: { $sum: 1 }
                }
            },
            {
                $lookup: {
                    from: "doctors",
                    localField: "_id",
                    foreignField: "_id",
                    as: "doctorInfo"
                }
            },
            {
                $unwind: "$doctorInfo"
            },
            {
                $lookup: {
                    from: "users",
                    localField: "doctorInfo.user",
                    foreignField: "_id",
                    as: "userInfo"
                }
            },
            {
                $unwind: "$userInfo"
            },
            {
                $project: {
                    doctorName: "$userInfo.name",
                    specialization: "$doctorInfo.specialization",
                    revenue: 1,
                    consultations: 1
                }
            }
        ]);

        res.status(200).json({
            success: true,
            report: {
                month: currentMonth + 1,
                year: currentYear,
                patientsRegistered: totalPatients,
                appointments: totalAppointments,
                totalRevenue: stats.totalRevenue,
                billStatus: {
                    paid: stats.paidBills,
                    pending: stats.pendingBills
                },
                doctorPerformance: doctorRevenue
            }
        });
    } catch (error) {
        next(error);
    }
};
