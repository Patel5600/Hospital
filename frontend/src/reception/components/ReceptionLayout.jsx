import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
    LayoutDashboard,
    Users,
    Calendar,
    CreditCard,
    LogOut
} from 'lucide-react';
import clsx from 'clsx';

export default function ReceptionLayout() {
    const { logout, user } = useAuth();
    const location = useLocation();

    const navigation = [
        { name: 'Dashboard', href: '/reception/dashboard', icon: LayoutDashboard },
        { name: 'Patients', href: '/reception/patients', icon: Users },
        { name: 'Appointments', href: '/reception/appointments', icon: Calendar },
        { name: 'Billing', href: '/reception/billing', icon: CreditCard },
    ];

    return (
        <div className="flex h-screen bg-gray-50">
            {/* Sidebar */}
            <div className="flex flex-col w-64 bg-white border-r border-gray-200">
                <div className="flex items-center justify-center h-16 border-b border-gray-200 bg-purple-600">
                    <h1 className="text-xl font-bold text-white tracking-wider">Reception</h1>
                </div>

                <div className="p-4 border-b bg-purple-50">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <div className="w-10 h-10 bg-purple-200 rounded-full flex items-center justify-center text-purple-800 font-bold text-lg">
                                {user?.name?.charAt(0)}
                            </div>
                        </div>
                        <div className="ml-3">
                            <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                            <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
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
                                            ? 'bg-purple-100 text-purple-700'
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

            {/* Main Content */}
            <div className="flex-1 overflow-auto bg-gray-50">
                <main className="p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
