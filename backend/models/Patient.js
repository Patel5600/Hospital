const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    patientId: {
        type: String,
        unique: true
    },
    dateOfBirth: {
        type: Date,
        required: [true, 'Please provide date of birth']
    },
    gender: {
        type: String,
        enum: ['male', 'female', 'other'],
        required: [true, 'Please provide gender']
    },
    bloodGroup: {
        type: String,
        enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
    },
    address: {
        street: String,
        city: String,
        state: String,
        zipCode: String,
        country: String
    },
    emergencyContact: {
        name: String,
        relationship: String,
        phone: String
    },
    medicalHistory: [{
        condition: String,
        diagnosedDate: Date,
        notes: String
    }],
    allergies: [String],
    currentMedications: [String],
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// Generate patient ID
patientSchema.pre('save', async function (next) {
    if (!this.patientId) {
        const count = await mongoose.model('Patient').countDocuments();
        this.patientId = `PAT${String(count + 1).padStart(6, '0')}`;
    }
    next();
});

module.exports = mongoose.model('Patient', patientSchema);
