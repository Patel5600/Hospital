const Activity = require('../models/Activity');
const { getIO } = require('./socketUtils');

/**
 * Logs an activity to the database and broadcasts it via Socket.io
 * @param {string} type - 'registration', 'appointment', 'payment', 'system', 'login'
 * @param {string} message - Human readable message
 * @param {string} userId - ID of the user who performed the action
 * @param {object} metadata - Optional extra data
 */
const logActivity = async (type, message, userId, metadata = {}) => {
    try {
        const activity = await Activity.create({ type, message, user: userId, metadata });

        try {
            const io = getIO();
            // Emit to all clients
            io.emit('new_activity', activity);
        } catch (e) {
            // Socket might not be initialized yet in some contexts
            console.error('Socket notification skipped:', e.message);
        }

        return activity;
    } catch (err) {
        console.error('Activity System Error:', err);
    }
};

module.exports = { logActivity };
