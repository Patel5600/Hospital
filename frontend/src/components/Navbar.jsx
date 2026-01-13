import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../services';

const Navbar = () => {
    const navigate = useNavigate();
    const user = authService.getCurrentUser();

    const handleLogout = () => {
        authService.logout();
        navigate('/login');
    };

    return (
        <nav className="bg-white shadow-lg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link to="/" className="flex items-center">
                            <svg className="h-8 w-8 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                            </svg>
                            <span className="ml-2 text-xl font-bold text-gray-900">Hospital MS</span>
                        </Link>
                    </div>

                    <div className="flex items-center space-x-4">
                        {user && (
                            <>
                                <Link to="/dashboard" className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium">
                                    Dashboard
                                </Link>

                                {(user.role === 'admin' || user.role === 'receptionist') && (
                                    <Link to="/patients" className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium">
                                        Patients
                                    </Link>
                                )}

                                {user.role === 'admin' && (
                                    <Link to="/doctors" className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium">
                                        Doctors
                                    </Link>
                                )}

                                <Link to="/appointments" className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium">
                                    Appointments
                                </Link>

                                {user.role === 'doctor' && (
                                    <Link to="/prescriptions" className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium">
                                        Prescriptions
                                    </Link>
                                )}

                                {(user.role === 'admin' || user.role === 'receptionist') && (
                                    <Link to="/bills" className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium">
                                        Bills
                                    </Link>
                                )}

                                <div className="flex items-center space-x-3 ml-4 pl-4 border-l border-gray-300">
                                    <div className="text-sm">
                                        <p className="font-medium text-gray-900">{user.name}</p>
                                        <p className="text-gray-500 capitalize">{user.role}</p>
                                    </div>
                                    <button
                                        onClick={handleLogout}
                                        className="btn-secondary text-sm"
                                    >
                                        Logout
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
