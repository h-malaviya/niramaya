import React, { useState, useEffect, useCallback } from 'react';
import {
    Calendar,
    Search,
    ChevronDown,
    History,
    Clock,
    CalendarDays,
    ArrowUpDown,
    Timer
} from 'lucide-react';
import { format, subDays } from 'date-fns';
import { appointmentService } from '../services/appointment.service';
import { IAppointment, IGetAppointmentsQuery, AppointmentStatus, DoctorAppointmentTabs } from '../../../types/appointment.types';
import AppointmentCard from '../../../components/appointments/AppointmentCard';
import AppointmentModal from '../../../components/appointments/AppointmentModal';
import Pagination from '../../../components/common/Pagination';
import { cn } from '../../../lib/utils';
import DoctorLayout from '../../../components/layouts/DoctorLayout';
import { Role } from '../../../types/role.enum';
import SEO from '../../../components/common/SEO';
import { toast } from 'react-hot-toast';

const TABS = [
    { id: DoctorAppointmentTabs.ONGOING, label: 'Ongoing', icon: Clock },
    { id: DoctorAppointmentTabs.SCHEDULED, label: 'Scheduled', icon: CalendarDays },
    { id: DoctorAppointmentTabs.HISTORY, label: 'History', icon: History },
];

const DoctorAppointments: React.FC = () => {
    const [activeTab, setActiveTab] = useState<string>(DoctorAppointmentTabs.ONGOING);
    const [appointments, setAppointments] = useState<IAppointment[]>([]);
    const [pagination, setPagination] = useState({ current_page: 1, total_pages: 1 });
    const [loading, setLoading] = useState(true);
    const [timeLeft, setTimeLeft] = useState<string>('00:00');
    const [isOngoingTimerComplete, setIsOngoingTimerComplete] = useState(false);

    // Filters
    const [fromDate, setFromDate] = useState<string>('');
    const [toDate, setToDate] = useState<string>('');
    const [sortBy, setSortBy] = useState<'nearest' | 'farthest'>('nearest');

    // Modal
    const [selectedAppointment, setSelectedAppointment] = useState<IAppointment | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchAppointments = useCallback(async (page = 1) => {
        setLoading(true);
        try {
            const params: IGetAppointmentsQuery = {
                page,
                limit: 4,
                tab: activeTab,
                sort_by: sortBy
            };

            if (fromDate) params.from = fromDate;
            if (toDate) params.to = toDate;

            const response = await appointmentService.getAppointments(params);
            if (response.success && response.data) {
                setAppointments(response.data.appointments);
                setPagination({
                    current_page: response.data.pagination.current_page,
                    total_pages: response.data.pagination.total_pages
                });
            }
        } catch (error) {
            console.error("Failed to fetch appointments:", error);
        } finally {
            setLoading(false);
        }
    }, [activeTab, fromDate, toDate, sortBy]);

    useEffect(() => {
        fetchAppointments(1);
    }, [fetchAppointments]);

    const handleTabChange = (tabId: string) => {
        setActiveTab(tabId);
        setFromDate('');
        setToDate('');
        setSortBy('nearest');
        setTimeLeft('00:00');
        setIsOngoingTimerComplete(false);
    };

    // Timer Logic for Ongoing Session
    useEffect(() => {
        let interval: any;

        if (activeTab === DoctorAppointmentTabs.ONGOING && appointments.length > 0 && !loading) {
            const firstApp = appointments[0];
            const end = new Date(firstApp.end_time.replace('Z', ''));

            interval = setInterval(() => {
                const now = new Date();
                const diff = end.getTime() - now.getTime();

                if (diff <= 0) {
                    setTimeLeft('00:00');
                    if (!isOngoingTimerComplete) {
                        setIsOngoingTimerComplete(true);
                        fetchAppointments(1); // Refresh to move to history/next
                    }
                    clearInterval(interval);
                } else {
                    const minutes = Math.floor(diff / 60000);
                    const seconds = Math.floor((diff % 60000) / 1000);
                    setTimeLeft(`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
                }
            }, 1000);
        }

        return () => clearInterval(interval);
    }, [activeTab, appointments, loading, isOngoingTimerComplete, fetchAppointments]);

    const handleAppointmentClick = (appointment: IAppointment) => {
        setSelectedAppointment(appointment);
        setIsModalOpen(true);
    };

    // For date constraints
    const today = format(new Date(), 'yyyy-MM-dd');
    const yesterday = format(subDays(new Date(), 1), 'yyyy-MM-dd');

    return (
        <DoctorLayout>
            <SEO title="My Appointments — Niramaya" description="Review and manage your daily scheduled appointments and patient consultations." />
            <div className="space-y-8">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-2">My Appointments</h1>
                        <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Manage your daily schedule and patients</p>
                    </div>

                    {/* Role Badge */}
                    <div className="flex items-center gap-2 bg-primary-50 px-4 py-2 rounded-2xl border border-primary-100">
                        <div className="w-2 h-2 rounded-full bg-primary-600 animate-pulse" />
                        <span className="text-[10px] font-black text-primary-600 uppercase tracking-wider">Doctor Access</span>
                    </div>
                </div>

                {/* Main Tabs Container */}
                <div className="bg-white rounded-[40px] border border-gray-100 shadow-xl shadow-gray-200/50 overflow-hidden">
                    {/* Tabs Navigation - Scrollable on mobile */}
                    <div className="overflow-x-auto md:no-scrollbar">
                        <div className="flex items-center border-b border-gray-50 px-8 min-w-max">
                            {TABS.map((tab) => {
                                const Icon = tab.icon;
                                const isActive = activeTab === tab.id;
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => handleTabChange(tab.id)}
                                        className={cn(
                                            "relative flex items-center gap-2 px-6 py-6 transition-all group",
                                            isActive ? "text-primary-600" : "text-gray-400 hover:text-gray-600"
                                        )}
                                    >
                                        <Icon className={cn("w-4 h-4 transition-transform group-hover:scale-110", isActive && "scale-110")} />
                                        <span className="text-xs font-black uppercase tracking-widest">{tab.label}</span>
                                        {isActive && (
                                            <div className="absolute bottom-0 left-6 right-6 h-1 bg-primary-600 rounded-t-full shadow-[0_-4px_12px_rgba(37,99,235,0.4)]" />
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Filters Section */}
                    {activeTab !== DoctorAppointmentTabs.ONGOING && (
                        <div className="p-8 pb-0 flex flex-col sm:flex-row flex-wrap items-center gap-6">
                            <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto justify-center sm:justify-start">
                                <div className="flex flex-col gap-1.5 w-full xs:w-auto flex-1 xs:flex-none">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-tight ml-1">From Date</label>
                                    <div className="relative">
                                        <input
                                            type="date"
                                            value={fromDate}
                                            min={activeTab === DoctorAppointmentTabs.SCHEDULED ? today : undefined}
                                            max={activeTab === DoctorAppointmentTabs.HISTORY ? yesterday : undefined}
                                            onChange={(e) => {
                                                const newFrom = e.target.value;
                                                setFromDate(newFrom);
                                                if (toDate && newFrom > toDate) {
                                                    setToDate('');
                                                }
                                            }}
                                            className="h-12 w-full xs:w-40 pl-10 pr-4 rounded-2xl bg-gray-50 border-none text-[11px] font-bold text-gray-700 focus:ring-2 focus:ring-primary-100 transition-all cursor-pointer"
                                        />
                                        <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                                    </div>
                                </div>

                                <div className="hidden xs:block h-px w-3 bg-gray-200 mt-6" />

                                <div className="flex flex-col gap-1.5 w-full xs:w-auto flex-1 xs:flex-none">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-tight ml-1">To Date</label>
                                    <div className="relative">
                                        <input
                                            type="date"
                                            value={toDate}
                                            min={fromDate || (activeTab === DoctorAppointmentTabs.SCHEDULED ? today : undefined)}
                                            max={activeTab === DoctorAppointmentTabs.HISTORY ? yesterday : undefined}
                                            onChange={(e) => {
                                                const newTo = e.target.value;
                                                if (fromDate && newTo < fromDate) {
                                                    toast.error("To date cannot be earlier than from date");
                                                    return;
                                                }
                                                setToDate(newTo);
                                            }}
                                            className="h-12 w-full xs:w-40 pl-10 pr-4 rounded-2xl bg-gray-50 border-none text-[11px] font-bold text-gray-700 focus:ring-2 focus:ring-primary-100 transition-all cursor-pointer"
                                        />
                                        <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col gap-1.5 w-full sm:w-auto sm:ml-auto items-center sm:items-start">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-tight ml-1">Sort By</label>
                                <div className="relative w-full sm:min-w-[160px]">
                                    <select
                                        value={sortBy}
                                        onChange={(e) => setSortBy(e.target.value as any)}
                                        className="h-12 w-full pl-10 pr-10 rounded-2xl bg-gray-50 border-none text-xs font-bold text-gray-700 appearance-none focus:ring-2 focus:ring-primary-100 transition-all cursor-pointer"
                                    >
                                        {activeTab === DoctorAppointmentTabs.HISTORY ? (
                                            <>
                                                <option value="nearest">Latest First</option>
                                                <option value="farthest">Oldest First</option>
                                            </>
                                        ) : (
                                            <>
                                                <option value="nearest">Nearest First</option>
                                                <option value="farthest">Farthest First</option>
                                            </>
                                        )}
                                    </select>
                                    <ArrowUpDown className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                                    <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                                </div>
                            </div>

                            {(fromDate || toDate) && (
                                <button
                                    onClick={() => { setFromDate(''); setToDate(''); }}
                                    className="text-[10px] font-black text-primary-600 uppercase hover:text-primary-700 px-2 py-1 sm:mt-6"
                                >
                                    Clear Filters
                                </button>
                            )}
                        </div>
                    )}

                    {/* Content Area */}
                    <div className="p-8">
                        {loading ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 animate-pulse">
                                {[1, 2, 3, 4].map(i => (
                                    <div key={i} className="h-48 bg-gray-50 rounded-3xl" />
                                ))}
                            </div>
                        ) : appointments.length > 0 ? (
                            <>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mb-10">
                                    {appointments.map((app, index) => {
                                        const isOngoingTab = activeTab === DoctorAppointmentTabs.ONGOING;
                                        const enhancedApp = isOngoingTab
                                            ? { ...app, status: AppointmentStatus.ONGOING }
                                            : app;

                                        return (
                                            <div key={app.id} className="relative">
                                                <AppointmentCard
                                                    appointment={enhancedApp}
                                                    role={Role.DOCTOR}
                                                    onClick={() => handleAppointmentClick(enhancedApp)}
                                                />
                                                {isOngoingTab && index === 0 && (
                                                    <div className="absolute top-4 right-4 animate-pulse">
                                                        <div className="w-2.5 h-2.5 rounded-full bg-green-500 shadow-lg shadow-green-200" />
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>

                                <Pagination
                                    currentPage={pagination.current_page}
                                    totalPages={pagination.total_pages}
                                    onPageChange={(page) => fetchAppointments(page)}
                                />
                            </>
                        ) : (
                            <div className="py-20 flex flex-col items-center justify-center text-center">
                                <div className="w-20 h-20 rounded-full bg-gray-50 flex items-center justify-center mb-6">
                                    <Search className="w-8 h-8 text-gray-200" />
                                </div>
                                <h3 className="text-xl font-black text-gray-900 mb-2">No Appointments Found</h3>
                                <p className="text-sm font-bold text-gray-400 max-w-xs">We couldn't find any appointments for this category or filter range.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Status Bar for Ongoing */}
                {activeTab === DoctorAppointmentTabs.ONGOING && appointments.length > 0 && (
                    <div className="fixed sm:bottom-10 sm:right-10 bottom-4 left-4 right-4 sm:left-auto z-50 animate-in slide-in-from-right-10 duration-500">
                        <div className="bg-gray-900 text-white rounded-[24px] sm:rounded-[32px] px-4 sm:px-8 py-3 sm:py-5 shadow-2xl flex items-center justify-between sm:justify-start gap-3 sm:gap-6 border border-white/10 backdrop-blur-md">
                            <div className="flex items-center gap-3 sm:gap-4 sm:pr-6 sm:border-r border-white/10 overflow-hidden">
                                <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-primary-600 flex-shrink-0 flex items-center justify-center shadow-lg shadow-primary-500/20">
                                    <Clock className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-[8px] sm:text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5 truncate">Active Session</p>
                                    <p className="text-xs sm:text-sm font-black text-white truncate">
                                        #{appointments[0].queue_token} • {appointments[0].patient_name}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 sm:gap-5 flex-shrink-0">
                                <div className="flex flex-col items-end">
                                    <p className="text-[8px] sm:text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5 whitespace-nowrap">Time Remaining</p>
                                    <div className="flex items-center gap-1.5 sm:gap-2">
                                        <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-primary-500 animate-pulse" />
                                        <span className="text-sm sm:text-xl font-black font-mono tracking-tighter">{timeLeft}</span>
                                    </div>
                                </div>
                                <button className="w-9 h-9 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-white text-gray-900 flex items-center justify-center hover:bg-primary-50 transition-all shadow-xl active:scale-95 group">
                                    <Timer className="w-4 h-4 sm:w-5 sm:h-5 group-hover:rotate-12 transition-transform" />
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <AppointmentModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                appointment={selectedAppointment}
                role={Role.DOCTOR}
            />
        </DoctorLayout>
    );
};

export default DoctorAppointments;
