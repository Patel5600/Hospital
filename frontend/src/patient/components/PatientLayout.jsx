import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
    Home,
    Calendar,
    FileText,
    CreditCard,
    User,
    LogOut
} from 'lucide-react';
import clsx from 'clsx';

export default function PatientLayout() {
    const { logout, user } = useAuth();
    const location = useLocation();

    const navigation = [
        { name: 'Dashboard', href: '/patient/dashboard', icon: Home },
        { name: 'My Appointments', href: '/patient/appointments', icon: Calendar },
        { name: 'Prescriptions', href: '/patient/prescriptions', icon: FileText },
        { name: 'Bills', href: '/patient/bills', icon: CreditCard },
        { name: 'Profile', href: '/patient/profile', icon: User },
    ];

    return (
        <div className="flex h-screen bg-gray-50">
            {/* Mobile-first bottom nav could be added, but side nav for now */}
            <div className="hidden md:flex flex-col w-64 bg-white border-r border-gray-200">
                <div className="flex items-center justify-center h-16 border-b border-gray-200 bg-sky-600">
                    <h1 className="text-xl font-bold text-white tracking-wider">My Health</h1>
                </div>

                <div className="p-4 border-b bg-sky-50">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <div className="w-10 h-10 bg-sky-200 rounded-full flex items-center justify-center text-sky-800 font-bold text-lg">
                                {user?.name?.charAt(0)}
                            </div>
                        </div>
                        <div className="ml-3">
                            <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                            <p className="text-xs text-gray-500">Patient</p>
                        </div>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto py-4">
                    <nav className="px-2 space-y-1">
                        {navigation.map((item) => {
                            const Icon = item.icon;
                            return (
                                <Link
                                    key={item.name}
                                    to={item.href}
                                    className={clsx(
                                        'flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors',
                                        location.pathname === item.href
                                            ? 'bg-sky-100 text-sky-700'
                                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                    )}
                                >
                                    <Icon className="w-5 h-5 mr-3" />
                                    {item.name}
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                <div className="p-4 border-t">
                    <button
                        onClick={logout}
                        className="flex items-center w-full px-4 py-2 text-sm text-red-600 rounded-md hover:bg-red-50 transition-colors"
                    >
                        <LogOut className="w-5 h-5 mr-3" />
                        Logout
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-auto bg-gray-50 pb-20 md:pb-0">
                <main className="p-4 md:p-8 max-w-7xl mx-auto">
                    <Outlet />
                </main>
            </div>

            {/* Mobile Bottom Nav */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around p-2 z-10">
                {navigation.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.href;
                    return (
                        <Link
                            key={item.name}
                            to={item.href}
                            className={`flex flex-col items-center p-2 rounded-md ${isActive ? 'text-sky-600' : 'text-gray-500'}`}
                        >
                            <Icon className="w-6 h-6" />
                            <span className="text-xs mt-1">{item.name}</span>
                        </Link>
                    )
                })}
                <button onClick={logout} className="flex flex-col items-center p-2 text-red-500">
                    <LogOut className="w-6 h-6" />
                    <span className="text-xs mt-1">Logout</span>
                </button>
            </div>
        </div>
    );
}
