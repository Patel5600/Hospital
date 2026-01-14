import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Activity, Lock, Mail, ArrowRight, Loader2, Stethoscope } from 'lucide-react';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        // Simulated network delay for effect
        setTimeout(async () => {
            const success = await login(email, password);
            setIsLoading(false);
            if (success) {
                navigate('/dashboard');
            } else {
                setError('Invalid credentials.');
            }
        }, 800);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#f0f9ff] p-4 relative overflow-hidden">
            {/* Ambient Background Blobs */}
            <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-blue-400/20 rounded-full blur-[100px]" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-emerald-400/20 rounded-full blur-[100px]" />

            {/* Main Glass Card (Split Layout) */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="w-full max-w-5xl h-[600px] bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row border border-white/50 relative z-10"
            >

                {/* LEFT SIDE: Visual/Illustration */}
                <div className="hidden md:flex flex-1 relative bg-gradient-to-br from-blue-600 to-emerald-600 items-center justify-center p-12 text-white overflow-hidden">
                    {/* Abstract Overlay Shapes */}
                    <div className="absolute inset-0 bg-blue-600/10" />
                    <motion.div
                        className="absolute w-[500px] h-[500px] border border-white/10 rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                    />
                    <motion.div
                        className="absolute w-[300px] h-[300px] border border-white/20 rounded-full"
                        animate={{ rotate: -360 }}
                        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                    />

                    {/* Content */}
                    <div className="relative z-10 text-center">
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="w-24 h-24 bg-white/15 backdrop-blur-md rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-inner border border-white/20"
                        >
                            <Activity className="w-12 h-12 text-white" />
                        </motion.div>
                        <motion.h2
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.4 }}
                            className="text-4xl font-bold mb-4 tracking-tight"
                        >
                            Medi<span className="text-white">Care</span>
                        </motion.h2>
                        <motion.p
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            className="text-blue-50 font-light leading-relaxed max-w-sm mx-auto text-lg"
                        >
                            Advanced healthcare management. <br /> secure. efficient. trusted.
                        </motion.p>
                    </div>
                </div>

                {/* RIGHT SIDE: Login Form */}
                <div className="flex-1 flex flex-col justify-center p-8 md:p-12 relative bg-white/40">
                    <div className="max-w-sm mx-auto w-full">
                        <div className="mb-10">
                            <h3 className="text-2xl font-bold text-gray-800 mb-2">Welcome Back</h3>
                            <p className="text-gray-500 text-sm">Enter your credentials to access the secure admin panel.</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2 group">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-3.5 w-5 h-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                                    <input
                                        type="email"
                                        required
                                        className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm group-hover:border-blue-300"
                                        placeholder="example@gmail.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2 group">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-3.5 w-5 h-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                                    <input
                                        type="password"
                                        required
                                        className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm group-hover:border-blue-300"
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>
                            </div>

                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    className="text-red-600 text-sm flex items-center bg-red-50 p-3 rounded-lg border border-red-100"
                                >
                                    <Activity className="w-4 h-4 mr-2" />
                                    {error}
                                </motion.div>
                            )}

                            <motion.button
                                type="submit"
                                disabled={isLoading}
                                whileHover={{ scale: 1.02, boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.4)" }}
                                whileTap={{ scale: 0.98 }}
                                className="w-full py-4 bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 text-white font-bold rounded-xl shadow-lg transition-all flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {isLoading ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    <>
                                        Sign In to Dashboard <ArrowRight className="w-5 h-5 ml-2" />
                                    </>
                                )}
                            </motion.button>
                        </form>

                        <div className="mt-8 text-center flex flex-col items-center">
                            <div className="w-full h-px bg-gray-200 mb-4" />
                            <p className="text-gray-400 text-xs flex items-center">
                                <Lock className="w-3 h-3 mr-1" /> 256-bit Secure Encryption
                            </p>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
