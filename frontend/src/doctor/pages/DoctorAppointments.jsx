import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

export default function DoctorAppointments() {
    const [appointments, setAppointments] = useState([]);
    const [filter, setFilter] = useState('upcoming'); // 'all', 'today', 'upcoming'

    const fetchAppointments = async () => {
        try {
            const { data } = await api.get('/appointments');
            setAppointments(data.data);
        } catch (error) {
            toast.error('Failed to load appointments');
        }
    };

    useEffect(() => {
        fetchAppointments();
    }, []);

    const filteredAppointments = appointments.filter(app => {
        const appDate = new Date(app.appointmentDate);
        const today = new Date();
        const isToday = format(appDate, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd');

        if (filter === 'today') return isToday;
        if (filter === 'upcoming') return appDate >= today.setHours(0, 0, 0, 0);
        return true;
    });

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900">My Appointments</h1>
                <div className="bg-white rounded-md shadow-sm p-1 inline-flex">
                    {['upcoming', 'today', 'all'].map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-4 py-2 text-sm font-medium rounded-md capitalize ${filter === f ? 'bg-teal-100 text-teal-800' : 'text-gray-500 hover:text-gray-900'}`}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <ul className="divide-y divide-gray-200">
                    {filteredAppointments.length === 0 ? (
                        <li className="p-6 text-center text-gray-500">No appointments found for this filter.</li>
                    ) : (
                        filteredAppointments.map((appointment) => (
                            <li key={appointment._id}>
                                <div className="px-4 py-4 sm:px-6">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 h-12 w-12 bg-gray-200 rounded-full flex items-center justify-center text-lg font-bold text-gray-600">
                                                {appointment.patient?.user?.name?.charAt(0)}
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-teal-600 truncate">
                                                    {appointment.patient?.user?.name}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    Slot: {appointment.timeSlot}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-4">
                                            <div className="flex flex-col items-end">
                                                <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                                    {format(new Date(appointment.appointmentDate), 'MMM dd, yyyy')}
                                                </p>
                                                <p className="text-sm text-gray-500 mt-1 capitalize">
                                                    {appointment.status}
                                                </p>
                                            </div>
                                            {appointment.status === 'scheduled' && (
                                                <Link
                                                    to={`/doctor/consultation/${appointment._id}`}
                                                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-teal-600 hover:bg-teal-700"
                                                >
                                                    Start Consultation
                                                </Link>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </li>
                        ))
                    )}
                </ul>
            </div>
        </div>
    );
}
