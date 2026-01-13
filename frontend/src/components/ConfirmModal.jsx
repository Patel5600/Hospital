import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X, Info, Trash2, CheckCircle2 } from 'lucide-react';

export default function ConfirmModal({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = 'Confirm',
    type = 'danger',
    isLoading = false
}) {
    if (!isOpen) return null;

    const getColors = () => {
        switch (type) {
            case 'danger': return {
                icon: Trash2,
                bg: 'bg-red-50',
                text: 'text-red-600',
                button: 'bg-red-600 hover:bg-red-700 shadow-red-200',
                light: 'bg-red-100'
            };
            case 'warning': return {
                icon: AlertTriangle,
                bg: 'bg-amber-50',
                text: 'text-amber-600',
                button: 'bg-amber-600 hover:bg-amber-700 shadow-amber-200',
                light: 'bg-amber-100'
            };
            case 'info': return {
                icon: Info,
                bg: 'bg-blue-50',
                text: 'text-blue-600',
                button: 'bg-blue-600 hover:bg-blue-700 shadow-blue-200',
                light: 'bg-blue-100'
            };
            case 'success': return {
                icon: CheckCircle2,
                bg: 'bg-emerald-50',
                text: 'text-emerald-600',
                button: 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200',
                light: 'bg-emerald-100'
            };
            default: return {
                icon: AlertTriangle,
                bg: 'bg-gray-50',
                text: 'text-gray-600',
                button: 'bg-gray-900 hover:bg-gray-800 shadow-gray-200',
                light: 'bg-gray-100'
            };
        }
    };

    const colors = getColors();
    const Icon = colors.icon;

    // Shake animation for danger types
    const shakeVariants = {
        shake: {
            x: [0, -10, 10, -10, 10, 0],
            transition: { duration: 0.4 }
        }
    };

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-gray-900/60 backdrop-blur-md"
                />

                {/* Modal Container */}
                <motion.div
                    variants={{
                        initial: { scale: 0.9, opacity: 0, y: 20 },
                        animate: { scale: 1, opacity: 1, y: 0 },
                        exit: { scale: 0.9, opacity: 0, y: 20 },
                        shake: {
                            x: [0, -10, 10, -10, 10, 0],
                            transition: { duration: 0.4 }
                        }
                    }}
                    initial="initial"
                    animate={isOpen && type === 'danger' ? ["animate", "shake"] : "animate"}
                    exit="exit"
                    className="relative w-full max-w-sm bg-white rounded-[2rem] shadow-2xl overflow-hidden border border-white z-10"
                >
                    <div className="p-8 text-center">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: 'spring', damping: 15, stiffness: 200, delay: 0.1 }}
                            className={`mx-auto mb-6 w-20 h-20 rounded-3xl flex items-center justify-center ${colors.light} ${colors.text} rotate-3 hover:rotate-0 transition-transform duration-300`}
                        >
                            <Icon className="w-10 h-10" />
                        </motion.div>

                        <h3 className="text-2xl font-black text-gray-900 mb-3 tracking-tight">{title}</h3>
                        <p className="text-gray-500 font-medium leading-relaxed mb-8">{message}</p>

                        <div className="grid grid-cols-2 gap-4">
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={onClose}
                                className="px-6 py-3.5 border-2 border-gray-100 rounded-2xl text-gray-600 hover:bg-gray-50 font-bold transition-all text-sm"
                            >
                                Cancel
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => { onConfirm(); !isLoading && onClose(); }}
                                disabled={isLoading}
                                className={`px-6 py-3.5 rounded-2xl text-white font-bold shadow-xl transition-all flex items-center justify-center ${colors.button} ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                            >
                                {isLoading ? (
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                        className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                                    />
                                ) : confirmText}
                            </motion.button>
                        </div>
                    </div>

                    {/* Decorative bottom bar */}
                    <div className={`h-2 w-full ${colors.bg}`} />
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
