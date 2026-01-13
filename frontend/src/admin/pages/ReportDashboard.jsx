import { useState, useEffect } from 'react';
import api from '../../utils/api';
import { Bar, Pie } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
);

export default function ReportDashboard() {
    const [dailyReport, setDailyReport] = useState(null);
    const [monthlyReport, setMonthlyReport] = useState(null);

    useEffect(() => {
        const fetchReports = async () => {
            try {
                const [dailyDay, monthlyRes] = await Promise.all([
                    api.get('/reports/daily'),
                    api.get('/reports/monthly')
                ]);
                setDailyReport(dailyDay.data.report);
                setMonthlyReport(monthlyRes.data.report);
            } catch (error) {
                console.error(error);
            }
        };
        fetchReports();
    }, []);

    if (!dailyReport || !monthlyReport) return <div className="p-8">Loading reports...</div>;

    const barData = {
        labels: monthlyReport.doctorPerformance.map(d => d.doctorName),
        datasets: [
            {
                label: 'Revenue ($)',
                data: monthlyReport.doctorPerformance.map(d => d.revenue),
                backgroundColor: 'rgba(59, 130, 246, 0.5)',
            },
            {
                label: 'Consultations',
                data: monthlyReport.doctorPerformance.map(d => d.consultations),
                backgroundColor: 'rgba(16, 185, 129, 0.5)',
            }
        ],
    };

    return (
        <div className="space-y-8">
            <h1 className="text-2xl font-bold text-gray-900">Hospital Analytics</h1>

            {/* Daily Snapshot */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
                <h2 className="text-lg font-semibold mb-4 text-gray-800">Today's Snapshot ({dailyReport.date})</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    <div className="p-4 bg-blue-50 rounded-lg">
                        <p className="text-sm text-gray-500">Revenue</p>
                        <p className="text-xl font-bold text-blue-600">${dailyReport.revenue}</p>
                    </div>
                    <div className="p-4 bg-green-50 rounded-lg">
                        <p className="text-sm text-gray-500">Paid Bills</p>
                        <p className="text-xl font-bold text-green-600">{dailyReport.paidBills}</p>
                    </div>
                    <div className="p-4 bg-purple-50 rounded-lg">
                        <p className="text-sm text-gray-500">Appointments</p>
                        <p className="text-xl font-bold text-purple-600">{dailyReport.appointments}</p>
                    </div>
                    <div className="p-4 bg-orange-50 rounded-lg">
                        <p className="text-sm text-gray-500">New Patients</p>
                        <p className="text-xl font-bold text-orange-600">{dailyReport.patientsRegistered}</p>
                    </div>
                </div>
            </div>

            {/* Monthly Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-sm">
                    <h2 className="text-lg font-semibold mb-4 text-gray-800">Doctor Performance (This Month)</h2>
                    <Bar options={{ responsive: true }} data={barData} />
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm">
                    <h2 className="text-lg font-semibold mb-4 text-gray-800">Monthly Financials</h2>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center border-b pb-2">
                            <span className="text-gray-600">Total Revenue</span>
                            <span className="font-bold text-xl">${monthlyReport.totalRevenue}</span>
                        </div>
                        <div className="flex justify-between items-center border-b pb-2">
                            <span className="text-gray-600">Total Appointments</span>
                            <span className="font-bold">{monthlyReport.appointments}</span>
                        </div>
                        <div className="flex justify-between items-center border-b pb-2">
                            <span className="text-gray-600">New Patients</span>
                            <span className="font-bold">{monthlyReport.patientsRegistered}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
