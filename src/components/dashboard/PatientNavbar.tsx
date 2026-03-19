import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
    User,
    LogOut,
    ChevronDown,
    Calendar,
    Search,
    Menu,
    X
} from 'lucide-react';
import { APP_ROUTES } from '../../constants/app-routes';

import { useProfile } from '../../features/auth/hooks/useProfile';
import { useAuth } from '../../features/auth/hooks/useAuth';
import { Role } from '../../types/role.enum';
import { ConfirmationModal } from '../common/ConfirmationModal';

const PatientNavbar: React.FC = () => {
    const location = useLocation();
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const { profile } = useProfile(Role.PATIENT);
    const { logout, isLoggingOut } = useAuth();

    const navItems = [
        { name: 'Doctors', path: APP_ROUTES.PATIENT.DOCTORS, icon: Search },
        { name: 'Appointments', path: APP_ROUTES.PATIENT.APPOINTMENTS, icon: Calendar },
    ];

    const fullName = profile ? `${profile.first_name} ${profile.last_name}` : 'Loading...';

    return (
        <>
            <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-20">
                        {/* Left: Logo & Desktop Nav */}
                        <div className="flex items-center gap-8">
                            <Link to={APP_ROUTES.PATIENT.DASHBOARD} className="flex items-center gap-3 group shrink-0">
                                <div className="w-10 h-10 flex items-center justify-center group-hover:scale-105 transition-transform overflow-hidden rounded-lg">
                                    <img src="/favicon.png" alt="Niramaya" className="w-full h-full object-contain" />
                                </div>
                                <span className="text-xl font-black text-primary-900 tracking-tight hidden xs:block">Niramaya</span>
                            </Link>

                            {/* Desktop Nav */}
                            <div className="hidden md:flex items-center gap-1">
                                {navItems.map((item) => (
                                    <Link
                                        key={item.name}
                                        to={item.path}
                                        className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${(location.pathname === item.path || (item.name === 'Doctors' && location.pathname === APP_ROUTES.PATIENT.DASHBOARD))
                                            ? 'text-primary-600 bg-primary-50'
                                            : 'text-gray-500 hover:text-primary-600 hover:bg-gray-50'
                                            }`}
                                    >
                                        {item.name}
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* Right Side Actions */}
                        <div className="flex items-center gap-2 sm:gap-4">
                            {/* Profile Dropdown (Always visible on right) */}
                            <div className="relative">
                                <button
                                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                                    className="flex items-center gap-3 p-1.5 pl-3 rounded-2xl hover:bg-gray-50 transition-all border border-transparent hover:border-gray-100 group"
                                >
                                    <div className="text-right hidden sm:block">
                                        <p className="text-sm font-bold text-gray-900 leading-none">{fullName}</p>
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-1">{Role.PATIENT.toLowerCase()}</p>
                                    </div>
                                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-primary-100 flex items-center justify-center text-primary-600 group-hover:bg-primary-600 group-hover:text-white transition-all shadow-inner overflow-hidden">
                                        {profile?.profile_image ? (
                                            <img src={profile.profile_image} alt={fullName} className="w-full h-full object-cover" />
                                        ) : (
                                            <User className="w-5 h-5" />
                                        )}
                                    </div>
                                    <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform hidden sm:block ${isProfileOpen ? 'rotate-180' : ''}`} />
                                </button>

                                {/* Dropdown Menu */}
                                {isProfileOpen && (
                                    <>
                                        <div
                                            className="fixed inset-0 z-10"
                                            onClick={() => setIsProfileOpen(false)}
                                        ></div>
                                        <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-2xl shadow-gray-200/50 border border-gray-100 py-2 z-20 animate-in fade-in slide-in-from-top-2 duration-200">
                                            <div className="px-4 py-3 border-b border-gray-50 mb-1">
                                                <p className="text-sm font-bold text-gray-900">{fullName}</p>
                                                <p className="text-xs text-gray-500 mt-0.5">{profile?.email || '...'}</p>
                                            </div>
                                            <Link
                                                to={APP_ROUTES.PATIENT.PROFILE}
                                                className="flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-gray-600 hover:text-primary-600 hover:bg-primary-50/50 transition-colors"
                                                onClick={() => setIsProfileOpen(false)}
                                            >
                                                <User className="w-4 h-4" />
                                                View Profile
                                            </Link>
                                            <div className="px-2 mt-2 pt-2 border-t border-gray-50">
                                                <button
                                                    className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-bold text-red-600 hover:bg-red-50 rounded-xl transition-colors disabled:opacity-50"
                                                    onClick={() => {
                                                        setIsProfileOpen(false);
                                                        setShowLogoutModal(true);
                                                    }}
                                                    disabled={isLoggingOut}
                                                >
                                                    <LogOut className="w-4 h-4" />
                                                    {isLoggingOut ? 'Logging out...' : 'Log Out'}
                                                </button>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>

                            {/* Hamburger Menu (Mobile Only) */}
                            <button
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className="md:hidden p-2.5 rounded-xl bg-gray-50 text-gray-500 hover:text-primary-600 hover:bg-primary-50 transition-all border border-gray-100"
                            >
                                {isMenuOpen ? (
                                    <X className="w-6 h-6" />
                                ) : (
                                    <Menu className="w-6 h-6" />
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Navigation Menu */}
                {isMenuOpen && (
                    <div className="md:hidden border-t border-gray-50 bg-white animate-in slide-in-from-top-5 duration-300">
                        <div className="px-4 py-6 space-y-2">
                            {navItems.map((item) => (
                                <Link
                                    key={item.name}
                                    to={item.path}
                                    onClick={() => setIsMenuOpen(false)}
                                    className={`flex items-center gap-4 px-5 py-4 rounded-2xl text-base font-bold transition-all ${(location.pathname === item.path || (item.name === 'Doctors' && location.pathname === APP_ROUTES.PATIENT.DASHBOARD))
                                        ? 'text-primary-600 bg-primary-50'
                                        : 'text-gray-500 hover:text-primary-600 hover:bg-gray-50'
                                        }`}
                                >
                                    <item.icon className="w-5 h-5" />
                                    {item.name}
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </nav>

            {/* Logout Confirmation Modal */}
            <ConfirmationModal
                isOpen={showLogoutModal}
                onClose={() => setShowLogoutModal(false)}
                onConfirm={() => {
                    logout();
                    setShowLogoutModal(false);
                }}
                title="Confirm Logout"
                description="Are you sure you want to logout?"
                confirmText="Logout"
                cancelText="Cancel"
                variant="danger"
                iconType="logout"
                isLoading={isLoggingOut}
            />
        </>
    );
};

export default PatientNavbar;
