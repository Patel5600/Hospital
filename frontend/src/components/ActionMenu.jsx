import { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MoreVertical } from 'lucide-react';

export default function ActionMenu({ actions, align = 'right' }) {
    const [isOpen, setIsOpen] = useState(false);
    const [coords, setCoords] = useState({ top: 0, left: 0, placement: 'bottom' });
    const menuRef = useRef(null);
    const buttonRef = useRef(null);

    const closeMenu = useCallback(() => setIsOpen(false), []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target) &&
                buttonRef.current && !buttonRef.current.contains(event.target)) {
                closeMenu();
            }
        };
        const handleEscape = (e) => { if (e.key === 'Escape') closeMenu(); };
        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
            document.addEventListener("keydown", handleEscape);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleEscape);
        };
    }, [isOpen, closeMenu]);

    const toggleMenu = (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (!isOpen) {
            const rect = e.currentTarget.getBoundingClientRect();
            const spaceBelow = window.innerHeight - rect.bottom;
            const spaceAbove = rect.top;

            let placement = 'bottom';
            if (spaceBelow < 280 && spaceAbove > spaceBelow) {
                placement = 'top';
            }

            // Adjust horizontal position to avoid sticking to screen edges
            let left = align === 'right' ? rect.right : rect.left;

            setCoords({
                top: placement === 'bottom' ? (rect.bottom + window.scrollY + 5) : (rect.top + window.scrollY - 5),
                left: left,
                placement
            });
        }
        setIsOpen(!isOpen);
    };

    const menuContent = (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    ref={menuRef}
                    initial={{
                        opacity: 0,
                        scale: 0.9,
                        y: coords.placement === 'bottom' ? -10 : 10,
                        transformOrigin: `${align === 'right' ? 'right' : 'left'} ${coords.placement === 'bottom' ? 'top' : 'bottom'}`
                    }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: coords.placement === 'bottom' ? -10 : 10 }}
                    transition={{ duration: 0.2, ease: "circOut" }}
                    className={`absolute z-[99999] w-56 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-100 overflow-hidden py-1.5
                        ${align === 'right' ? '-translate-x-full' : ''}
                        ${coords.placement === 'top' ? '-translate-y-full' : ''}
                    `}
                    style={{
                        top: coords.top,
                        left: coords.left,
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
                    }}
                >
                    {actions.map((action, index) => {
                        const Icon = action.icon;
                        const isDanger = action.variant === 'danger';

                        return (
                            <button
                                key={index}
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    action.onClick();
                                    closeMenu();
                                }}
                                className={`w-full text-left px-4 py-3 text-[13px] font-bold flex items-center justify-between transition-all group
                                    ${isDanger
                                        ? 'text-red-500 hover:bg-red-50'
                                        : 'text-slate-600 hover:bg-slate-50 hover:text-blue-600'}
                                    ${action.disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}
                                `}
                                disabled={action.disabled}
                            >
                                <div className="flex items-center space-x-3">
                                    <div className={`p-1.5 rounded-lg transition-colors 
                                        ${isDanger ? 'bg-red-50 group-hover:bg-red-100/50' : 'bg-slate-50 group-hover:bg-blue-50'}
                                    `}>
                                        {Icon && <Icon className={`w-4 h-4 ${isDanger ? 'text-red-500' : 'text-slate-400 group-hover:text-blue-500'}`} />}
                                    </div>
                                    <span className="tracking-tight">{action.label}</span>
                                </div>
                            </button>
                        );
                    })}
                </motion.div>
            )}
        </AnimatePresence>
    );

    return (
        <div className="relative inline-block text-left">
            <button
                ref={buttonRef}
                onClick={toggleMenu}
                className={`p-2 rounded-full transition-all duration-200 outline-none
                    ${isOpen ? 'bg-slate-100 text-slate-900 shadow-inner' : 'hover:bg-slate-50 text-slate-400 hover:text-slate-600'}
                `}
            >
                <MoreVertical className="w-5 h-5 pointer-events-none" />
            </button>

            {createPortal(menuContent, document.body)}
        </div>
    );
}
