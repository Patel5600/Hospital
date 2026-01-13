const mongoose = require('mongoose');

const billSchema = new mongoose.Schema({
    patient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Patient',
        required: true
    },
    appointment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Appointment',
        required: true
    },
    doctor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Doctor',
        required: true
    },
    consultationFee: {
        type: Number,
        required: true,
        default: 0
    },
    labFee: {
        type: Number,
        default: 0
    },
    medicineFee: {
        type: Number,
        default: 0
    },
    otherCharges: {
        type: Number,
        default: 0
    },
    totalAmount: {
        type: Number,
        required: true
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'paid', 'cancelled'],
        default: 'pending'
    },
    paymentMethod: {
        type: String,
        enum: ['cash', 'card', 'upi', 'insurance'],
        default: 'cash'
    },
    invoiceNumber: {
        type: String,
        required: true,
        unique: true
    },
    transactionId: {
        type: String // Optional, for online payments
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
});

// Calculate total and generate invoice number before validation
billSchema.pre('validate', async function (next) {
    // Calculate total amount
    this.totalAmount = (this.consultationFee || 0) +
        (this.labFee || 0) +
        (this.medicineFee || 0) +
        (this.otherCharges || 0);

    // Generate invoice number if new
    if (this.isNew && !this.invoiceNumber) {
        try {
            const date = new Date();
            const year = date.getFullYear().toString().substr(-2);
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const count = await mongoose.model('Bill').countDocuments();
            this.invoiceNumber = `INV${year}${month}${String(count + 1).padStart(5, '0')}`;
        } catch (error) {
            return next(error);
        }
    }
    next();
});

module.exports = mongoose.model('Bill', billSchema);
