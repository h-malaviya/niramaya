import React from 'react';
import DoctorLayout from '../../../components/layouts/DoctorLayout';
import { TrendingUp } from 'lucide-react';
import { useProfile } from '../../auth/hooks/useProfile';
import { Role } from '../../../types/role.enum';

const DoctorDashboard: React.FC = () => {
    const { profile } = useProfile(Role.DOCTOR);
    const doctorName = profile ? `${profile.first_name} ${profile.last_name}` : '...';

    return (
        <DoctorLayout>
            <div className="space-y-8">
                {/* Welcome Section */}
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Welcome back, Dr. {doctorName}! 👋</h1>
                    <p className="text-gray-500 mt-1">Here's what's happening with your practice today.</p>
                </div>

                {/* Coming Soon Message */}
                <div className="bg-white rounded-3xl border border-dashed border-gray-200 p-32 text-center">
                    <div className="w-24 h-24 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-8">
                        <TrendingUp className="w-12 h-12 text-primary-500" />
                    </div>
                    <h2 className="text-3xl font-black text-gray-900 mb-3">Dashboard Analytics Coming Soon</h2>
                    <p className="text-gray-500 text-lg font-medium max-w-xl mx-auto leading-relaxed">
                        Detailed insights into your practice, patient growth, and revenue reports are being prepared for you. Stay tuned!
                    </p>
                </div>
            </div>
        </DoctorLayout>
    );
};

export default DoctorDashboard;
