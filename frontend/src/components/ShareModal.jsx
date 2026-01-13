import { motion, AnimatePresence } from 'framer-motion';
import { X, Copy, Share2, MessageCircle, Facebook, Send, Mail, Instagram } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ShareModal({ isOpen, onClose, data }) {
    if (!isOpen) return null;

    const shareUrl = data?.url || window.location.href;
    const shareText = data?.text || "Check out this record from MediCare Hospital Management System";
    const title = data?.title || "Share Record";

    const shareLinks = [
        {
            name: 'WhatsApp',
            icon: MessageCircle,
            color: 'bg-green-500',
            onClick: () => window.open(`https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`, '_blank')
        },
        {
            name: 'Facebook',
            icon: Facebook,
            color: 'bg-blue-600',
            onClick: () => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank')
        },
        {
            name: 'Telegram',
            icon: Send,
            color: 'bg-sky-500',
            onClick: () => window.open(`https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`, '_blank')
        },
        {
            name: 'Email',
            icon: Mail,
            color: 'bg-gray-600',
            onClick: () => window.open(`mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(shareText + '\n\n' + shareUrl)}`, '_blank')
        },
        {
            name: 'Instagram',
            icon: Instagram,
            color: 'bg-pink-600',
            onClick: () => {
                navigator.clipboard.writeText(shareUrl);
                toast.success('Link copied! Share it on your Instagram Story or Bio.');
            }
        }
    ];

    const copyToClipboard = () => {
        navigator.clipboard.writeText(shareUrl);
        toast.success('Link copied to clipboard!');
    };

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                />

                <motion.div
                    initial={{ y: 100, opacity: 0, scale: 0.95 }}
                    animate={{ y: 0, opacity: 1, scale: 1 }}
                    exit={{ y: 100, opacity: 0, scale: 0.95 }}
                    transition={{ type: "spring", damping: 25, stiffness: 300 }}
                    className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden z-10 p-6"
                >
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                            <Share2 className="w-5 h-5 text-blue-600" />
                            {title}
                        </h3>
                        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                            <X className="w-5 h-5 text-gray-500" />
                        </button>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mb-8">
                        {shareLinks.map((platform) => (
                            <motion.button
                                key={platform.name}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={platform.onClick}
                                className="flex flex-col items-center gap-2"
                            >
                                <div className={`w-12 h-12 ${platform.color} rounded-2xl flex items-center justify-center text-white shadow-lg hover:shadow-xl hover:glow transition-all`}>
                                    <platform.icon className="w-6 h-6" />
                                </div>
                                <span className="text-xs font-medium text-gray-600">{platform.name}</span>
                            </motion.button>
                        ))}

                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={copyToClipboard}
                            className="flex flex-col items-center gap-2"
                        >
                            <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center text-gray-600 shadow-sm hover:bg-gray-200 transition-all">
                                <Copy className="w-6 h-6" />
                            </div>
                            <span className="text-xs font-medium text-gray-600">Copy Link</span>
                        </motion.button>
                    </div>

                    <div className="bg-gray-50 p-3 rounded-2xl border border-gray-100 flex items-center justify-between group">
                        <span className="text-xs text-gray-400 truncate mr-4 italic">
                            {shareUrl.length > 30 ? shareUrl.substring(0, 30) + '...' : shareUrl}
                        </span>
                        <button
                            onClick={copyToClipboard}
                            className="text-[10px] font-bold uppercase tracking-wider text-blue-600 hover:text-blue-700"
                        >
                            Copy
                        </button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
