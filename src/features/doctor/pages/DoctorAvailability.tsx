import React, { useState } from 'react';
import DoctorLayout from '../../../components/layouts/DoctorLayout';
import { CalendarDays, Loader2, Info, AlertCircle } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { availabilityService } from '../services/availability.service';
import AvailabilityCalendar from '../../../components/common/AvailabilityCalendar/AvailabilityCalendar';
import AvailabilityForm from '../components/AvailabilityForm';
import { toast } from 'react-hot-toast';
import { getErrorMessage } from '../../../utils/api-error';
import { getRoleFromToken } from '../../auth/utils/auth.utils';
import { Role } from '../../../types/role.enum';
import SEO from '../../../components/common/SEO';

const DoctorAvailability: React.FC = () => {
    const queryClient = useQueryClient();
    const [selectedDates, setSelectedDates] = useState<string[]>([]);

    // Fetch availability
    const { data, isLoading, error } = useQuery({
        queryKey: ['doctor-availability'],
        queryFn: availabilityService.getAvailability
    });

    const availabilities = data?.data?.availabilities || [];
    const userRole = getRoleFromToken() as Role;
    const calendarMode = userRole === Role.PATIENT ? Role.PATIENT : Role.DOCTOR;

    // Update availability mutation
    const updateMutation = useMutation({
        mutationFn: availabilityService.updateAvailability,
        onSuccess: (res) => {
            if (res.success) {
                toast.success('Availability updated successfully');
                setSelectedDates([]);
                queryClient.invalidateQueries({ queryKey: ['doctor-availability'] });
            } else {
                toast.error(res.message || 'Failed to update availability');
            }
        },
        onError: (err) => {
            toast.error(getErrorMessage(err));
        }
    });


    return (
        <DoctorLayout>
            <SEO title="Manage Availability — Niramaya" description="Configure your working hours and consultation slots for patient bookings." />
            <div className="space-y-8 pb-20">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Schedule & Availability</h1>
                        <p className="text-gray-500 font-medium mt-1">Configure your working hours and consultation slots for the next 30 days</p>
                    </div>
                </div>

                <div className="bg-primary-50 rounded-2xl p-6 border border-primary-100 flex items-start gap-4">
                    <div className="p-2 bg-white rounded-xl shadow-sm">
                        <Info className="w-5 h-5 text-primary-600" />
                    </div>
                    <div className="space-y-1">
                        <p className="text-sm font-bold text-primary-900">Configuring IST Timings</p>
                        <p className="text-xs text-primary-700 leading-relaxed font-medium">
                            All times below are in **Indian Standard Time (IST)**.
                        </p>
                    </div>
                </div>

                {error ? (
                    <div className="bg-red-50 border border-red-100 rounded-3xl p-10 text-center space-y-4">
                        <div className="p-4 bg-white w-fit mx-auto rounded-2xl shadow-sm">
                            <AlertCircle className="w-8 h-8 text-red-500" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900">Failed to load schedule</h3>
                        <p className="text-red-600 text-sm max-w-md mx-auto">{getErrorMessage(error)}</p>
                        <button
                            onClick={() => queryClient.invalidateQueries({ queryKey: ['doctor-availability'] })}
                            className="btn bg-red-600 hover:bg-red-700 text-white border-none rounded-xl px-8"
                        >
                            Try Again
                        </button>
                    </div>
                ) : (
                    <div className="flex flex-col xl:flex-row gap-8 items-start">
                        {/* Calendar Section */}
                        <div className="flex-1 w-full space-y-6">
                            <AvailabilityCalendar
                                availabilities={availabilities}
                                selectedDates={selectedDates}
                                onDatesChange={setSelectedDates}
                                loading={isLoading}
                                mode={calendarMode}
                            />

                            {!selectedDates.length && (
                                <div className="bg-white rounded-3xl border border-dashed border-gray-200 p-12 text-center space-y-4">
                                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto text-gray-400">
                                        <CalendarDays className="w-8 h-8" />
                                    </div>
                                    <p className="text-sm font-medium text-gray-500">
                                        Select one or more dates from the calendar to modify your availability.
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Form Section */}
                        {selectedDates.length > 0 && (
                            <div className="w-full xl:w-96 shrink-0 sticky top-28">
                                <AvailabilityForm
                                    selectedDates={selectedDates}
                                    availabilities={availabilities}
                                    onSave={(payload) => updateMutation.mutate(payload)}
                                    onCancel={() => setSelectedDates([])}
                                    isSaving={updateMutation.isPending}
                                />
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Loading Overlay */}
            {isLoading && !data && (
                <div className="fixed inset-0 z-[100] bg-white/60 backdrop-blur-sm flex items-center justify-center">
                    <div className="flex flex-col items-center gap-4">
                        <Loader2 className="w-10 h-10 text-primary-600 animate-spin" />
                        <p className="text-sm font-bold text-gray-600">Loading your schedule...</p>
                    </div>
                </div>
            )}
        </DoctorLayout>
    );
};

export default DoctorAvailability;
