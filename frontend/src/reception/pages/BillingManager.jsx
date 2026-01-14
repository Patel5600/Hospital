import { useState, useEffect } from 'react';
import api from '../../config/api';
import toast from 'react-hot-toast';
import { Search, Plus } from 'lucide-react';

export default function BillingManager() {
    const [bills, setBills] = useState([]);
    const [appointments, setAppointments] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({ appointmentId: '', labFee: 0, medicineFee: 0 });

    useEffect(() => {
        fetchBills();
    }, []);

    const fetchBills = async () => {
        try {
            const { data } = await api.get('/bills');
            setBills(data.data || []);
        } catch (error) {
            toast.error('Failed to load bills');
        }
    };

    const loadUnbilledAppointments = async () => {
        try {
            const { data } = await api.get('/appointments');
            const allApps = data.data || [];
            setAppointments(allApps.filter(app => app.status === 'completed' || app.status === 'scheduled'));
        } catch (error) {
            console.error(error);
        }
    };

    const handleOpenModal = () => {
        loadUnbilledAppointments();
        setShowModal(true);
    };

    const handleCreateBill = async (e) => {
        e.preventDefault();
        try {
            await api.post('/bills', formData);
            toast.success('Bill Generated');
            setShowModal(false);
            fetchBills();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed');
        }
    };

    const markPaid = async (id) => {
        try {
            await api.put(`/bills/${id}`, { paymentStatus: 'paid', paymentMethod: 'cash' });
            toast.success('Marked as Paid');
            fetchBills();
        } catch (error) {
            toast.error('Update failed');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm">
                <h1 className="text-xl font-bold text-gray-900">Billing & Invoices</h1>
                <button
                    onClick={handleOpenModal}
                    className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 flex items-center"
                >
                    <Plus className="w-4 h-4 mr-2" /> Generate Invoice
                </button>
            </div>

            <div className="bg-white shadow-sm rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Invoice #</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Patient</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Amount</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {bills.map(bill => (
                            <tr key={bill._id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">
                                    {bill.invoiceNumber}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {bill.patient?.user?.name || 'Unknown'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                                    ${bill.totalAmount}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                       ${bill.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                        {bill.paymentStatus}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {bill.paymentStatus !== 'paid' && (
                                        <button
                                            onClick={() => markPaid(bill._id)}
                                            className="text-purple-600 hover:text-purple-900"
                                        >
                                            Mark Paid
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
                        <h2 className="text-lg font-bold text-gray-900 mb-4">Generate Invoice</h2>
                        <form onSubmit={handleCreateBill} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Appointment</label>
                                <select
                                    className="mt-1 w-full border rounded-md p-2"
                                    onChange={e => setFormData({ ...formData, appointmentId: e.target.value })}
                                    required
                                >
                                    <option value="">Select Appointment</option>
                                    {appointments.map(app => (
                                        <option key={app._id} value={app._id}>
                                            {app.patient?.user?.name} - {app.doctor?.user?.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Lab Fee</label>
                                    <input
                                        type="number"
                                        className="mt-1 w-full border rounded-md p-2"
                                        onChange={e => setFormData({ ...formData, labFee: Number(e.target.value) })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Meds Fee</label>
                                    <input
                                        type="number"
                                        className="mt-1 w-full border rounded-md p-2"
                                        onChange={e => setFormData({ ...formData, medicineFee: Number(e.target.value) })}
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end space-x-3 pt-4">
                                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 border rounded-md hover:bg-gray-50">Cancel</button>
                                <button type="submit" className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700">Generate</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
