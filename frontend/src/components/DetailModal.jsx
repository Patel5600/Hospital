import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Phone, Mail, Calendar, Droplets, MapPin, Hash, Activity } from 'lucide-react';

export default function DetailModal({ isOpen, onClose, type, data }) {
    if (!isOpen || !data) return null;

    const isPatient = type === 'patient';
    const isDoctor = type === 'doctor';

    // Map data for easy display
    const details = {
        name: data.user?.name || data.name,
        email: data.user?.email || data.email,
        phone: data.user?.phone || data.phone,
        specialization: data.specialization,
        experience: data.experience,
        fee: data.consultationFee,
        dob: data.dateOfBirth,
        gender: data.gender,
        blood: data.bloodGroup,
        id: data.patientId || data.doctorId || 'N/A',
        address: data.address ? `${data.address.street}, ${data.address.city}, ${data.address.state} ${data.address.zipCode}` : 'N/A'
    };

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
                />

                <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    className="relative w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden z-10"
                >
                    {/* Header Banner */}
                    <div className={`h-32 bg-gradient-to-r ${isPatient ? 'from-purple-600 to-indigo-600' : 'from-blue-600 to-emerald-600'} relative`}>
                        <button
                            onClick={onClose}
                            className="absolute top-6 right-6 p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors text-white"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Profile Header */}
                    <div className="px-8 pb-8 -mt-16">
                        <div className="flex flex-col md:flex-row items-end gap-6 mb-8">
                            <div className="w-32 h-32 rounded-3xl bg-white p-2 shadow-xl border border-gray-50 overflow-hidden">
                                <div className={`w-full h-full rounded-2xl flex items-center justify-center text-4xl font-black text-white ${isPatient ? 'bg-purple-600' : 'bg-blue-600'}`}>
                                    {details.name?.charAt(0)}
                                </div>
                            </div>
                            <div className="flex-1 pb-4">
                                <h2 className="text-3xl font-black text-slate-900 tracking-tight">{details.name}</h2>
                                <p className="text-slate-500 font-medium flex items-center gap-2">
                                    <span className={`px-2 py-0.5 rounded-md text-[10px] uppercase font-bold tracking-widest text-white ${isPatient ? 'bg-purple-500' : 'bg-blue-500'}`}>
                                        {type}
                                    </span>
                                    • ID: {details.id}
                                </p>
                            </div>
                        </div>

                        {/* Details Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                            <div className="space-y-6">
                                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-2">Contact Information</h3>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-4 group">
                                        <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center group-hover:bg-blue-50 transition-colors">
                                            <Mail className="w-5 h-5 text-slate-400 group-hover:text-blue-500" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Email Address</p>
                                            <p className="text-sm font-bold text-slate-700">{details.email}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 group">
                                        <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center group-hover:bg-blue-50 transition-colors">
                                            <Phone className="w-5 h-5 text-slate-400 group-hover:text-blue-500" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Phone Number</p>
                                            <p className="text-sm font-bold text-slate-700">{details.phone}</p>
                                        </div>
                                    </div>
                                    {isPatient && (
                                        <div className="flex items-center gap-4 group">
                                            <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center group-hover:bg-blue-50 transition-colors">
                                                <MapPin className="w-5 h-5 text-slate-400 group-hover:text-blue-500" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Address</p>
                                                <p className="text-sm font-bold text-slate-700 line-clamp-1">{details.address}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-6">
                                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-2">Professional Stats</h3>
                                <div className="space-y-4">
                                    {isDoctor ? (
                                        <>
                                            <div className="flex items-center gap-4 group">
                                                <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center group-hover:bg-blue-50 transition-colors">
                                                    <Activity className="w-5 h-5 text-slate-400 group-hover:text-blue-500" />
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Specialization</p>
                                                    <p className="text-sm font-bold text-slate-700">{details.specialization}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4 group">
                                                <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center group-hover:bg-blue-50 transition-colors">
                                                    <Hash className="w-5 h-5 text-slate-400 group-hover:text-blue-500" />
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Consultation Fee</p>
                                                    <p className="text-sm font-bold text-slate-700">${details.fee}</p>
                                                </div>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <div className="flex items-center gap-4 group">
                                                <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center group-hover:bg-blue-50 transition-colors">
                                                    <Calendar className="w-5 h-5 text-slate-400 group-hover:text-blue-500" />
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Gender / DOB</p>
                                                    <p className="text-sm font-bold text-slate-700 capitalize">{details.gender} • {details.dob ? new Date(details.dob).toLocaleDateString() : 'N/A'}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4 group">
                                                <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center group-hover:bg-blue-50 transition-colors">
                                                    <Droplets className="w-5 h-5 text-slate-400 group-hover:text-blue-500" />
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Blood Group</p>
                                                    <p className="text-sm font-bold text-slate-700 text-red-600 uppercase">{details.blood}</p>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="mt-12 flex justify-end">
                            <button
                                onClick={onClose}
                                className="px-8 py-3 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-colors text-sm"
                            >
                                Close Details
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
