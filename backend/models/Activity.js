const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['registration', 'appointment', 'payment', 'system', 'login'],
        required: true
    },
    message: {
        type: String,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    metadata: {
        type: Object
    }
}, {
    timestamps: true
    // We might want to cap this collection to prevent infinite growth, 
    // but for now standard collection is fine.
});

module.exports = mongoose.model('Activity', activitySchema);
