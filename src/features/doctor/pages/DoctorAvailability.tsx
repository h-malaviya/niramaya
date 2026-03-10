import React from 'react';
import DoctorLayout from '../../../components/layouts/DoctorLayout';
import { Save, CalendarDays } from 'lucide-react';
import { Button } from '../../../components/ui/Button';

const DoctorAvailability: React.FC = () => {

    return (
        <DoctorLayout>
            <div className="space-y-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Availability</h1>
                        <p className="text-gray-500 mt-1">Configure your working hours and booking slots</p>
                    </div>
                    <Button className="gap-2">
                        <Save className="w-5 h-5" />
                        Save Changes
                    </Button>
                </div>

                {/* Coming Soon Message */}
                <div className="bg-white rounded-3xl border border-dashed border-gray-200 p-32 text-center">
                    <div className="w-24 h-24 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
                        <CalendarDays className="w-12 h-12 text-primary-500" />
                    </div>
                    <h2 className="text-3xl font-black text-gray-900 mb-3">Doctor Availability Coming Soon</h2>
                    <p className="text-gray-500 text-lg font-medium max-w-xl mx-auto leading-relaxed">
                        Setting your working days and consultation slots will be available soon. You'll be able to manage your schedule with precision.
                    </p>
                </div>
            </div>
        </DoctorLayout>
    );
};

export default DoctorAvailability;
