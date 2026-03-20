import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { APP_ROUTES } from '../../constants/app-routes';
import { useAuth } from '../../features/auth/hooks/useAuth';
import { ConfirmationModal } from '../common/ConfirmationModal';
import {
    LayoutDashboard,
    CalendarDays,
    Clock,
    LogOut,
    X,
    User
} from 'lucide-react';

interface SidebarProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen }) => {
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const navItems = [
        { name: 'Analytics', path: APP_ROUTES.DOCTOR.DASHBOARD, icon: LayoutDashboard },
        { name: 'Appointments', path: APP_ROUTES.DOCTOR.APPOINTMENTS, icon: CalendarDays },
        { name: 'Availability', path: APP_ROUTES.DOCTOR.AVAILABILITY, icon: Clock },
        { name: 'Profile', path: APP_ROUTES.DOCTOR.PROFILE, icon: User },
    ];
    const { logout, isLoggingOut } = useAuth();

    return (
        <>
            {/* Mobile Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsOpen(false)}
                        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
                    />
                )}
            </AnimatePresence>

            {/* Sidebar Drawer */}
            <aside className={`
                fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-gray-100 flex flex-col transition-transform duration-300 ease-in-out
                lg:w-64 lg:translate-x-0
                ${isOpen ? 'translate-x-0 shadow-2xl lg:shadow-none' : '-translate-x-full lg:translate-x-0'}
            `}>
                <div className="p-6 border-b border-gray-50 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 flex items-center justify-center overflow-hidden rounded-lg">
                            <img src="/favicon.png" alt="Niramaya" className="w-full h-full object-contain" />
                        </div>
                        <span className="text-xl font-black text-primary-900 tracking-tight">Niramaya</span>
                    </div>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="lg:hidden p-2 text-gray-400 hover:bg-gray-50 rounded-lg"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.name}
                            to={item.path}
                            onClick={() => setIsOpen(false)}
                            className={({ isActive }) => `
                                flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
                                ${isActive
                                    ? 'bg-primary-600 text-white shadow-md shadow-primary-100'
                                    : 'text-gray-500 hover:bg-gray-50 hover:text-primary-600'}
                            `}
                        >
                            <item.icon className="w-5 h-5 flex-shrink-0" />
                            <span className="font-medium">{item.name}</span>
                        </NavLink>
                    ))}
                </nav>

                <div className="p-4 border-t border-gray-50">
                    <button
                        onClick={() => setShowLogoutModal(true)}
                        disabled={isLoggingOut}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 transition-all duration-200 disabled:opacity-50"
                    >
                        <LogOut className="w-5 h-5 flex-shrink-0" />
                        <span className="font-medium">{isLoggingOut ? 'Logging out...' : 'Logout'}</span>
                    </button>
                </div>
            </aside>

            {/* Logout Confirmation Modal */}
            <ConfirmationModal
                isOpen={showLogoutModal}
                onClose={() => setShowLogoutModal(false)}
                onConfirm={() => {
                    logout();
                    setShowLogoutModal(false);
                }}
                title="Confirm Logout"
                description="Are you sure you want to logout? You will need to sign in again to access your account."
                confirmText="Logout"
                cancelText="Keep me logged in"
                variant="danger"
                iconType="logout"
                isLoading={isLoggingOut}
            />
        </>
    );
};

export default Sidebar;
