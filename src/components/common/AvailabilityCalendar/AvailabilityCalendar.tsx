import React, { useState, useMemo } from 'react';
import { cn } from '../../../lib/utils';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { AvailabilityCalendarProps } from './types';
import { Role } from '../../../types/role.enum';

const AvailabilityCalendar: React.FC<AvailabilityCalendarProps> = ({
    availabilities,
    selectedDates,
    onDatesChange,
    mode,
    loading = false
}) => {
    const [viewDate, setViewDate] = useState(new Date());

    const handleDateClick = (date: string) => {
        if (mode === Role.DOCTOR) {
            // Toggling logic for doctors (Multiple Selection)
            const newDates = selectedDates.includes(date)
                ? selectedDates.filter(d => d !== date)
                : [...selectedDates, date];
            onDatesChange(newDates);
        } else {
            // Single selection for patients
            onDatesChange([date]);
        }
    };

    const { calendarDays, monthLabel } = useMemo(() => {
        const year = viewDate.getFullYear();
        const month = viewDate.getMonth();

        const firstDayOfMonth = new Date(year, month, 1);
        const lastDayOfMonth = new Date(year, month + 1, 0);

        const startPadding = firstDayOfMonth.getDay(); // 0 is Sunday
        const totalDays = lastDayOfMonth.getDate();

        const days = [];

        // IST Reference for 30-day window
        const now = new Date();
        const istOffset = 5.5 * 60 * 60 * 1000;
        const todayUtc = new Date(now.getTime() + istOffset);
        todayUtc.setUTCHours(0, 0, 0, 0);
        const maxDateUtc = new Date(todayUtc.getTime() + 29 * 24 * 60 * 60 * 1000);

        // Grid padding
        for (let i = 0; i < startPadding; i++) {
            days.push(null);
        }

        // Days of the month
        for (let d = 1; d <= totalDays; d++) {
            const dateObj = new Date(year, month, d);
            const dateStr = `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, '0')}-${String(dateObj.getDate()).padStart(2, '0')}`;

            const currentDayUtc = new Date(Date.UTC(year, month, d, 0, 0, 0, 0));
            const isToday = currentDayUtc.getTime() === todayUtc.getTime();
            const isInRange = currentDayUtc >= todayUtc && currentDayUtc <= maxDateUtc;

            const availability = availabilities.find(a => a.date === dateStr);
            const isSelected = selectedDates.includes(dateStr);

            days.push({
                dateStr,
                dayNum: d,
                isToday,
                isInRange,
                availability,
                isSelected
            });
        }

        return {
            calendarDays: days,
            monthLabel: viewDate.toLocaleString('default', { month: 'long', year: 'numeric' })
        };
    }, [viewDate, availabilities, selectedDates]);

    const changeMonth = (offset: number) => {
        setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + offset, 1));
    };

    if (loading) {
        return (
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 animate-pulse">
                <div className="h-8 w-48 bg-gray-100 rounded-lg mb-6" />
                <div className="grid grid-cols-7 gap-2">
                    {[...Array(35)].map((_, i) => (
                        <div key={i} className="h-16 bg-gray-50 rounded-xl" />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
            {/* Header: month nav — always visible */}
            <div className="flex items-center justify-between mb-6 shrink-0">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary-50 rounded-xl">
                        <CalendarIcon className="w-5 h-5 text-primary-600" />
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-900">{monthLabel}</h3>
                        <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest leading-none mt-0.5">30-Day Window</p>
                    </div>
                </div>
                <div className="flex items-center gap-1">
                    <button onClick={() => changeMonth(-1)} className="p-2 hover:bg-gray-50 rounded-lg transition-colors text-gray-400">
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button onClick={() => changeMonth(1)} className="p-2 hover:bg-gray-50 rounded-lg transition-colors text-gray-400">
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Day-of-week headers — always visible */}
            <div className="grid grid-cols-7 gap-1 mb-2 shrink-0">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                    <div key={d} className="text-center py-2">
                        <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">{d}</span>
                    </div>
                ))}
            </div>

            {/* Date grid — no scroll, no fixed height, natural size */}
            <div>
                <div className="grid grid-cols-7 gap-1.5 pb-2">
                    {calendarDays.map((day, idx) => {
                        if (!day) return <div key={`empty-${idx}`} className="aspect-square sm:aspect-auto sm:h-20" />;

                        const isActive = day.availability?.is_active ?? false;
                        const hasData = !!day.availability;
                        const isUnselectable = mode === Role.PATIENT && hasData && !isActive;

                        return (
                            <button
                                key={day.dateStr}
                                disabled={!day.isInRange || isUnselectable}
                                onClick={() => handleDateClick(day.dateStr)}
                                className={cn(
                                    "relative flex flex-col items-center justify-center aspect-square sm:aspect-auto sm:h-20 rounded-none sm:rounded-2xl border-2 transition-all duration-200",
                                    day.isSelected
                                        ? "bg-primary-600 border-primary-600 text-white shadow-md ring-2 ring-offset-1 ring-primary-400"
                                        : !day.isInRange
                                            ? "bg-gray-50/50 border-transparent text-gray-300 cursor-not-allowed"
                                            : isUnselectable
                                                ? "bg-red-50/50 border-red-100/50 text-red-300 cursor-not-allowed"
                                                : "bg-white border-gray-50 hover:border-primary-100 hover:bg-primary-50/30"
                                )}
                            >
                                <span className={cn(
                                    "text-sm font-black mb-1",
                                    day.isToday && !day.isSelected && "text-primary-600 underline underline-offset-4 decoration-2"
                                )}>
                                    {day.dayNum}
                                </span>

                                {day.isInRange && (
                                    <div className="flex gap-1">
                                        {hasData ? (
                                            isActive ? (
                                                <div className={cn("w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full", day.isSelected ? "bg-primary-200" : "bg-green-500")} />
                                            ) : (
                                                <div className={cn("w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full", day.isSelected ? "bg-white/40" : "bg-red-400")} />
                                            )
                                        ) : (
                                            <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-orange-200 animate-pulse" />
                                        )}
                                    </div>
                                )}

                                {/* Slot count / unavailable text — hidden on mobile, shown on sm+ */}
                                {day.isInRange && (
                                    <div className="hidden sm:block mt-1 text-[7px] sm:text-[8px] font-black uppercase tracking-tighter">
                                        {isActive ? (
                                            <span className={day.isSelected ? "text-primary-100" : "text-primary-600"}>
                                                {mode === Role.DOCTOR ? (day.availability?.total_slots ?? 0) : (day.availability?.available_slots ?? 0)} Slots
                                            </span>
                                        ) : hasData && !isActive ? (
                                            <span className={day.isSelected ? "text-primary-200" : "text-red-400"}>
                                                {mode === Role.PATIENT ? 'Unavailable' : 'OFF'}
                                            </span>
                                        ) : !hasData ? (
                                            <span className="text-orange-400">N/A</span>
                                        ) : null}
                                    </div>
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Legend — always at bottom */}
            <div className="mt-4 flex flex-wrap gap-x-4 gap-y-3 pt-4 border-t border-gray-100">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                    <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Active</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-gray-200" />
                    <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Inactive</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary-600" />
                    <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Selected</span>
                </div>
                {mode === Role.DOCTOR && (
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-orange-200" />
                        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Pending</span>
                    </div>
                )}
                {mode === Role.PATIENT && (
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-red-400" />
                        <span className="text-[9px] font-bold text-red-400 uppercase tracking-widest">Unavailable</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AvailabilityCalendar;
