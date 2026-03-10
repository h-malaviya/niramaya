import React, { useState } from 'react';
import PatientLayout from '../../../components/layouts/PatientLayout';
import { Calendar, Search, Filter } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';

const PatientAppointments: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');

    return (
        <PatientLayout>
            <div className="space-y-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-black text-gray-900">My Appointments</h1>
                        <p className="text-gray-500 font-medium mt-1">Keep track of your consultations and medical visits</p>
                    </div>
                    <div className="flex gap-3">
                        <div className="relative group sm:w-64">
                            <Input
                                placeholder="Search by doctor..."
                                icon={<Search className="w-4 h-4" />}
                                className="!h-11"
                            />
                        </div>
                        <Button variant="ghost" className="h-11 border border-gray-100">
                            <Filter className="w-4 h-4" />
                        </Button>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex p-1.5 bg-gray-100/50 rounded-2xl w-fit">
                    {[
                        { id: 'upcoming', label: 'Upcoming' },
                        { id: 'past', label: 'Past History' }
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`px-8 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === tab.id
                                ? 'bg-white text-primary-600 shadow-sm'
                                : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Coming Soon Message */}
                <div className="bg-white rounded-3xl border border-dashed border-gray-200 p-20 text-center">
                    <div className="w-20 h-20 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Calendar className="w-10 h-10 text-primary-500" />
                    </div>
                    <h2 className="text-2xl font-black text-gray-900 mb-2">Patient Appointment Coming Soon</h2>
                    <p className="text-gray-500 font-medium max-w-md mx-auto">
                        Your appointment history and upcoming sessions will be visible here once the booking system is live.
                    </p>
                </div>
            </div>
        </PatientLayout>
    );
};

export default PatientAppointments;
