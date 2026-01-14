import { useState } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    Users,
    Calendar,
    LayoutDashboard,
    FileText,
    LogOut,
    Stethoscope,
    Receipt,
    Activity,
    Menu,
    X,
    ChevronRight
} from 'lucide-react';
import clsx from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';

export default function Layout() {
    const { logout, user } = useAuth();
    const location = useLocation();
    const [sidebarOpen, setSidebarOpen] = useState(true);

    const navigation = [
        { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
        { name: 'Doctors', href: '/doctors', icon: Stethoscope },
        { name: 'Patients', href: '/patients', icon: Users },
        { name: 'Appointments', href: '/appointments', icon: Calendar },
        { name: 'Finance', href: '/billing', icon: Receipt },
        { name: 'Reports', href: '/reports', icon: FileText },
    ];

    const pageVariants = {
        initial: { opacity: 0, scale: 0.98, y: 10 },
        in: { opacity: 1, scale: 1, y: 0 },
        out: { opacity: 0, scale: 1, y: -10 }
    };

    const pageTransition = {
        type: "tween",
        ease: "anticipate",
        duration: 0.4
    };

    return (
        <div className="flex h-screen bg-slate-50 overflow-hidden relative">
            {/* Mobile Menu Toggle */}
            <div className="lg:hidden fixed top-4 left-4 z-50">
                <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="p-2 bg-white rounded-lg shadow-lg text-slate-600 hover:text-blue-600 focus:outline-none ring-1 ring-slate-200"
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
                        className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden"
                    />
                )}
            </AnimatePresence>

            {/* Sidebar */}
            <motion.div
                animate={{
                    width: sidebarOpen ? 260 : 80,
                    x: isMobileMenuOpen ? 0 : (window.innerWidth < 1024 ? -260 : 0)
                }}
                transition={{ type: "spring", damping: 20, stiffness: 100 }}
                className={clsx(
                    "bg-white border-r border-gray-200 flex flex-col z-50 shadow-xl fixed lg:relative h-full",
                    !sidebarOpen && "lg:w-20"
                )}
                layout
            >
                {/* Logo Header */}
                <div className="flex items-center h-20 px-6 border-b border-gray-100 bg-white">
                    <motion.div
                        whileHover={{ rotate: 90 }}
                        className="p-1 rounded bg-blue-50 text-blue-600"
                    >
                        <Activity className="w-8 h-8 flex-shrink-0" />
                    </motion.div>

                    {(sidebarOpen || isMobileMenuOpen) && (
                        <motion.h1
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="text-xl font-bold ml-3 text-slate-800 tracking-tight"
                        >
                            Medi<span className="text-blue-600">Care</span>
                        </motion.h1>
                    )}
                </div>

                {/* Nav Links */}
                <div className="flex-1 overflow-y-auto py-6 px-3 custom-scrollbar">
                    <nav className="space-y-1">
                        {navigation.map((item) => {
                            const Icon = item.icon;
                            const isActive = location.pathname === item.href;
                            return (
                                <Link
                                    key={item.name}
                                    to={item.href}
                                    className="block"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    <motion.div
                                        className={clsx(
                                            'flex items-center px-3 py-3 rounded-xl transition-all duration-200 group relative',
                                            isActive
                                                ? 'bg-blue-50 text-blue-600 shadow-sm'
                                                : 'text-slate-500 hover:bg-gray-50 hover:text-slate-900'
                                        )}
                                        whileHover={{ x: 5, backgroundColor: isActive ? '#eff6ff' : '#f9fafb' }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <Icon className={clsx("w-6 h-6 flex-shrink-0", isActive ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600')} />

                                        {(sidebarOpen || isMobileMenuOpen) && (
                                            <motion.span
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                className="ml-3 font-medium text-sm flex-1"
                                            >
                                                {item.name}
                                            </motion.span>
                                        )}

                                        {(sidebarOpen || isMobileMenuOpen) && isActive && (
                                            <motion.div layoutId="active-pill" className="w-1.5 h-1.5 rounded-full bg-blue-600 ml-auto" />
                                        )}

                                        {/* Tooltip for collapsed state */}
                                        {!sidebarOpen && !isMobileMenuOpen && (
                                            <div className="absolute left-14 hidden group-hover:block bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap z-50 shadow-lg">
                                                {item.name}
                                            </div>
                                        )}
                                    </motion.div>
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                {/* User Footer */}
                <div className="p-4 border-t border-gray-100 bg-gray-50/50">
                    <motion.div
                        className={clsx("flex items-center mb-4 transition-all", (sidebarOpen || isMobileMenuOpen) ? "justify-start" : "justify-center")}
                        whileHover={{ scale: 1.02 }}
                    >
                        <div className="w-10 h-10 bg-gradient-to-tr from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold shadow-md ring-2 ring-white cursor-pointer">
                            {user?.name?.charAt(0)}
                        </div>
                        {(sidebarOpen || isMobileMenuOpen) && (
                            <div className="ml-3 overflow-hidden">
                                <p className="text-sm font-semibold text-slate-800 truncate">{user?.name}</p>
                                <p className="text-xs text-slate-500 capitalize truncate">{user?.role}</p>
                            </div>
                        )}
                    </motion.div>

                    <motion.button
                        onClick={logout}
                        whileHover={{ scale: 1.02, backgroundColor: '#FEF2F2' }}
                        whileTap={{ scale: 0.95 }}
                        className={clsx(
                            "flex items-center w-full rounded-lg transition-colors text-red-600",
                            (sidebarOpen || isMobileMenuOpen) ? "px-4 py-2 bg-white border border-red-100 shadow-sm" : "p-2 justify-center"
                        )}
                    >
                        <LogOut className="w-4 h-4 flex-shrink-0" />
                        {(sidebarOpen || isMobileMenuOpen) && <span className="ml-3 text-sm font-medium">Logout</span>}
                    </motion.button>
                </div>

                {/* Collapse Toggle (Desktop only) */}
                <button
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className="hidden lg:flex absolute -right-3 top-24 bg-white border border-gray-200 rounded-full p-1 shadow-sm hover:shadow-md transition text-gray-500 hover:text-blue-600 z-50 transform hover:scale-110"
                >
                    {sidebarOpen ? <X className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                </button>
            </motion.div>

            {/* Main Content Area with Transitions */}
            <div className="flex-1 overflow-auto bg-slate-50 relative pt-16 lg:pt-0">
                <AnimatePresence mode="wait">
                    <motion.main
                        key={location.pathname}
                        initial="initial"
                        animate="in"
                        exit="out"
                        variants={pageVariants}
                        transition={pageTransition}
                        className="p-4 md:p-8 max-w-[1600px] mx-auto min-h-full"
                    >
                        <Outlet />
                    </motion.main>
                </AnimatePresence>
            </div>
        </div>
    );
}
