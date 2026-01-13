import { useState, useEffect } from 'react';
import { appointmentService } from '../services';
import { Link } from 'react-router-dom';

const Appointments = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchAppointments();
    }, []);

    const fetchAppointments = async () => {
        try {
            const response = await appointmentService.getAll();
            setAppointments(response.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch appointments');
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = (status) => {
        const statusClasses = {
            scheduled: 'badge badge-info',
            confirmed: 'badge badge-success',
            completed: 'badge badge-success',
            cancelled: 'badge badge-danger',
            'no-show': 'badge badge-warning',
        };
        return statusClasses[status] || 'badge';
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-xl text-gray-600">Loading...</div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-900">Appointments</h1>
                <Link to="/appointments/new" className="btn-primary">
                    Book New Appointment
                </Link>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                    {error}
                </div>
            )}

            <div className="grid gap-6">
                {appointments.length === 0 ? (
                    <div className="card text-center py-12">
                        <p className="text-gray-500">No appointments found</p>
                    </div>
                ) : (
                    appointments.map((appointment) => (
                        <div key={appointment._id} className="card hover:shadow-lg transition-shadow">
                            <div className="flex justify-between items-start">
                                <div className="flex-1">
                                    <div className="flex items-center space-x-3 mb-3">
                                        <h3 className="text-lg font-semibold text-gray-900">
                                            {appointment.appointmentId}
                                        </h3>
                                        <span className={getStatusBadge(appointment.status)}>
                                            {appointment.status}
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <p className="text-gray-600 mb-1">
                                                <span className="font-medium">Patient:</span>{' '}
                                                {appointment.patient?.user?.name}
                                            </p>
                                            <p className="text-gray-600 mb-1">
                                                <span className="font-medium">Patient ID:</span>{' '}
                                                {appointment.patient?.patientId}
                                            </p>
                                        </div>

                                        <div>
                                            <p className="text-gray-600 mb-1">
                                                <span className="font-medium">Doctor:</span>{' '}
                                                {appointment.doctor?.user?.name}
                                            </p>
                                            <p className="text-gray-600 mb-1">
                                                <span className="font-medium">Specialization:</span>{' '}
                                                {appointment.doctor?.specialization}
                                            </p>
                                        </div>

                                        <div>
                                            <p className="text-gray-600 mb-1">
                                                <span className="font-medium">Date:</span>{' '}
                                                {formatDate(appointment.appointmentDate)}
                                            </p>
                                            <p className="text-gray-600 mb-1">
                                                <span className="font-medium">Time:</span>{' '}
                                                {appointment.appointmentTime}
                                            </p>
                                        </div>

                                        <div>
                                            <p className="text-gray-600 mb-1">
                                                <span className="font-medium">Reason:</span>{' '}
                                                {appointment.reason}
                                            </p>
                                        </div>
                                    </div>

                                    {appointment.notes && (
                                        <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                                            <p className="text-sm text-gray-700">
                                                <span className="font-medium">Notes:</span> {appointment.notes}
                                            </p>
                                        </div>
                                    )}
                                </div>

                                <div className="ml-4">
                                    <Link
                                        to={`/appointments/${appointment._id}`}
                                        className="text-primary-600 hover:text-primary-900 text-sm font-medium"
                                    >
                                        View Details →
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Appointments;
