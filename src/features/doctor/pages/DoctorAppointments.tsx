import React, { useState } from 'react';
import DoctorLayout from '../../../components/layouts/DoctorLayout';
import {
    Calendar,
    Search,
    Filter
} from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';

const DoctorAppointments: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'ongoing' | 'scheduled' | 'history'>('ongoing');


    return (
        <DoctorLayout>
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Appointments</h1>
                        <p className="text-gray-500 mt-1">Manage and track your patient visits</p>
                    </div>
                    <Button className="gap-2" size="lg">
                        <Calendar className="w-5 h-5" />
                        New Appointment
                    </Button>
                </div>

                {/* Tabs & Filters */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-2 rounded-2xl border border-gray-100 shadow-sm">
                    <div className="flex p-1 bg-gray-50 rounded-xl gap-1">
                        <button
                            onClick={() => setActiveTab('ongoing')}
                            className={`flex-1 sm:flex-none px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'ongoing'
                                ? 'bg-white text-primary-600 shadow-sm'
                                : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            Ongoing
                        </button>
                        <button
                            onClick={() => setActiveTab('scheduled')}
                            className={`flex-1 sm:flex-none px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'scheduled'
                                ? 'bg-white text-primary-600 shadow-sm'
                                : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            Scheduled
                        </button>
                        <button
                            onClick={() => setActiveTab('history')}
                            className={`flex-1 sm:flex-none px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'history'
                                ? 'bg-white text-primary-600 shadow-sm'
                                : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            History
                        </button>
                    </div>

                    <div className="flex items-center gap-3 px-2">
                        <div className="flex-1 sm:w-64">
                            <Input
                                placeholder="Search patients..."
                                icon={<Search className="w-4 h-4" />}
                                iconPosition="left"
                                className="!h-10"
                            />
                        </div>
                        <Button variant="ghost" size="sm" className="p-2 text-gray-500 border border-transparent hover:border-gray-100">
                            <Filter className="w-5 h-5" />
                        </Button>
                    </div>
                </div>

                {/* Coming Soon Message */}
                <div className="bg-white rounded-3xl border border-dashed border-gray-200 p-24 text-center">
                    <div className="w-24 h-24 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
                        <Calendar className="w-12 h-12 text-primary-500" />
                    </div>
                    <h2 className="text-3xl font-black text-gray-900 mb-3">Doctor Appointment Coming Soon</h2>
                    <p className="text-gray-500 text-lg font-medium max-w-xl mx-auto leading-relaxed">
                        Manage your patient consultations, scheduling, and history in one place. This feature is currently under final testing.
                    </p>
                </div>
            </div>
        </DoctorLayout>
    );
};


export default DoctorAppointments;
