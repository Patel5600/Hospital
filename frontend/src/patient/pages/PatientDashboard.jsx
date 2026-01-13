import { useEffect, useState } from 'react';
import api from '../../utils/api';
import { Calendar, FileText, CreditCard } from 'lucide-react';
import { format } from 'date-fns';

export default function PatientDashboard() {
    const [appointments, setAppointments] = useState([]);
    const [bills, setBills] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [appRes, billRes] = await Promise.all([
                    api.get('/appointments'),
                    api.get('/bills')
                ]);
                setAppointments(appRes.data.data);
                setBills(billRes.data.data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const upcomingAppointments = appointments.filter(app =>
        new Date(app.appointmentDate) >= new Date().setHours(0, 0, 0, 0) && app.status !== 'cancelled'
    ).sort((a, b) => new Date(a.appointmentDate) - new Date(b.appointmentDate)).slice(0, 3);

    const pendingBills = bills.filter(b => b.paymentStatus === 'pending');

    if (loading) return <div className="p-8">Loading dashboard...</div>;

    return (
        <div className="space-y-6 pb-20 md:pb-0">
            <h1 className="text-2xl font-bold text-gray-900">Welcome Back</h1>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-sky-500">
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="text-sm text-gray-500">Upcoming Appointments</p>
                            <p className="text-2xl font-bold text-gray-900">{upcomingAppointments.length}</p>
                        </div>
                        <Calendar className="w-8 h-8 text-sky-200" />
                    </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-red-500">
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="text-sm text-gray-500">Pending Bills</p>
                            <p className="text-2xl font-bold text-gray-900">{pendingBills.length}</p>
                        </div>
                        <CreditCard className="w-8 h-8 text-red-200" />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Upcoming Appointments */}
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                        <h3 className="font-semibold text-gray-900">Upcoming Appointments</h3>
                        <a href="/patient/appointments" className="text-sm text-sky-600 hover:text-sky-700">View All</a>
                    </div>
                    <div className="divide-y divide-gray-100">
                        {upcomingAppointments.length === 0 ? (
                            <p className="p-6 text-gray-500 text-center">No upcoming appointments.</p>
                        ) : (
                            upcomingAppointments.map(app => (
                                <div key={app._id} className="p-6 flex items-start space-x-4">
                                    <div className="flex-shrink-0 bg-sky-100 rounded-lg p-3 text-center min-w-[60px]">
                                        <p className="text-xs text-sky-600 font-bold uppercase">{format(new Date(app.appointmentDate), 'MMM')}</p>
                                        <p className="text-xl font-bold text-sky-800">{format(new Date(app.appointmentDate), 'dd')}</p>
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900">Dr. {app.doctor?.user?.name}</p>
                                        <p className="text-sm text-gray-500">{app.doctor?.specialization}</p>
                                        <p className="text-sm font-semibold text-sky-600 mt-1">{app.timeSlot}</p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Pending Bills */}
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                        <h3 className="font-semibold text-gray-900">Unpaid Invoices</h3>
                        <a href="/patient/bills" className="text-sm text-sky-600 hover:text-sky-700">View All</a>
                    </div>
                    <div className="divide-y divide-gray-100">
                        {pendingBills.length === 0 ? (
                            <p className="p-6 text-gray-500 text-center">All bills are paid.</p>
                        ) : (
                            pendingBills.map(bill => (
                                <div key={bill._id} className="p-6 flex justify-between items-center bg-red-50">
                                    <div>
                                        <p className="font-medium text-gray-900">Inv: {bill.invoiceNumber}</p>
                                        <p className="text-sm text-gray-500">{format(new Date(bill.createdAt), 'MMM dd, yyyy')}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-lg font-bold text-gray-900">${bill.totalAmount}</p>
                                        <span className="text-xs font-semibold text-red-600 bg-red-100 px-2 py-1 rounded-full uppercase">Pending</span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
