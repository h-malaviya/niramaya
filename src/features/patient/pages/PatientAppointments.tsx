import React, { useState, useEffect, useCallback } from 'react';
import {
    CalendarDays,
    Calendar,
    ChevronDown,
    History,
    CreditCard,
    ArrowUpDown,
    Star,
    MessageSquare,
    X
} from 'lucide-react';
import { format, subDays } from 'date-fns';
import { appointmentService } from '../services/appointment.service';
import { ratingService } from '../services/rating.service';
import { IAppointment, AppointmentStatus, IGetAppointmentsQuery, PatientAppointmentTabs } from '../../../types/appointment.types';
import { ICreateRatingRequest } from '../../../types/rating.types';
import AppointmentCard from '../../../components/appointments/AppointmentCard';
import AppointmentModal from '../../../components/appointments/AppointmentModal';
import Pagination from '../../../components/common/Pagination';
import { cn } from '../../../lib/utils';
import { Role } from '../../../types/role.enum';
import { toast } from 'react-hot-toast';
import SEO from '../../../components/common/SEO';

const TABS = [
    { id: PatientAppointmentTabs.SCHEDULED, label: 'Scheduled', icon: CalendarDays },
    { id: PatientAppointmentTabs.PENDING_PAYMENT, label: 'Pending Payment', icon: CreditCard },
    { id: PatientAppointmentTabs.HISTORY, label: 'History', icon: History },
];

const PatientAppointments: React.FC = () => {
    const [activeTab, setActiveTab] = useState<string>(PatientAppointmentTabs.SCHEDULED);
    const [appointments, setAppointments] = useState<IAppointment[]>([]);
    const [pagination, setPagination] = useState({ current_page: 1, total_pages: 1 });
    const [loading, setLoading] = useState(true);

    // Filters
    const [fromDate, setFromDate] = useState<string>('');
    const [toDate, setToDate] = useState<string>('');
    const [historyStatus, setHistoryStatus] = useState<AppointmentStatus[]>([]);
    const [sortBy, setSortBy] = useState<'nearest' | 'farthest'>('nearest');

    // Modals
    const [selectedAppointment, setSelectedAppointment] = useState<IAppointment | null>(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
    const [reviewRating, setReviewRating] = useState(0);
    const [reviewText, setReviewText] = useState('');
    const [isSubmittingReview, setIsSubmittingReview] = useState(false);
    const [reviewError, setReviewError] = useState('');

    const fetchAppointments = useCallback(async (page = 1) => {
        setLoading(true);
        try {
            const params: IGetAppointmentsQuery = {
                page,
                limit: 4,
                tab: activeTab,
                sort_by: sortBy
            };

            if (activeTab === PatientAppointmentTabs.SCHEDULED) {
                if (fromDate) params.from = fromDate;
                if (toDate) params.to = toDate;
            }

            if (activeTab === PatientAppointmentTabs.HISTORY && historyStatus.length > 0) {
                params.status = historyStatus;
            }

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
    }, [activeTab, fromDate, toDate, historyStatus, sortBy]);

    useEffect(() => {
        fetchAppointments(1);
    }, [fetchAppointments]);

    const handleTabChange = (tabId: string) => {
        setActiveTab(tabId);
        setFromDate('');
        setToDate('');
        setSortBy('nearest');
        setHistoryStatus([]);
    };

    const handleActionClick = async (app: IAppointment) => {
        if (app.status === AppointmentStatus.PAYMENT_PENDING) {
            try {
                const response = await appointmentService.getPaymentUrl(app.id);
                if (response.success && response.data?.url) {
                    window.location.href = response.data.url;
                } else {
                    toast.error(response.error || "Failed to fetch payment URL");
                    fetchAppointments(pagination.current_page);
                }
            } catch (error: any) {
                toast.error(error.response?.data?.error || error.message || "Something went wrong");
                fetchAppointments(pagination.current_page);
            }
        } else if (app.status === AppointmentStatus.COMPLETED && !app.has_review) {
            setSelectedAppointment(app);
            setReviewRating(0);
            setReviewText('');
            setReviewError('');
            setIsReviewModalOpen(true);
        }
    };

    const handleSubmitReview = async () => {
        if (!selectedAppointment) return;

        if (reviewRating === 0) {
            setReviewError("Please select a rating");
            return;
        }

        if (reviewText.length > 500) {
            setReviewError("Review cannot exceed 500 characters");
            return;
        }

        setIsSubmittingReview(true);
        setReviewError('');
        try {
            const payload: ICreateRatingRequest = {
                appointment_id: selectedAppointment.id,
                rating: reviewRating,
                review: reviewText.trim() || undefined
            };

            const response = await ratingService.createRating(payload);
            if (response.success) {
                toast.success(response.message || "Review submitted successfully");
                setIsReviewModalOpen(false);
                fetchAppointments(pagination.current_page);
            } else {
                setReviewError(response.error || "Failed to submit review");
            }
        } catch (error: any) {
            setReviewError(error.response?.data?.error || error.message || "Something went wrong");
        } finally {
            setIsSubmittingReview(false);
        }
    };

    // For date constraints
    const today = format(new Date(), 'yyyy-MM-dd');
    const yesterday = format(subDays(new Date(), 1), 'yyyy-MM-dd');

    return (
        <div className="space-y-10">
            <SEO title="My Appointments — Niramaya" description="Track your health journey, view upcoming visits, and manage consultation history." />
            {/* Header section moved to inside for better spacing with layout */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-2">My Appointments</h1>
                    <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Track your health journey and visits</p>
                </div>
            </div>


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
                {activeTab !== PatientAppointmentTabs.PENDING_PAYMENT && (
                    <div className="p-8 pb-0 flex flex-col sm:flex-row flex-wrap items-center gap-6">
                        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto justify-center sm:justify-start">
                            <div className="flex flex-col gap-1.5 w-full xs:w-auto flex-1 xs:flex-none">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-tight ml-1">From Date</label>
                                <div className="relative">
                                    <input
                                        type="date"
                                        value={fromDate}
                                        min={activeTab === PatientAppointmentTabs.SCHEDULED ? today : undefined}
                                        max={activeTab === PatientAppointmentTabs.HISTORY ? yesterday : undefined}
                                        onChange={(e) => {
                                            const newFrom = e.target.value;
                                            setFromDate(newFrom);
                                            // Validation: if new from > existing to, reset to
                                            if (toDate && newFrom > toDate) {
                                                setToDate('');
                                                toast.error("To date must be after from date");
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
                                        min={fromDate || (activeTab === PatientAppointmentTabs.SCHEDULED ? today : undefined)}
                                        max={activeTab === PatientAppointmentTabs.HISTORY ? yesterday : undefined}
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

                        <div className="flex flex-col sm:flex-row items-center gap-6 justify-between w-full sm:w-auto sm:flex-grow">
                            {/* History Status Filters */}
                            {activeTab === PatientAppointmentTabs.HISTORY && (
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-tight ml-1">Status</label>
                                    <div className="flex items-center gap-2">
                                        {[AppointmentStatus.COMPLETED, AppointmentStatus.PAYMENT_FAILED].map(status => (
                                            <button
                                                key={status}
                                                onClick={() => {
                                                    setHistoryStatus(prev =>
                                                        prev.includes(status) ? prev.filter(s => s !== status) : [...prev, status]
                                                    );
                                                }}
                                                className={cn(
                                                    "px-4 py-2 rounded-xl text-[10px] font-bold uppercase transition-all border",
                                                    historyStatus.includes(status)
                                                        ? "bg-primary-600 border-primary-600 text-white"
                                                        : "bg-gray-50 border-gray-100 text-gray-400 hover:bg-gray-100"
                                                )}
                                            >
                                                {status.replace('_', ' ')}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="flex flex-col gap-1.5 w-full sm:w-auto sm:ml-auto items-center sm:items-start">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-tight">Sort By</label>
                                <div className="relative w-full sm:min-w-[160px]">
                                    <select
                                        value={sortBy}
                                        onChange={(e) => setSortBy(e.target.value as any)}
                                        className="h-12 w-full pl-10 pr-10 rounded-2xl bg-gray-50 border-none text-xs font-bold text-gray-700 appearance-none focus:ring-2 focus:ring-primary-100 transition-all cursor-pointer"
                                    >
                                        {activeTab === PatientAppointmentTabs.HISTORY ? (
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
                                {appointments.map((app) => (
                                    <AppointmentCard
                                        key={app.id}
                                        appointment={app}
                                        role={Role.PATIENT}
                                        onClick={() => { setSelectedAppointment(app); setIsDetailModalOpen(true); }}
                                        onAction={() => handleActionClick(app)}
                                    />
                                ))}
                            </div>
                            {(activeTab === PatientAppointmentTabs.SCHEDULED || activeTab === PatientAppointmentTabs.HISTORY) && (
                                <Pagination
                                    currentPage={pagination.current_page}
                                    totalPages={pagination.total_pages}
                                    onPageChange={(page) => fetchAppointments(page)}
                                />
                            )}
                        </>
                    ) : (
                        <div className="py-20 flex flex-col items-center justify-center text-center">
                            <div className="w-20 h-20 rounded-full bg-gray-50 flex items-center justify-center mb-6">
                                <CalendarDays className="w-8 h-8 text-gray-200" />
                            </div>
                            <h3 className="text-xl font-black text-gray-900 mb-2">No Appointments Found</h3>
                            <p className="text-sm font-bold text-gray-400 max-w-xs">You don't have any appointments in this category.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Appointment Detail Modal */}
            <AppointmentModal
                isOpen={isDetailModalOpen}
                onClose={() => setIsDetailModalOpen(false)}
                appointment={selectedAppointment}
                role={Role.PATIENT}
            />

            {/* Review Modal */}
            {isReviewModalOpen && selectedAppointment && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={() => !isSubmittingReview && setIsReviewModalOpen(false)} />

                    <div className="relative w-full max-w-md bg-white rounded-[40px] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300 max-h-[90vh] flex flex-col m-4">
                        {/* Header Section (Consistent with AppointmentModal) */}
                        <div className="relative h-24 bg-primary-600 px-6 py-4 flex items-center shrink-0">
                            <button
                                onClick={() => setIsReviewModalOpen(false)}
                                disabled={isSubmittingReview}
                                className="absolute right-6 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all backdrop-blur-md border border-white/10 group active:scale-90 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <X className="w-5 h-5 group-hover:rotate-90 transition-transform" />
                            </button>

                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/10">
                                    <MessageSquare className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-black text-white leading-none mb-1">Give Review</h2>
                                    <p className="text-[10px] font-black text-white/50 uppercase tracking-widest leading-none">Feedback for your session</p>
                                </div>
                            </div>
                        </div>

                        {/* Modal Body */}
                        <div className="px-6 py-6 overflow-y-auto flex-1">
                            <div className="flex flex-col items-center text-center">
                                <p className="text-[10px] font-black text-gray-400 mb-4 uppercase tracking-widest leading-relaxed">
                                    How was your experience with <br />
                                    <span className="text-gray-900 text-xs">
                                        {selectedAppointment && selectedAppointment.doctor_name?.toLowerCase().startsWith('dr.')
                                            ? selectedAppointment.doctor_name
                                            : `Dr. ${selectedAppointment?.doctor_name}`}
                                    </span>?
                                </p>

                                {/* Stars */}
                                <div className="flex flex-col items-center gap-2 mb-6">
                                    <div className="flex items-center gap-2">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button
                                                key={star}
                                                onClick={() => {
                                                    setReviewRating(star);
                                                    setReviewError('');
                                                }}
                                                disabled={isSubmittingReview}
                                                className="transition-transform active:scale-95 group disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                <Star
                                                    className={cn(
                                                        "w-10 h-10 transition-all duration-300",
                                                        star <= reviewRating
                                                            ? "fill-amber-400 text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.3)]"
                                                            : "text-gray-100 group-hover:text-gray-200"
                                                    )}
                                                />
                                            </button>
                                        ))}
                                    </div>
                                    {reviewError && reviewError.includes("rating") && (
                                        <p className="text-[10px] font-black text-rose-500 uppercase tracking-tight">{reviewError}</p>
                                    )}
                                </div>

                                <div className="w-full flex flex-col gap-1.5 mb-6">
                                    <div className="flex justify-between items-end ml-2 mr-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-tight text-left">Your Experience (Optional)</label>
                                        <span className={cn(
                                            "text-[9px] font-black uppercase tracking-tight",
                                            reviewText.length > 500 ? "text-rose-500" : "text-gray-400"
                                        )}>
                                            {reviewText.length}/500
                                        </span>
                                    </div>
                                    <textarea
                                        placeholder="Tell us what you liked or what could be improved..."
                                        value={reviewText}
                                        disabled={isSubmittingReview}
                                        onChange={(e) => {
                                            setReviewText(e.target.value);
                                            if (e.target.value.length <= 500) setReviewError('');
                                        }}
                                        className={cn(
                                            "w-full h-32 bg-gray-50 rounded-2xl p-4 border-none text-sm font-bold text-gray-700 focus:ring-2 transition-all resize-none overflow-y-auto whitespace-pre-wrap break-words disabled:opacity-50",
                                            reviewError && !reviewError.includes("rating") ? "ring-2 ring-rose-100" : "focus:ring-primary-100"
                                        )}
                                    />
                                    {reviewError && !reviewError.includes("rating") && (
                                        <p className="text-[10px] font-black text-rose-500 uppercase tracking-tight text-left ml-2">{reviewError}</p>
                                    )}
                                </div>

                                <div className="w-full grid grid-cols-2 gap-3 pb-2">
                                    <button
                                        className="h-12 rounded-xl bg-gray-50 text-gray-500 text-[10px] font-black uppercase tracking-widest hover:bg-gray-100 transition-all active:scale-95 disabled:opacity-50"
                                        onClick={() => setIsReviewModalOpen(false)}
                                        disabled={isSubmittingReview}
                                    >
                                        Discard
                                    </button>
                                    <button
                                        className="h-12 rounded-xl bg-primary-600 text-white text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary-200 hover:bg-primary-700 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                                        onClick={handleSubmitReview}
                                        disabled={isSubmittingReview}
                                    >
                                        {isSubmittingReview ? (
                                            <>
                                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                Submitting...
                                            </>
                                        ) : "Submit"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PatientAppointments;
