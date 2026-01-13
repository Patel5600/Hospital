let io;

const init = (httpServer) => {
    io = require('socket.io')(httpServer, {
        cors: {
            origin: "*", // Allow all for dev, restrict in prod
            methods: ["GET", "POST"]
        }
    });

    let activeUsers = 0;
    io.on('connection', (socket) => {
        activeUsers++;
        io.emit('system_stats', { activeUsers });
        console.log('Client connected: ' + socket.id);

        socket.on('simulate_activity', async (data) => {
            try {
                const { logActivity } = require('./activityLogger');
                await logActivity(data.type, data.message, null, { source: 'simulation' });
            } catch (err) {
                console.error('Simulation failed:', err);
            }
        });

        socket.on('disconnect', () => {
            activeUsers--;
            io.emit('system_stats', { activeUsers });
            console.log('Client disconnected: ' + socket.id);
        });
    });

    return io;
};

const getIO = () => {
    if (!io) {
        throw new Error('Socket.io not initialized!');
    }
    return io;
};

module.exports = { init, getIO };
