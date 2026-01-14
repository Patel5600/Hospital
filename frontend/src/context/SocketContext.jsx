import React, { createContext, useContext, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import toast from 'react-hot-toast';
import { Activity } from 'lucide-react';

const SocketContext = createContext();

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL;

export const SocketProvider = ({ children }) => {
    const socket = useRef();

    useEffect(() => {
        socket.current = io(SOCKET_URL);

        socket.current.on('connect', () => {
            console.log('Socket Connected:', socket.current.id);
        });

        socket.current.on('new_activity', (data) => {
            // Global toast for important events
            if (data.type === 'appointment' || data.type === 'payment') {
                toast.success(data.message, {
                    icon: <Activity className="w-4 h-4 text-blue-500" />,
                    duration: 4000
                });
            }
        });

        return () => {
            if (socket.current) socket.current.disconnect();
        };
    }, []);

    const emit = (event, data) => {
        if (socket.current) socket.current.emit(event, data);
    };

    const subscribe = (event, callback) => {
        if (socket.current) socket.current.on(event, callback);
        return () => socket.current.off(event, callback);
    };

    return (
        <SocketContext.Provider value={{ socket: socket.current, emit, subscribe }}>
            {children}
        </SocketContext.Provider>
    );
};

export const useSocket = () => {
    const context = useContext(SocketContext);
    if (!context) {
        throw new Error('useSocket must be used within a SocketProvider');
    }
    return context;
};
