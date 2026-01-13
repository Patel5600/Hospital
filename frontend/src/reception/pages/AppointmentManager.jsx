import { useState, useEffect } from 'react';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import { Plus, Eye, Edit, Trash2, Calendar, Share2 } from 'lucide-react';
import ActionMenu from '../../components/ActionMenu';
import ConfirmModal from '../../components/ConfirmModal';
import ShareModal from '../../components/ShareModal';

export default function AppointmentManager() {
    const [appointments, setAppointments] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [patients, setPatients] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [cancelModal, setCancelModal] = useState({ isOpen: false, id: null });
    const [shareModal, setShareModal] = useState({ isOpen: false, data: null });

    // Form
    const [formData, setFormData] = useState({
        patientId: '', doctorId: '', appointmentDate: '', timeSlot: '', notes: ''
    });

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [appRes, docRes, patRes] = await Promise.all([
                api.get('/appointments'),
                api.get('/doctors'),
                api.get('/patients')
            ]);
            setAppointments(appRes.data.data);
            setDoctors(docRes.data.data);
            setPatients(patRes.data.data);
        } catch (error) {
            toast.error('Failed to load data');
        }
    };

    const handleCancel = async () => {
        try {
            await api.put(`/appointments/${cancelModal.id}`, { status: 'cancelled' });
            toast.success('Appointment Cancelled');
            fetchData();
        } catch (error) {
            toast.error('Failed to cancel appointment');
        }
    };

    const openShareModal = (app) => {
        setShareModal({
            isOpen: true,
            data: {
                title: 'Share Appointment Details',
                text: `Appointment Confirmed: ${app.patient?.user?.name} with Dr. ${app.doctor?.user?.name} on ${format(new Date(app.appointmentDate), 'yyyy-MM-dd')} at ${app.timeSlot}`,
                url: `${window.location.origin}/appointments/${app._id}`
            }
        });
    };

    const getActions = (app) => [
        { label: 'View Details', icon: Eye, onClick: () => toast('Details for: ' + app._id) },
        { label: 'Reschedule', icon: Calendar, onClick: () => toast('Reschedule: ' + app._id) },
        { label: 'Share', icon: Share2, onClick: () => openShareModal(app) },
        { label: 'Cancel', icon: Trash2, variant: 'danger', onClick: () => setCancelModal({ isOpen: true, id: app._id }) }
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/appointments', formData);
            toast.success('Appointment Booked');
            setShowModal(false);
            fetchData(); // refresh
        } catch (error) {
            toast.error(error.response?.data?.message || 'Booking Failed');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm">
                <h1 className="text-xl font-bold text-gray-900">Appointment Scheduler</h1>
                <button
                    onClick={() => setShowModal(true)}
                    className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 flex items-center"
                >
                    <Plus className="w-4 h-4 mr-2" /> Book Appointment
                </button>
            </div>

            <div className="bg-white shadow-sm rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date/Time</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Patient</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Doctor</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {appointments.map(app => (
                            <tr key={app._id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {format(new Date(app.appointmentDate), 'yyyy-MM-dd')} <br />
                                    <span className="text-gray-500">{app.timeSlot}</span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {app.patient?.user?.name}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    Dr. {app.doctor?.user?.name}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                       ${app.status === 'completed' ? 'bg-green-100 text-green-800' :
                                            app.status === 'cancelled' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                        {app.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <div className="flex justify-end">
                                        <ActionMenu actions={getActions(app)} />
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
                        <h2 className="text-lg font-bold text-gray-900 mb-4">Book Appointment</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Patient</label>
                                <select
                                    className="mt-1 w-full border rounded-md p-2"
                                    onChange={e => setFormData({ ...formData, patientId: e.target.value })}
                                    required
                                >
                                    <option value="">Select Patient</option>
                                    {patients.map(p => (
                                        <option key={p._id} value={p._id}>{p.user?.name} ({p.user?.phone})</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Doctor</label>
                                <select
                                    className="mt-1 w-full border rounded-md p-2"
                                    onChange={e => setFormData({ ...formData, doctorId: e.target.value })}
                                    required
                                >
                                    <option value="">Select Doctor</option>
                                    {doctors.map(d => (
                                        <option key={d._id} value={d._id}>{d.user?.name} ({d.specialization})</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Date</label>
                                <input
                                    type="date"
                                    className="mt-1 w-full border rounded-md p-2"
                                    onChange={e => setFormData({ ...formData, appointmentDate: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Time Slot</label>
                                <select
                                    className="mt-1 w-full border rounded-md p-2"
                                    onChange={e => setFormData({ ...formData, timeSlot: e.target.value })}
                                    required
                                >
                                    <option value="">Select Slot</option>
                                    {['09:00-09:30', '09:30-10:00', '10:00-10:30', '10:30-11:00', '11:00-11:30'].map(t => (
                                        <option key={t} value={t}>{t}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex justify-end space-x-3 pt-4">
                                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 border rounded-md hover:bg-gray-50">Cancel</button>
                                <button type="submit" className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700">Confirm Booking</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <ConfirmModal
                isOpen={cancelModal.isOpen}
                onClose={() => setCancelModal({ ...cancelModal, isOpen: false })}
                onConfirm={handleCancel}
                title="Cancel Appointment"
                message="Are you sure you want to cancel this appointment? This will free up the time slot for other patients."
                confirmText="Confirm Cancellation"
                type="danger"
            />

            <ShareModal
                isOpen={shareModal.isOpen}
                onClose={() => setShareModal({ ...shareModal, isOpen: false })}
                data={shareModal.data}
            />
        </div>
    );
}
