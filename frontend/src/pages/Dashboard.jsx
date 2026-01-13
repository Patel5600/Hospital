import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import {
    Users,
    Calendar,
    DollarSign,
    Activity,
    CreditCard,
    UserPlus,
    Clock,
    Loader2
} from 'lucide-react';
import StatCard from '../components/StatCard';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { useSocket } from '../context/SocketContext';
import toast from 'react-hot-toast';

export default function Dashboard() {
    const [stats, setStats] = useState({
        totalPatients: 0,
        totalDoctors: 0,
        todayAppointments: 0,
        monthlyRevenue: 0,
        pendingBills: 0
    });

    const [systemStats, setSystemStats] = useState({ activeUsers: 1, latency: '12ms' });
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const { subscribe, emit } = useSocket();

    const getActivityColor = (type) => {
        switch (type) {
            case 'registration': return 'text-blue-500 bg-blue-100';
            case 'appointment': return 'text-purple-500 bg-purple-100';
            case 'payment': return 'text-green-500 bg-green-100';
            default: return 'text-gray-500 bg-gray-100';
        }
    };

    const getActivityIcon = (type) => {
        switch (type) {
            case 'registration': return UserPlus;
            case 'appointment': return Calendar;
            case 'payment': return DollarSign;
            default: return Activity;
        }
    };

    const getRelativeTime = (date) => {
        if (!date) return 'Just now';
        const diff = Math.floor((new Date() - new Date(date)) / 60000); // minutes
        if (diff < 1) return 'Just now';
        if (diff < 60) return `${diff} mins ago`;
        return `${Math.floor(diff / 60)} hours ago`;
    };

    const runSimulation = () => {
        const types = ['registration', 'appointment', 'payment'];
        const messages = [
            "New Emergency Patient: James Wilson",
            "Payment Received: Invoice INV24010",
            "Dr. Sarah Smith updated surgery schedule",
            "Patient John Doe checked in for appointment",
            "System Backup completed successfully"
        ];

        const randomType = types[Math.floor(Math.random() * types.length)];
        const randomMsg = messages[Math.floor(Math.random() * messages.length)];

        emit('simulate_activity', {
            type: randomType,
            message: randomMsg,
        });
        toast.success("Simulation triggered!");
    };

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const { data } = await api.get('/admin/dashboard');
                setStats({
                    totalPatients: data.data.totalPatients,
                    totalDoctors: data.data.totalDoctors,
                    todayAppointments: data.data.todayAppointments,
                    monthlyRevenue: data.data.monthlyRevenue,
                    pendingBills: data.data.pendingBills
                });

                if (data.data.recentActivities) {
                    const formatted = data.data.recentActivities.map(act => ({
                        id: act._id,
                        type: act.type,
                        message: act.message,
                        time: getRelativeTime(act.createdAt),
                        timestamp: act.createdAt,
                        color: getActivityColor(act.type),
                        icon: getActivityIcon(act.type)
                    }));
                    setActivities(formatted);
                }
            } catch (error) {
                console.error('Error fetching dashboard stats:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchInitialData();

        // Subscribe to System Stats
        const unsubStats = subscribe('system_stats', (data) => {
            setSystemStats(prev => ({ ...prev, activeUsers: data.activeUsers }));
        });

        // Subscribe to Real-Time Activity
        const unsubscribe = subscribe('new_activity', (newData) => {
            const formattedActivity = {
                id: newData._id || Date.now(),
                type: newData.type,
                message: newData.message,
                time: 'Just now',
                timestamp: new Date(),
                color: getActivityColor(newData.type),
                icon: getActivityIcon(newData.type)
            };

            setActivities(prev => [formattedActivity, ...prev].slice(0, 5));

            setStats(prev => {
                if (newData.type === 'appointment') return { ...prev, todayAppointments: prev.todayAppointments + 1 };
                if (newData.type === 'registration') return { ...prev, totalPatients: prev.totalPatients + 1 };
                if (newData.type === 'payment') return { ...prev, pendingBills: Math.max(0, prev.pendingBills - 1) };
                return prev;
            });
        });

        return () => {
            unsubscribe();
            unsubStats();
        };
    }, [subscribe]);

    // Update relative times every minute
    useEffect(() => {
        const interval = setInterval(() => {
            setActivities(prev => prev.map(a => ({
                ...a,
                time: getRelativeTime(a.timestamp)
            })));
        }, 60000);
        return () => clearInterval(interval);
    }, []);

    if (loading) return <div className="flex h-full items-center justify-center"><Loader2 className="w-10 h-10 animate-spin text-blue-500" /></div>;

    return (
        <motion.div
            className="space-y-8 p-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
        >
            {/* Header Status Bar */}
            <div className="flex flex-col md:flex-row justify-between items-center bg-white/80 backdrop-blur-sm p-4 rounded-2xl shadow-sm border border-gray-100">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Hospital Command Center</h1>
                    <p className="text-sm text-gray-500 flex items-center gap-2">
                        <span className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                        </span>
                        Real-Time System Online • {format(new Date(), 'EEEE, MMMM do, yyyy')}
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-3 mt-4 md:mt-0">
                    <div className="flex items-center space-x-2 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100">
                        <Users className="w-4 h-4 text-blue-600" />
                        <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">{systemStats.activeUsers} Active</span>
                    </div>
                    <div className="flex items-center space-x-2 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100">
                        <Activity className="w-4 h-4 text-emerald-600" />
                        <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">{systemStats.latency}</span>
                    </div>
                    <div className="flex items-center space-x-3 bg-slate-100 px-4 py-1.5 rounded-lg border border-slate-200">
                        <Clock className="w-4 h-4 text-slate-600" />
                        <span className="font-mono font-bold text-slate-700 text-sm">
                            {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                <StatCard
                    title="Total Patients"
                    value={stats.totalPatients}
                    icon={Users}
                    color={{ bg: 'bg-blue-100', text: 'text-blue-600' }}
                    delay={0.1}
                />
                <StatCard
                    title="Total Doctors"
                    value={stats.totalDoctors}
                    icon={Activity}
                    color={{ bg: 'bg-indigo-100', text: 'text-indigo-600' }}
                    delay={0.2}
                />
                <StatCard
                    title="Appointments"
                    value={stats.todayAppointments}
                    icon={Calendar}
                    color={{ bg: 'bg-purple-100', text: 'text-purple-600' }}
                    delay={0.3}
                />
                <StatCard
                    title="Revenue (Month)"
                    value={`$${stats.monthlyRevenue || 0}`}
                    icon={DollarSign}
                    color={{ bg: 'bg-green-100', text: 'text-green-600' }}
                    delay={0.4}
                />
                <StatCard
                    title="Pending Bills"
                    value={stats.pendingBills}
                    icon={CreditCard}
                    color={{ bg: 'bg-red-100', text: 'text-red-600' }}
                    delay={0.5}
                />
            </div>

            {/* Main Content Area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Activity Feed */}
                <div className="lg:col-span-1 bg-white/90 backdrop-blur rounded-2xl shadow-sm border border-gray-100 p-6 h-fit">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-lg font-bold text-gray-800 flex items-center">
                            <Activity className="w-5 h-5 mr-2 text-blue-500" /> Live Activity Feed
                        </h2>
                        <button
                            onClick={runSimulation}
                            className="text-[10px] uppercase tracking-wider font-bold bg-blue-50 text-blue-600 px-2 py-1 rounded hover:bg-blue-100 transition-colors border border-blue-200"
                        >
                            Simulate Event
                        </button>
                    </div>
                    <div className="space-y-6 relative before:absolute before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-100 min-h-[200px]">
                        <AnimatePresence initial={false}>
                            {activities.length === 0 ? (
                                <div className="pl-10 text-gray-400 text-sm italic py-4">Waiting for signals...</div>
                            ) : (
                                activities.map((item) => {
                                    const Ico = item.icon || Activity;
                                    return (
                                        <motion.div
                                            key={item.id}
                                            className="relative pl-10"
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: 20 }}
                                        >
                                            <div className={`absolute left-0 top-0 p-2 rounded-full ${item.color} z-10 box-content border-4 border-white shadow-sm`}>
                                                <Ico className="w-4 h-4" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">{item.message}</p>
                                                <p className="text-xs text-gray-500 mt-1">{item.time}</p>
                                            </div>
                                        </motion.div>
                                    );
                                })
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Operations Overview */}
                <div className="lg:col-span-2 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl shadow-lg text-white p-8 relative overflow-hidden">
                    <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-white/10 blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 rounded-full bg-white/10 blur-3xl"></div>

                    <div className="relative z-10">
                        <h2 className="text-2xl font-bold mb-2">Hospital Operations Overview</h2>
                        <p className="text-blue-100 mb-8 max-w-lg">
                            System is running smoothly. Currently tracking {stats.todayAppointments} active appointments and managing {stats.totalPatients} patient records.
                        </p>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {[
                                { label: 'New Patient', icon: UserPlus },
                                { label: 'Book Exam', icon: Calendar },
                                { label: 'Create Invoice', icon: DollarSign },
                                { label: 'Reports', icon: Activity }
                            ].map((action, i) => (
                                <button key={i} className="bg-white/20 hover:bg-white/30 backdrop-blur border border-white/30 rounded-xl p-4 transition-all hover:scale-105 text-left group">
                                    <action.icon className="w-6 h-6 mb-2 group-hover:scale-110 transition-transform" />
                                    <span className="block text-sm font-medium leading-tight">{action.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
