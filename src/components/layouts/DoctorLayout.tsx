import React, { useState } from 'react';
import Sidebar from '../dashboard/Sidebar';
import { Menu, User } from 'lucide-react';

interface DoctorLayoutProps {
    children: React.ReactNode;
}

import { useProfile } from '../../features/auth/hooks/useProfile';
import { Role } from '../../types/role.enum';

const DoctorLayout: React.FC<DoctorLayoutProps> = ({ children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const { profile } = useProfile(Role.DOCTOR);

    const doctorName = profile ? `Dr. ${profile.first_name} ${profile.last_name}` : 'Loading...';
    const specialty = profile?.doctor_profile?.specialties?.[0]?.replace(/_/g, " ") || 'Specialist';

    return (
        <div className="flex min-h-screen bg-gray-50/50 lg:pl-64">
            <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Dashboard Header */}
                <header className="h-20 bg-white/80 backdrop-blur-md border-b border-gray-100 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-30">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setIsSidebarOpen(true)}
                            className="lg:hidden p-2 text-gray-600 hover:bg-gray-50 rounded-lg"
                        >
                            <Menu className="w-6 h-6" />
                        </button>
                    </div>

                    <div className="flex items-center gap-3 lg:gap-6">

                        <div className="h-10 w-px bg-gray-100 hidden sm:block"></div>

                        <div className="flex items-center gap-3 pl-2 group cursor-pointer">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-bold text-gray-900 group-hover:text-primary-600 transition-colors capitalize">{doctorName}</p>
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{specialty}</p>
                            </div>
                            <div className="w-10 h-10 rounded-xl bg-primary-100 flex items-center justify-center text-primary-600 group-hover:bg-primary-600 group-hover:text-white transition-all overflow-hidden shadow-inner">
                                {profile?.profile_image ? (
                                    <img src={profile.profile_image} alt={doctorName} className="w-full h-full object-cover" />
                                ) : (
                                    <User className="w-5 h-5" />
                                )}
                            </div>
                        </div>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-4 lg:px-8 lg:pt-0 lg:pb-8">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default DoctorLayout;
