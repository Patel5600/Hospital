import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';

// Admin Components (New)
import DoctorManager from './admin/pages/DoctorManager';
import ReportDashboard from './admin/pages/ReportDashboard';
// Reuse existing powerful managers for Admin
import { PatientManager, AppointmentManager, BillingManager } from './admin/pages/SharedAdminPages';

// Doctor Components
import DoctorLayout from './doctor/components/DoctorLayout';
import DoctorDashboard from './doctor/pages/DoctorDashboard';
import DoctorAppointments from './doctor/pages/DoctorAppointments';
import ConsultationPage from './doctor/pages/ConsultationPage';

// Reception Components
import ReceptionLayout from './reception/components/ReceptionLayout';
import ReceptionDashboard from './reception/pages/ReceptionDashboard';
import PatientManagerReception from './reception/pages/PatientManager';
import AppointmentManagerReception from './reception/pages/AppointmentManager';
import BillingManagerReception from './reception/pages/BillingManager';

// Patient Components
import PatientLayout from './patient/components/PatientLayout';
import PatientDashboard from './patient/pages/PatientDashboard';
import PatientAppointments from './patient/pages/PatientAppointments';
import PatientPrescriptions from './patient/pages/PatientPrescriptions';
import PatientBills from './patient/pages/PatientBills';

// Fallback/Unauthorized
const Unauthorized = () => <div className="flex h-screen justify-center items-center text-red-500 font-bold">Unauthorized Access</div>;

import { SocketProvider } from './context/SocketContext';

function App() {
  return (
    <AuthProvider>
      <SocketProvider>
        <BrowserRouter>
          <Toaster position="top-right" />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/unauthorized" element={<Unauthorized />} />

            {/* Admin Routes */}
            <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
              <Route element={<Layout />}>
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/patients" element={<PatientManager />} /> {/* Using shared manager */}
                <Route path="/doctors" element={<DoctorManager />} /> {/* New specific component */}
                <Route path="/appointments" element={<AppointmentManager />} /> {/* Using shared manager */}
                <Route path="/billing" element={<BillingManager />} /> {/* Using shared manager */}
                <Route path="/reports" element={<ReportDashboard />} /> {/* New specific component */}
              </Route>
            </Route>

            {/* Doctor Routes */}
            <Route element={<ProtectedRoute allowedRoles={['doctor']} />}>
              <Route path="/doctor" element={<DoctorLayout />}>
                <Route path="dashboard" element={<DoctorDashboard />} />
                <Route path="appointments" element={<DoctorAppointments />} />
                <Route path="consultation/:appointmentId" element={<ConsultationPage />} />
                <Route index element={<Navigate to="dashboard" replace />} />
              </Route>
            </Route>

            {/* Reception Routes */}
            <Route element={<ProtectedRoute allowedRoles={['receptionist']} />}>
              <Route path="/reception" element={<ReceptionLayout />}>
                <Route path="dashboard" element={<ReceptionDashboard />} />
                <Route path="patients" element={<PatientManagerReception />} />
                <Route path="appointments" element={<AppointmentManagerReception />} />
                <Route path="billing" element={<BillingManagerReception />} />
                <Route index element={<Navigate to="dashboard" replace />} />
              </Route>
            </Route>

            {/* Patient Routes */}
            <Route element={<ProtectedRoute allowedRoles={['patient']} />}>
              <Route path="/patient" element={<PatientLayout />}>
                <Route path="dashboard" element={<PatientDashboard />} />
                <Route path="appointments" element={<PatientAppointments />} />
                <Route path="prescriptions" element={<PatientPrescriptions />} />
                <Route path="bills" element={<PatientBills />} />
                <Route path="profile" element={<div className="p-4">Profile Settings (Coming Soon)</div>} />
                <Route index element={<Navigate to="dashboard" replace />} />
              </Route>
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/login" replace />} />

          </Routes>
        </BrowserRouter>
      </SocketProvider>
    </AuthProvider>
  );
}

export default App;
