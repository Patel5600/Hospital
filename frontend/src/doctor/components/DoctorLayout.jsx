import { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
    Calendar,
    LogOut,
    Home,
    Menu,
    X
} from 'lucide-react';
import clsx from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';

export default function DoctorLayout() {
    const { logout, user } = useAuth();
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const navigation = [
        { name: 'Dashboard', href: '/doctor/dashboard', icon: Home },
        { name: 'My Appointments', href: '/doctor/appointments', icon: Calendar },
    ];

    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden relative">
            {/* Mobile Menu Toggle */}
            <div className="lg:hidden fixed top-4 left-4 z-50">
                <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="p-2 bg-white rounded-lg shadow-lg text-teal-600 hover:text-teal-700 focus:outline-none ring-1 ring-teal-100"
                >
                    {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </div>

            {/* Mobile Overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="fixed inset-0 bg-teal-900/40 backdrop-blur-sm z-40 lg:hidden"
                    />
                )}
            </AnimatePresence>

            {/* Sidebar */}
            <motion.div
                initial={false}
                animate={{ x: isMobileMenuOpen ? 0 : (window.innerWidth < 1024 ? -256 : 0) }}
                className="fixed lg:relative z-50 flex flex-col w-64 h-full bg-white border-r shadow-xl lg:shadow-none"
            >
                <div className="flex items-center justify-center h-16 border-b bg-teal-600 flex-shrink-0">
                    <h1 className="text-xl font-bold text-white tracking-tight">Doctor Portal</h1>
                </div>

                <div className="p-4 border-b bg-teal-50 flex-shrink-0">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <div className="w-10 h-10 bg-teal-200 rounded-full flex items-center justify-center text-teal-800 font-bold text-lg border-2 border-white shadow-sm">
                                {user?.name?.charAt(0)}
                            </div>
                        </div>
                        <div className="ml-3 overflow-hidden">
                            <p className="text-sm font-semibold text-gray-900 truncate">Dr. {user?.name}</p>
                            <p className="text-xs text-teal-600 font-medium">Online</p>
                        </div>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto py-4">
                    <nav className="px-2 space-y-1">
                        {navigation.map((item) => {
                            const Icon = item.icon;
                            const isActive = location.pathname === item.href;
                            return (
                                <Link
                                    key={item.name}
                                    to={item.href}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={clsx(
                                        'flex items-center px-4 py-2.5 text-sm font-medium rounded-xl transition-all',
                                        isActive
                                            ? 'bg-teal-50 text-teal-700 shadow-sm'
                                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                    )}
                                >
                                    <Icon className={clsx("w-5 h-5 mr-3 transition-colors", isActive ? "text-teal-600" : "text-gray-400")} />
                                    {item.name}
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                <div className="p-4 border-t bg-gray-50/50">
                    <button
                        onClick={logout}
                        className="flex items-center w-full px-4 py-2 text-sm font-medium text-red-600 rounded-xl hover:bg-red-50 transition-colors border border-transparent hover:border-red-100"
                    >
                        <LogOut className="w-5 h-5 mr-3" />
                        Logout
                    </button>
                </div>
            </motion.div>

            {/* Main Content */}
            <div className="flex-1 overflow-auto bg-gray-50 pt-16 lg:pt-0">
                <main className="p-4 md:p-8 max-w-7xl mx-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
