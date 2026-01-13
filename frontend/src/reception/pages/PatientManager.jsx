import { useState, useEffect } from 'react';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import { Search, Plus, User, Edit, Trash2, Share2 } from 'lucide-react';
import ActionMenu from '../../components/ActionMenu';
import ConfirmModal from '../../components/ConfirmModal';
import ShareModal from '../../components/ShareModal';
import DetailModal from '../../components/DetailModal';

export default function PatientManager() {
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [deleteModal, setDeleteModal] = useState({ isOpen: false, id: null });
    const [shareModal, setShareModal] = useState({ isOpen: false, data: null });
    const [viewModal, setViewModal] = useState({ isOpen: false, data: null });

    // Form
    const [formData, setFormData] = useState({
        name: '', email: '', phone: '', password: 'hospitalpatient',
        dateOfBirth: '', gender: 'male', bloodGroup: '',
        address: { street: '', city: '', state: '', zipCode: '' } // simplified
    });

    const fetchPatients = async () => {
        setLoading(true);
        try {
            const { data } = await api.get('/patients');
            setPatients(data.data || []);
        } catch (error) {
            toast.error('Failed to load patients');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPatients();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setFormData(prev => ({
                ...prev,
                [parent]: { ...prev[parent], [child]: value }
            }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/patients', formData);
            toast.success('Patient Registered Successfully');
            setShowModal(false);
            fetchPatients();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Registration Failed');
        }
    };

    const handleDelete = async () => {
        try {
            await api.delete(`/patients/${deleteModal.id}`);
            toast.success('Patient record deleted');
            fetchPatients();
        } catch (error) {
            toast.error('Failed to delete patient');
        }
    };

    const confirmDelete = (id) => {
        setDeleteModal({ isOpen: true, id });
    };

    const openShareModal = (patient) => {
        setShareModal({
            isOpen: true,
            data: {
                title: 'Share Patient Record',
                text: `MediCare Record: ${patient.user?.name} (ID: ${patient.patientId})`,
                url: `${window.location.origin}/patients/${patient._id}`
            }
        });
    };

    const getActions = (patient) => [
        { label: 'View Profile', icon: User, onClick: () => setViewModal({ isOpen: true, data: patient }) },
        { label: 'Edit Record', icon: Edit, onClick: () => toast('Editing ' + patient.user?.name) },
        { label: 'Share', icon: Share2, onClick: () => openShareModal(patient) },
        { label: 'Delete', icon: Trash2, variant: 'danger', onClick: () => confirmDelete(patient._id) }
    ];

    const filtered = patients.filter(p =>
        (p.user?.name || '').toLowerCase().includes(search.toLowerCase()) ||
        (p.user?.email || '').toLowerCase().includes(search.toLowerCase()) ||
        (p.user?.phone || '').includes(search)
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-center bg-white p-4 rounded-lg shadow-sm">
                <h1 className="text-xl font-bold text-gray-900 mb-4 sm:mb-0">Patient Registry</h1>
                <div className="flex items-center space-x-4 w-full sm:w-auto">
                    <div className="relative flex-1 sm:flex-none">
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search patients..."
                            className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500 w-full sm:w-64"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                    </div>
                    <button
                        onClick={() => setShowModal(true)}
                        className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 flex items-center"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Register New
                    </button>
                </div>
            </div>

            {/* List */}
            <div className="bg-white shadow-sm rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Demographics</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filtered.length === 0 ? (
                                <tr><td colSpan="5" className="text-center py-6 text-gray-500">No patients found.</td></tr>
                            ) : (
                                filtered.map(patient => (
                                    <tr key={patient._id}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="h-10 w-10 flex-shrink-0 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-bold">
                                                    {patient.user?.name?.charAt(0)}
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">{patient.user?.name}</div>
                                                    <div className="text-sm text-gray-500">{patient.user?.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {patient.user?.phone}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                                            {patient.gender}, {patient.bloodGroup}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">
                                            {patient.patientId}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex justify-end">
                                                <ActionMenu actions={getActions(patient)} />
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b sticky top-0 bg-white">
                            <h2 className="text-lg font-bold text-gray-900">Register New Patient</h2>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Full Name</label>
                                    <input type="text" name="name" required className="mt-1 w-full border rounded-md p-2" onChange={handleChange} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Email</label>
                                    <input type="email" name="email" required className="mt-1 w-full border rounded-md p-2" onChange={handleChange} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Phone</label>
                                    <input type="text" name="phone" required className="mt-1 w-full border rounded-md p-2" onChange={handleChange} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
                                    <input type="date" name="dateOfBirth" required className="mt-1 w-full border rounded-md p-2" onChange={handleChange} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Gender</label>
                                    <select name="gender" className="mt-1 w-full border rounded-md p-2" onChange={handleChange}>
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Blood Group</label>
                                    <select name="bloodGroup" className="mt-1 w-full border rounded-md p-2" onChange={handleChange}>
                                        <option value="">Select</option>
                                        {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map(bg => <option key={bg} value={bg}>{bg}</option>)}
                                    </select>
                                </div>
                            </div>

                            <hr />
                            <h3 className="font-medium text-gray-900">Address</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <input type="text" name="address.street" placeholder="Street" className="border rounded-md p-2" onChange={handleChange} />
                                <input type="text" name="address.city" placeholder="City" className="border rounded-md p-2" onChange={handleChange} />
                                <input type="text" name="address.state" placeholder="State" className="border rounded-md p-2" onChange={handleChange} />
                                <input type="text" name="address.zipCode" placeholder="Zip" className="border rounded-md p-2" onChange={handleChange} />
                            </div>

                            <div className="flex justify-end space-x-3 pt-4">
                                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 border rounded-md hover:bg-gray-50">Cancel</button>
                                <button type="submit" className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700">Register Patient</button>
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
                title="Delete Patient Record"
                message="Are you sure you want to delete this patient record? This action cannot be undone and all clinical history will be archived."
                confirmText="Permanently Delete"
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
                type="patient"
                data={viewModal.data}
            />
        </div>
    );
}
