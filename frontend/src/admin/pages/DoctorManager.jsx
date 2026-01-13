import { useState, useEffect } from 'react';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import ActionMenu from '../../components/ActionMenu';
import ConfirmModal from '../../components/ConfirmModal';
import ShareModal from '../../components/ShareModal';
import DetailModal from '../../components/DetailModal';
import { Search, Plus, User, Edit, UserX, Calendar, Share2 } from 'lucide-react';

export default function DoctorManager() {
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [search, setSearch] = useState('');

    // Modal State
    const [deleteModal, setDeleteModal] = useState({ isOpen: false, id: null });
    const [shareModal, setShareModal] = useState({ isOpen: false, data: null });
    const [viewModal, setViewModal] = useState({ isOpen: false, data: null });

    // Form Data
    const [formData, setFormData] = useState({
        name: '', email: '', phone: '', password: 'hospitaldoctor',
        specialization: '', consultationFee: '', experience: '',
        qualifications: [] // simplified for now
    });

    useEffect(() => {
        fetchDoctors();
    }, []);

    const fetchDoctors = async () => {
        setLoading(true);
        try {
            const { data } = await api.get('/doctors');
            setDoctors(data.data || []);
        } catch (error) {
            toast.error('Failed to load doctors');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/doctors', formData);
            toast.success('Doctor Added Successfully');
            setShowModal(false);
            fetchDoctors();
            setFormData({
                name: '', email: '', phone: '', password: 'hospitaldoctor',
                specialization: '', consultationFee: '', experience: '', qualifications: []
            });
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to add doctor');
        }
    };

    const handleDelete = async () => {
        try {
            await api.delete(`/doctors/${deleteModal.id}`);
            toast.success('Doctor Deactivated');
            fetchDoctors();
        } catch (error) {
            toast.error('Failed to deactivate');
        }
    };

    const confirmDelete = (id) => {
        setDeleteModal({ isOpen: true, id });
    };

    const openShareModal = (doc) => {
        setShareModal({
            isOpen: true,
            data: {
                title: 'Share Doctor Profile',
                text: `MediCare Specialist: Dr. ${doc.user?.name} (${doc.specialization})`,
                url: `${window.location.origin}/doctors/${doc._id}`
            }
        });
    };

    const getActions = (doc) => [
        { label: 'View Profile', icon: User, onClick: () => setViewModal({ isOpen: true, data: doc }) },
        { label: 'Edit Details', icon: Edit, onClick: () => toast('Editing Dr. ' + doc.user?.name) },
        { label: 'View Schedule', icon: Calendar, onClick: () => toast('Opening schedule for Dr. ' + doc.user?.name) },
        { label: 'Share', icon: Share2, onClick: () => openShareModal(doc) },
        { label: 'Deactivate', icon: UserX, variant: 'danger', onClick: () => confirmDelete(doc._id) }
    ];

    const filtered = doctors.filter(d =>
        (d.user?.name || '').toLowerCase().includes(search.toLowerCase()) ||
        (d.specialization || '').toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm">
                <h1 className="text-xl font-bold text-gray-900">Doctor Management</h1>
                <div className="flex space-x-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search doctors..."
                            className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                    </div>
                    <button
                        onClick={() => setShowModal(true)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center"
                    >
                        <Plus className="w-4 h-4 mr-2" /> Add Doctor
                    </button>
                </div>
            </div>

            <div className="bg-white shadow-sm rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Doctor</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Specialization</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fee</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filtered.map(doc => (
                            <tr key={doc._id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className="h-10 w-10 flex-shrink-0 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                                            {doc.user?.name?.charAt(0)}
                                        </div>
                                        <div className="ml-4">
                                            <div className="text-sm font-medium text-gray-900">{doc.user?.name}</div>
                                            <div className="text-sm text-gray-500">{doc.user?.email}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{doc.specialization}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${doc.consultationFee}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                       ${doc.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                        {doc.isActive ? 'Active' : 'Inactive'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <div className="flex justify-end">
                                        <ActionMenu actions={getActions(doc)} />
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Create Doctor Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl p-6">
                        <h2 className="text-lg font-bold text-gray-900 mb-4">Add New Doctor</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <input
                                    placeholder="Full Name"
                                    className="border rounded p-2"
                                    required
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                />
                                <input
                                    placeholder="Email"
                                    type="email"
                                    className="border rounded p-2"
                                    required
                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                />
                                <input
                                    placeholder="Phone"
                                    className="border rounded p-2"
                                    required
                                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                />
                                <input
                                    placeholder="Specialization (e.g. Cardiology)"
                                    className="border rounded p-2"
                                    required
                                    onChange={e => setFormData({ ...formData, specialization: e.target.value })}
                                />
                                <input
                                    placeholder="Consultation Fee"
                                    type="number"
                                    className="border rounded p-2"
                                    required
                                    onChange={e => setFormData({ ...formData, consultationFee: e.target.value })}
                                />
                                <input
                                    placeholder="Experience (Years)"
                                    type="number"
                                    className="border rounded p-2"
                                    onChange={e => setFormData({ ...formData, experience: e.target.value })}
                                />
                            </div>
                            <div className="flex justify-end space-x-3 pt-4">
                                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 border rounded hover:bg-gray-50">Cancel</button>
                                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Create Doctor Account</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Confirm Delete Modal */}
            <ConfirmModal
                isOpen={deleteModal.isOpen}
                onClose={() => setDeleteModal({ ...deleteModal, isOpen: false })}
                onConfirm={handleDelete}
                title="Deactivate Doctor Account"
                message="Are you sure you want to deactivate this doctor's account? They will be unable to access the portal and their schedule will be hidden from patients."
                confirmText="Deactivate Now"
                type="danger"
            />

            <ShareModal
                isOpen={shareModal.isOpen}
                onClose={() => setShareModal({ ...shareModal, isOpen: false })}
                data={shareModal.data}
            />

            <DetailModal
                isOpen={viewModal.isOpen}
                onClose={() => setViewModal({ ...viewModal, isOpen: false })}
                type="doctor"
                data={viewModal.data}
            />
        </div>
    );
}
