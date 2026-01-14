import { useState, useEffect } from 'react';
import api from '../../config/api';
import { CreditCard, CheckCircle, Clock } from 'lucide-react';
import { format } from 'date-fns';

export default function PatientBills() {
    const [bills, setBills] = useState([]);

    useEffect(() => {
        const fetchBills = async () => {
            try {
                const { data } = await api.get('/bills');
                setBills(data.data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchBills();
    }, []);

    return (
        <div className="space-y-6 pb-20 md:pb-0">
            <h1 className="text-xl font-bold text-gray-900">Billing History</h1>

            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Doctor</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {bills.length === 0 ? (
                                <tr><td colSpan="4" className="text-center py-6 text-gray-500">No records found.</td></tr>
                            ) : (
                                bills.map(bill => (
                                    <tr key={bill._id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {format(new Date(bill.createdAt), 'MMM dd, yyyy')}
                                            <div className="text-xs text-gray-500">{bill.invoiceNumber}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            Dr. {bill.doctor?.user?.name}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                                            ${bill.totalAmount}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex items-center text-xs leading-5 font-semibold rounded-full 
                                               ${bill.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                {bill.paymentStatus === 'paid' ? <CheckCircle className="w-3 h-3 mr-1" /> : <Clock className="w-3 h-3 mr-1" />}
                                                {bill.paymentStatus}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
