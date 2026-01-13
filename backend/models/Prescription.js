const mongoose = require('mongoose');

const prescriptionSchema = new mongoose.Schema({
    prescriptionId: {
        type: String,
        unique: true,
        required: true
    },
    patient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Patient',
        required: true
    },
    doctor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Doctor',
        required: true
    },
    appointment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Appointment'
    },
    diagnosis: {
        type: String,
        required: [true, 'Please provide diagnosis']
    },
    symptoms: [String],
    medications: [{
        name: {
            type: String,
            required: true
        },
        dosage: {
            type: String,
            required: true
        },
        frequency: {
            type: String,
            required: true
        },
        duration: {
            type: String,
            required: true
        },
        instructions: String
    }],
    labTests: [{
        testName: String,
        instructions: String
    }],
    followUpDate: Date,
    notes: String,
    prescriptionDate: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Generate prescription ID
prescriptionSchema.pre('save', async function (next) {
    if (!this.prescriptionId) {
        const count = await mongoose.model('Prescription').countDocuments();
        this.prescriptionId = `PRX${String(count + 1).padStart(6, '0')}`;
    }
    next();
});

module.exports = mongoose.model('Prescription', prescriptionSchema);
