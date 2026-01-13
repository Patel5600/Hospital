import { motion } from 'framer-motion';
import CountUp from 'react-countup';

const StatCard = ({ title, value, icon: Icon, color, delay }) => {
    // Extract number from value string if possible (e.g. '$1500' -> 1500)
    const numericValue = typeof value === 'string' ? parseFloat(value.replace(/[^0-9.-]+/g, "")) : value;
    const prefix = typeof value === 'string' && value.includes('$') ? '$' : '';
    const isNumber = !isNaN(numericValue);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: delay }}
            whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)" }}
            className="relative overflow-hidden bg-white/80 backdrop-blur-md p-6 rounded-2xl shadow-sm border border-gray-100 group"
        >
            <div className={`absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity duration-300 ${color.text}`}>
                <Icon className="w-24 h-24 transform translate-x-4 -translate-y-4" />
            </div>

            <div className="flex items-center relative z-10">
                <div className={`p-3 rounded-2xl ${color.bg} ${color.text} shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-6 h-6" />
                </div>
                <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500 tracking-wide uppercase">{title}</p>
                    <div className="text-3xl font-bold text-gray-900 mt-1">
                        {isNumber ? (
                            <CountUp end={numericValue} duration={2} prefix={prefix} separator="," />
                        ) : (
                            value
                        )}
                    </div>
                </div>
            </div>

            {/* Decorative pulse line */}
            <div className={`absolute bottom-0 left-0 h-1 w-full ${color.bg} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left`} />
        </motion.div>
    );
};

export default StatCard;
