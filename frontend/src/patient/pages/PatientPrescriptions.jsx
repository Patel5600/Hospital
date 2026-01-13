import { useState, useEffect } from 'react';
import api from '../../utils/api';
import { FileText, Download } from 'lucide-react';
import { format } from 'date-fns';

export default function PatientPrescriptions() {
    const [prescriptions, setPrescriptions] = useState([]);

    useEffect(() => {
        const fetchPrescriptions = async () => {
            // Similar to appointments, we rely on backend to filter by req.user
            try {
                const { data } = await api.get('/prescriptions');
                setPrescriptions(data.data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchPrescriptions();
    }, []);

    return (
        <div className="space-y-6 pb-20 md:pb-0">
            <h1 className="text-xl font-bold text-gray-900">My Prescriptions</h1>

            <div className="space-y-4">
                {prescriptions.length === 0 ? (
                    <div className="text-center p-8 bg-white rounded-lg shadow-sm text-gray-500">
                        No prescriptions found.
                    </div>
                ) : (
                    prescriptions.map(pres => (
                        <div key={pres._id} className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
                            <div className="flex justify-between items-start border-b pb-4 mb-4">
                                <div>
                                    <h3 className="font-bold text-gray-900">{pres.diagnosis}</h3>
                                    <p className="text-sm text-gray-500">Dr. {pres.doctor?.user?.name}</p>
                                    <p className="text-xs text-gray-400 mt-1">{format(new Date(pres.prescriptionDate), 'MMM dd, yyyy')}</p>
                                </div>
                                <button className="text-sky-600 hover:text-sky-700 p-2">
                                    <Download className="w-5 h-5" />
                                </button>
                            </div>

                            <div>
                                <h4 className="text-sm font-semibold text-gray-700 mb-2">Medications</h4>
                                <ul className="space-y-2">
                                    {pres.medications.map((med, i) => (
                                        <li key={i} className="text-sm flex justify-between bg-gray-50 p-2 rounded">
                                            <span className="font-medium text-gray-800">{med.name} <span className="text-gray-500 font-normal">({med.dosage})</span></span>
                                            <span className="text-gray-600">{med.frequency} • {med.duration}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {pres.notes && (
                                <div className="mt-4 text-sm text-gray-600 italic bg-yellow-50 p-3 rounded">
                                    Note: {pres.notes}
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
