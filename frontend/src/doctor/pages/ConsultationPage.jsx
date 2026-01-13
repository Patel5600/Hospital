import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import { Plus, Trash2, ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';

export default function ConsultationPage() {
    const { appointmentId } = useParams();
    const navigate = useNavigate();
    const [appointment, setAppointment] = useState(null);
    const [loading, setLoading] = useState(true);

    // Form States
    const [diagnosis, setDiagnosis] = useState('');
    const [symptoms, setSymptoms] = useState('');
    const [notes, setNotes] = useState('');
    const [medications, setMedications] = useState([
        { name: '', dosage: '', frequency: '', duration: '', instructions: '' }
    ]);
    const [labTests, setLabTests] = useState([]);

    useEffect(() => {
        const fetchAppointment = async () => {
            try {
                const { data } = await api.get(`/appointments/${appointmentId}`);
                if (data.success) {
                    setAppointment(data.data);
                }
            } catch (error) {
                toast.error('Failed to load appointment details');
                navigate('/doctor/appointments');
            } finally {
                setLoading(false);
            }
        };
        fetchAppointment();
    }, [appointmentId, navigate]);

    const handleMedicationChange = (index, field, value) => {
        const newMeds = [...medications];
        newMeds[index][field] = value;
        setMedications(newMeds);
    };

    const addMedication = () => {
        setMedications([...medications, { name: '', dosage: '', frequency: '', duration: '', instructions: '' }]);
    };

    const removeMedication = (index) => {
        const newMeds = medications.filter((_, i) => i !== index);
        setMedications(newMeds);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // 1. Create Prescription
            await api.post('/prescriptions', {
                patient: appointment.patient._id,
                appointment: appointment._id,
                diagnosis,
                symptoms: symptoms.split(',').map(s => s.trim()).filter(s => s),
                medications,
                notes
            });

            // 2. Mark Appointment as Completed
            await api.put(`/appointments/${appointment._id}`, {
                status: 'completed',
                notes: `Diagnosis: ${diagnosis}` // Update appointment notes too for quick visual
            });

            toast.success('Consultation completed successfully');
            navigate('/doctor/dashboard');
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || 'Failed to submit consultation');
        }
    };

    if (loading) return <div className="p-8 text-center">Loading...</div>;

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <button onClick={() => navigate(-1)} className="flex items-center text-gray-600 hover:text-gray-900">
                <ArrowLeft className="w-4 h-4 mr-2" /> Back
            </button>

            {/* Patient Header */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex justify-between items-start">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">{appointment.patient?.user?.name}</h2>
                        <p className="text-gray-500">
                            {appointment.patient?.gender} • {format(new Date(appointment.patient?.dateOfBirth), 'yyyy-MM-dd')} • {appointment.patient?.bloodGroup}
                        </p>
                        <p className="text-gray-500 mt-1">Phone: {appointment.patient?.user?.phone}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-sm text-gray-500">Appointment ID</p>
                        <p className="font-mono text-gray-900">{appointment._id.substr(-6).toUpperCase()}</p>
                        <p className="mt-2 text-sm text-gray-500">Date</p>
                        <p className="font-medium text-gray-900">{format(new Date(appointment.appointmentDate), 'MMM dd, yyyy')}</p>
                    </div>
                </div>
            </div>

            {/* Consultation Form */}
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 space-y-6">
                <h3 className="text-lg font-bold text-gray-900 border-b pb-2">Consultation Details</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Diagnosis</label>
                        <input
                            type="text"
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
                            placeholder="e.g. Acute Bronchitis"
                            value={diagnosis}
                            onChange={(e) => setDiagnosis(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Symptoms (comma separated)</label>
                        <input
                            type="text"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
                            placeholder="e.g. Cough, Fever, Fatigue"
                            value={symptoms}
                            onChange={(e) => setSymptoms(e.target.value)}
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Clinical Notes</label>
                    <textarea
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
                        placeholder="Additional observations..."
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                    />
                </div>

                <div className="border-t pt-6">
                    <div className="flex justify-between items-center mb-4">
                        <h4 className="text-md font-bold text-gray-900">Medications</h4>
                        <button type="button" onClick={addMedication} className="flex items-center text-sm text-teal-600 hover:text-teal-700 font-medium">
                            <Plus className="w-4 h-4 mr-1" /> Add Medicine
                        </button>
                    </div>

                    <div className="space-y-4">
                        {medications.map((med, index) => (
                            <div key={index} className="flex flex-col md:flex-row gap-4 p-4 bg-gray-50 rounded-md relative group">
                                <div className="flex-1">
                                    <input
                                        placeholder="Medicine Name"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
                                        value={med.name}
                                        onChange={(e) => handleMedicationChange(index, 'name', e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="w-full md:w-32">
                                    <input
                                        placeholder="Dosage (500mg)"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
                                        value={med.dosage}
                                        onChange={(e) => handleMedicationChange(index, 'dosage', e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="w-full md:w-32">
                                    <select
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
                                        value={med.frequency}
                                        onChange={(e) => handleMedicationChange(index, 'frequency', e.target.value)}
                                        required
                                    >
                                        <option value="">Freq</option>
                                        <option value="1-0-0">1-0-0</option>
                                        <option value="1-0-1">1-0-1</option>
                                        <option value="1-1-1">1-1-1</option>
                                        <option value="0-0-1">0-0-1</option>
                                        <option value="SOS">SOS</option>
                                    </select>
                                </div>
                                <div className="w-full md:w-32">
                                    <input
                                        placeholder="Duration (5 days)"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
                                        value={med.duration}
                                        onChange={(e) => handleMedicationChange(index, 'duration', e.target.value)}
                                        required
                                    />
                                </div>

                                {medications.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => removeMedication(index)}
                                        className="text-red-500 hover:text-red-700 p-2"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="pt-6 border-t flex justify-end">
                    <button
                        type="submit"
                        className="px-6 py-3 bg-teal-600 text-white font-medium rounded-md shadow-sm hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                    >
                        Complete Consultation & Print Prescription
                    </button>
                </div>
            </form>
        </div>
    );
}
