import { useEffect, useState } from 'react';
import api from '../../config/api';
import { Users, Calendar, Clock, CreditCard } from 'lucide-react';

export default function ReceptionDashboard() {
    const [stats, setStats] = useState({
        appointmentsToday: 0,
        newPatientsToday: 0,
        activeDoctors: 0,
        pendingBills: 0
    });

    useEffect(() => {
        // In a real app we might have a specific endpoint for reception dashboard,
        // but we can reuse /admin/dashboard or fetch individual counts.
        // For now, let's try to fetch /admin/dashboard since reception is allowed to view some stats.
        const fetchStats = async () => {
            try {
                const { data } = await api.get('/admin/dashboard');
                if (data.success) {
                    // Mapping admin stats to reception view
                    setStats({
                        appointmentsToday: data.data.todayAppointments,
                        newPatientsToday: 0, // Not explicitly in admin dash, user admin dash to add this or placeholder
                        activeDoctors: data.data.totalDoctors,
                        pendingBills: data.data.pendingBills
                    });
                }
            } catch (error) {
                console.error('Error fetching dashboard stats:', error);
            }
        };
        fetchStats();
    }, []);

    const Card = ({ title, value, icon: Icon, color }) => (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex items-center">
            <div className={`p-3 rounded-full ${color.bg} ${color.text}`}>
                <Icon className="w-8 h-8" />
            </div>
            <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">{title}</p>
                <p className="text-2xl font-bold text-gray-900">{value}</p>
            </div>
        </div>
    );

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900">Reception Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card
                    title="Today's Appointments"
                    value={stats.appointmentsToday}
                    icon={Calendar}
                    color={{ bg: 'bg-blue-100', text: 'text-blue-600' }}
                />
                <Card
                    title="Active Doctors"
                    value={stats.activeDoctors}
                    icon={Users}
                    color={{ bg: 'bg-green-100', text: 'text-green-600' }}
                />
                <Card
                    title="Pending Bills"
                    value={stats.pendingBills}
                    icon={CreditCard}
                    color={{ bg: 'bg-red-100', text: 'text-red-600' }}
                />
                <Card
                    title="New Patients (Est)"
                    value="--"
                    icon={Users}
                    color={{ bg: 'bg-purple-100', text: 'text-purple-600' }}
                />
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                    <h3 className="font-semibold text-gray-900 mb-2">Registration</h3>
                    <p className="text-sm text-gray-500 mb-4">Register new patients quickly.</p>
                    <a href="/reception/patients" className="text-purple-600 hover:text-purple-700 font-medium text-sm">Go to Patients &rarr;</a>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                    <h3 className="font-semibold text-gray-900 mb-2">Appointments</h3>
                    <p className="text-sm text-gray-500 mb-4">Book and manage schedules.</p>
                    <a href="/reception/appointments" className="text-purple-600 hover:text-purple-700 font-medium text-sm">Go to Appointments &rarr;</a>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                    <h3 className="font-semibold text-gray-900 mb-2">Billing</h3>
                    <p className="text-sm text-gray-500 mb-4">Generate invoices and accept payment.</p>
                    <a href="/reception/billing" className="text-purple-600 hover:text-purple-700 font-medium text-sm">Go to Billing &rarr;</a>
                </div>
            </div>
        </div>
    );
}
