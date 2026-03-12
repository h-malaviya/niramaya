import React, { useMemo } from 'react';
import { cn } from '../../../lib/utils';
import { IDoctorAvailability } from '../types/availability.types';
import { Calendar as CalendarIcon, CheckCircle2, XCircle } from 'lucide-react';

interface AvailabilityCalendarProps {
    availabilities: IDoctorAvailability[];
    selectedDates: string[]; // YYYY-MM-DD
    onDateToggle: (date: string) => void;
    loading?: boolean;
}

const AvailabilityCalendar: React.FC<AvailabilityCalendarProps> = ({
    availabilities,
    selectedDates,
    onDateToggle,
    loading = false
}) => {
    // Generate next 30 days starting from today in IST
    const days = useMemo(() => {
        const result = [];
        const now = new Date();

        // Calculate current date in IST
        // IST is UTC + 5:30
        const istOffset = 5.5 * 60 * 60 * 1000;

        for (let i = 0; i < 30; i++) {
            const dateObj = new Date(now.getTime() + istOffset + (i * 24 * 60 * 60 * 1000));

            // Get YYYY-MM-DD from the UTC values of this offsetted Date object
            const y = dateObj.getUTCFullYear();
            const m = String(dateObj.getUTCMonth() + 1).padStart(2, '0');
            const d = String(dateObj.getUTCDate()).padStart(2, '0');
            const dateStr = `${y}-${m}-${d}`;

            const availability = availabilities.find(a => a.date === dateStr);
            const isSelected = selectedDates.includes(dateStr);

            result.push({
                dateStr,
                dayName: dateObj.toLocaleDateString('en-US', { weekday: 'short', timeZone: 'UTC' }),
                dayNum: dateObj.getUTCDate(),
                monthName: dateObj.toLocaleDateString('en-US', { month: 'short', timeZone: 'UTC' }),
                availability,
                isSelected
            });
        }
        return result;
    }, [availabilities, selectedDates]);

    if (loading) {
        return (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-3 animate-pulse">
                {[...Array(30)].map((_, i) => (
                    <div key={i} className="h-24 bg-gray-100 rounded-2xl border border-gray-50" />
                ))}
            </div>
        );
    }

    return (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-primary-50 rounded-xl">
                    <CalendarIcon className="w-5 h-5 text-primary-600" />
                </div>
                <div>
                    <h3 className="font-bold text-gray-900">30-Day Schedule</h3>
                    <p className="text-xs text-gray-500 font-medium">Select one or more dates to manage availability</p>
                </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                {days.map((day) => {
                    const isActive = day.availability?.is_active ?? false;
                    const hasData = !!day.availability;

                    return (
                        <button
                            key={day.dateStr}
                            onClick={() => onDateToggle(day.dateStr)}
                            className={cn(
                                "relative flex flex-col items-center justify-center p-3 rounded-2xl border-2 transition-all duration-200 group",
                                day.isSelected
                                    ? "bg-primary-600 border-primary-600 text-white shadow-lg shadow-primary-200"
                                    : "bg-white border-gray-50 hover:border-primary-100 hover:bg-primary-50/30"
                            )}
                        >
                            <span className={cn(
                                "text-[10px] font-black uppercase tracking-widest leading-none mb-1",
                                day.isSelected ? "text-primary-100" : "text-gray-400"
                            )}>
                                {day.monthName}
                            </span>
                            <span className="text-xl font-black mb-0.5 leading-none">{day.dayNum}</span>
                            <span className={cn(
                                "text-[10px] font-bold uppercase tracking-tight",
                                day.isSelected ? "text-primary-100" : "text-gray-500"
                            )}>
                                {day.dayName}
                            </span>

                            {/* Status Indicators */}
                            <div className="absolute top-2 right-2">
                                {hasData ? (
                                    isActive ? (
                                        <CheckCircle2 className={cn("w-3 h-3", day.isSelected ? "text-primary-200" : "text-green-500")} />
                                    ) : (
                                        <XCircle className={cn("w-3 h-3", day.isSelected ? "text-primary-300" : "text-gray-300")} />
                                    )
                                ) : null}
                            </div>

                            {/* Slot Count Badge */}
                            {isActive && day.availability?.total_slots !== undefined && (
                                <div className={cn(
                                    "mt-2 px-1.5 py-0.5 rounded-lg text-[8px] font-black",
                                    day.isSelected ? "bg-white/20 text-white" : "bg-primary-50 text-primary-700"
                                )}>
                                    {day.availability.total_slots} SLOTS
                                </div>
                            )}

                            {!hasData && (
                                <div className="mt-2 px-1.5 py-0.5 rounded-lg text-[8px] font-black bg-gray-100 text-gray-400">
                                    PENDING
                                </div>
                            )}
                        </button>
                    );
                })}
            </div>

            <div className="mt-6 flex flex-wrap gap-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest pt-6 border-t border-gray-50">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                    <span>Available</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-gray-200" />
                    <span>Unavailable</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-primary-600" />
                    <span>Selected</span>
                </div>
            </div>
        </div>
    );
};

export default AvailabilityCalendar;
