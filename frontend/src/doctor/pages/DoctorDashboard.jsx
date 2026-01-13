import { useEffect, useState } from 'react';
import api from '../../utils/api';
import { Calendar, CheckCircle, Clock, CheckSquare } from 'lucide-react';
import { format } from 'date-fns';

export default function DoctorDashboard() {
    const [appointments, setAppointments] = useState([]);
    const [stats, setStats] = useState({
        today: 0,
        upcoming: 0,
        completed: 0
    });

    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                const { data } = await api.get('/appointments'); // Controller automatically filters for logged-in doctor
                const allAppointments = data.data;

                const todayStr = format(new Date(), 'yyyy-MM-dd');

                const todayCount = allAppointments.filter(app =>
                    format(new Date(app.appointmentDate), 'yyyy-MM-dd') === todayStr && app.status !== 'cancelled'
                ).length;

                const upcomingCount = allAppointments.filter(app =>
                    new Date(app.appointmentDate) > new Date() && app.status === 'scheduled'
                ).length;

                const completedCount = allAppointments.filter(app => app.status === 'completed').length;

                setStats({
                    today: todayCount,
                    upcoming: upcomingCount,
                    completed: completedCount
                });

                // Show recent few appointments
                setAppointments(allAppointments.slice(0, 5));
            } catch (error) {
                console.error('Error fetching appointments:', error);
            }
        };
        fetchAppointments();
    }, []);

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900">Doctor's Dashboard</h1>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                <div className="p-6 bg-white rounded-lg shadow-sm border-l-4 border-indigo-500">
                    <div className="flex items-center">
                        <div className="p-3 bg-indigo-100 rounded-full text-indigo-600">
                            <Calendar className="w-6 h-6" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500">Appointments Today</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.today}</p>
                        </div>
                    </div>
                </div>

                <div className="p-6 bg-white rounded-lg shadow-sm border-l-4 border-blue-500">
                    <div className="flex items-center">
                        <div className="p-3 bg-blue-100 rounded-full text-blue-600">
                            <Clock className="w-6 h-6" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500">Upcoming</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.upcoming}</p>
                        </div>
                    </div>
                </div>

                <div className="p-6 bg-white rounded-lg shadow-sm border-l-4 border-green-500">
                    <div className="flex items-center">
                        <div className="p-3 bg-green-100 rounded-full text-green-600">
                            <CheckCircle className="w-6 h-6" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500">Completed</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.completed}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Activity / Schedule Preview */}
            <div className="bg-white rounded-lg shadow-sm">
                <div className="p-5 border-b border-gray-100">
                    <h2 className="text-lg font-semibold text-gray-800">Your Schedule Overview</h2>
                </div>
                <div className="p-5">
                    {appointments.length === 0 ? (
                        <p className="text-gray-500 text-center py-4">No appointments found.</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {appointments.map((app) => (
                                        <tr key={app._id}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {format(new Date(app.appointmentDate), 'MMM dd, yyyy')}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {app.timeSlot}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {app.patient?.user?.name || 'Unknown'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                             ${app.status === 'completed' ? 'bg-green-100 text-green-800' :
                                                        app.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                                            'bg-yellow-100 text-yellow-800'}`}>
                                                    {app.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                <button className="text-indigo-600 hover:text-indigo-900">View</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
