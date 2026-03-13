import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import {
    Calendar as CalendarIcon,
    Clock,
    ChevronRight,
    FileText,
    Upload,
    X,
    CheckCircle2,
    AlertCircle,
    ArrowLeft,
    Sparkles
} from 'lucide-react';

import AvailabilityCalendar from '../../../components/common/AvailabilityCalendar/AvailabilityCalendar';
import { ICalendarAvailability } from '../../../components/common/AvailabilityCalendar/types';
import { Button } from '../../../components/ui/Button';
import { Textarea } from '../../../components/ui/Textarea';
import { Badge } from '../../../components/ui/Badge';

import { appointmentService } from '../services/appointment.service';
import { IDayAvailability, ISlot, SlotStatus } from '../types/booking.types';
import { profileService } from '../../auth/services/profile.service';
import { getRoleFromToken } from '../../auth/utils/auth.utils';
import { Role } from '../../../types/role.enum';
import { cn } from '../../../lib/utils';
import { APP_ROUTES } from '../../../constants/app-routes';

/* ─────────────────────────────────────────────────────────────
   Helpers
───────────────────────────────────────────────────────────── */
const fmt = (iso: string) =>
    new Date(iso).toLocaleTimeString('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
        timeZone: 'UTC',
    });

const slotMins = (start: string, end: string) =>
    Math.round((new Date(end).getTime() - new Date(start).getTime()) / 60000);

/* ─────────────────────────────────────────────────────────────
   Component
───────────────────────────────────────────────────────────── */
const BookAppointment: React.FC = () => {
    const { doctorId } = useParams<{ doctorId: string }>();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [booking, setBooking] = useState(false);
    const [availabilities, setAvailabilities] = useState<IDayAvailability[]>([]);
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedSlot, setSelectedSlot] = useState<ISlot | null>(null);
    const [description, setDescription] = useState('');
    const [reports, setReports] = useState<File[]>([]);
    const [showOverlapModal, setShowOverlapModal] = useState(false);
    const [pendingCheckoutUrl, setPendingCheckoutUrl] = useState<string | null>(null);
    const [overlapWarningMessage, setOverlapWarningMessage] = useState('');

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);
    /* Auth */
    useEffect(() => {
        const role = getRoleFromToken();
        if (role !== Role.PATIENT) {
            toast.error('Only patients can book appointments');
            navigate(APP_ROUTES.HOME);
        }
    }, [navigate]);

    /* Fetch */
    useEffect(() => {
        if (doctorId) fetchAvailability();
    }, [doctorId]);

    const fetchAvailability = async () => {
        try {
            setLoading(true);
            const res = await appointmentService.getDoctorAvailability(doctorId!);
            if (res.success && res.data) setAvailabilities(res.data.availabilities);
        } catch (e: any) {
            toast.error(e.response?.data?.message || 'Failed to fetch availability');
        } finally {
            setLoading(false);
        }
    };

    /* Derived */
    const calendarData: ICalendarAvailability[] = useMemo(
        () =>
            availabilities.map(d => ({
                date: d.date,
                is_active: d.is_active,
                available_slots: d.slots.filter(s => s.status === SlotStatus.AVAILABLE).length,
                total_slots: d.slots.length,
            })),
        [availabilities]
    );

    const selectedDayData = useMemo(
        () => availabilities.find(a => a.date === selectedDate),
        [availabilities, selectedDate]
    );

    /* Handlers */
    const handleDateChange = (dates: string[]) => {
        if (dates.length) {
            setSelectedDate(dates[0]);
            setSelectedSlot(null);
        }
    };

    const handleSlotClick = (slot: ISlot) => {
        setSelectedSlot(prev =>
            prev?.start_time === slot.start_time ? null : slot
        );
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;
        const newFiles = Array.from(e.target.files);
        const validTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
        if (newFiles.some(f => !validTypes.includes(f.type))) {
            toast.error('Only PDF, JPG, and PNG formats allowed');
            return;
        }
        const unique = newFiles.filter(f =>
            !reports.some(r => r.name === f.name && r.size === f.size)
        );
        if (unique.length < newFiles.length) {
            toast.error('Duplicate files not allowed');
        }
        if (reports.length + unique.length > 5) {
            toast.error('Maximum 5 reports allowed');
            return;
        }
        if (unique.length > 0) setReports(prev => [...prev, ...unique]);
        e.target.value = '';
    };

    const removeReport = (i: number) =>
        setReports(prev => prev.filter((_, idx) => idx !== i));

    const handleBooking = async () => {
        if (!selectedSlot) { toast.error('Please select a slot'); return; }
        if (!description.trim()) { toast.error('Please describe your reason for visit'); return; }
        try {
            setBooking(true);

            // Step 1: Fetch patient profile to get required personal/health fields
            const profileRes = await profileService.getPatientProfile();
            if (!profileRes.success || !profileRes.data) {
                toast.error('Failed to fetch patient profile. Please try again.');
                return;
            }
            const p = profileRes.data;
            const pp = p.patient_profile;

            // Step 2: Book appointment with all required fields
            const res = await appointmentService.bookAppointment({
                doctor_id: doctorId!,
                start_at: selectedSlot.start_time,
                end_at: selectedSlot.end_time,
                description,
                medical_reports: reports,
                name: `${p.first_name} ${p.last_name}`.trim(),
                email: p.email ?? '',
                phone: p.phone_number ?? '',
                gender: p.gender ?? '',
                height: pp?.height?.toString() ?? '',
                weight: pp?.weight?.toString() ?? '',
                blood_group: pp?.blood_group ?? '',
            });

            // Step 3: Redirect or show warning
            if (res.success && res.data?.checkoutUrl) {
                if (res.message && res.message.toLowerCase().includes('warning')) {
                    setOverlapWarningMessage(res.message);
                    setPendingCheckoutUrl(res.data.checkoutUrl);
                    setShowOverlapModal(true);
                } else {
                    window.location.href = res.data.checkoutUrl;
                }
            }
        } catch (e: any) {
            toast.error(e.response?.data?.message || 'Booking failed');
        } finally {
            setBooking(false);
        }
    };

    /* ─── render ─── */
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-primary-50/30">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-8">

                {/* ── Page Header ── */}
                <div className="space-y-1">
                    <button
                        onClick={() => navigate(-1)}
                        className="inline-flex items-center gap-1.5 text-sm font-semibold text-dark-400 hover:text-primary-600 transition-colors group mb-2"
                    >
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                        Back
                    </button>
                    <h1 className="text-3xl sm:text-4xl font-black text-dark-900 tracking-tight leading-none">
                        Book <span className="text-primary-600">Appointment</span>
                    </h1>
                    <p className="text-dark-400 text-sm font-medium">
                        Select a date, pick a slot and confirm your visit.
                    </p>
                </div>

                {/* ── Step 1: Pick Date & Slot ── */}
                <section className="space-y-3">
                    <StepLabel step={1} label="Choose a date & time slot" />

                    {/* Both columns fixed at 600px — content scrolls inside, nothing ever grows */}
                    <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] xl:grid-cols-[1fr_420px] gap-4 lg:gap-6">

                        {/* LEFT — Calendar: natural auto height */}
                        <div>
                            <PanelCard>
                                <AvailabilityCalendar
                                    availabilities={calendarData}
                                    selectedDates={selectedDate ? [selectedDate] : []}
                                    onDatesChange={handleDateChange}
                                    mode={Role.PATIENT}
                                    loading={loading}
                                />
                            </PanelCard>
                        </div>

                        {/* RIGHT — Slots: same fixed height, list scrolls inside */}
                        <div style={{ height: 684.83 }}>
                            <PanelCard className="h-full flex flex-col overflow-hidden">
                                {/* Header */}
                                <div className="flex items-center gap-2.5 mb-5 shrink-0">
                                    <div className="p-2 rounded-xl bg-primary-50 text-primary-600">
                                        <Clock className="w-4 h-4" />
                                    </div>
                                    <h2 className="font-black text-dark-900 text-sm tracking-wide">
                                        Available Time Slots
                                    </h2>
                                    {selectedDayData && (
                                        <span className="ml-auto text-[11px] font-black bg-primary-50 text-primary-600 px-2.5 py-1 rounded-full tracking-wider">
                                            {selectedDayData.slots.filter(s => s.status === SlotStatus.AVAILABLE).length} FREE
                                        </span>
                                    )}
                                </div>

                                {/* Slot list — fills remaining height and scrolls */}
                                {!selectedDate ? (
                                    <EmptySlotPrompt />
                                ) : (
                                    <div className="flex-1 min-h-0 overflow-y-auto pr-1 space-y-2.5">
                                        {selectedDayData?.slots?.length ? (
                                            selectedDayData.slots.map((slot, i) => {
                                                const avail = slot.status === SlotStatus.AVAILABLE;
                                                const picked = selectedSlot?.start_time === slot.start_time;
                                                return (
                                                    <SlotButton
                                                        key={i}
                                                        slot={slot}
                                                        available={avail}
                                                        selected={picked}
                                                        onClick={() => avail && handleSlotClick(slot)}
                                                    />
                                                );
                                            })
                                        ) : (
                                            <div className="flex flex-col items-center justify-center py-16 text-center">
                                                <AlertCircle className="w-10 h-10 text-red-200 mb-3" />
                                                <p className="text-dark-400 font-bold text-sm">
                                                    No slots for this day
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Selected slot confirmation pill */}
                                {selectedSlot && (
                                    <div className="mt-4 shrink-0 flex items-center gap-3 p-3.5 rounded-2xl bg-emerald-50 border border-emerald-100 animate-in slide-in-from-bottom-2 duration-300">
                                        <div className="w-9 h-9 rounded-xl bg-emerald-500 flex items-center justify-center shrink-0 shadow-sm shadow-emerald-200">
                                            <CheckCircle2 className="w-5 h-5 text-white" />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest leading-none mb-0.5">
                                                Selected
                                            </p>
                                            <p className="font-black text-dark-900 text-sm truncate">
                                                {fmt(selectedSlot.start_time)}
                                                <span className="text-dark-300 mx-1.5 font-normal">→</span>
                                                {fmt(selectedSlot.end_time)}
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => setSelectedSlot(null)}
                                            className="ml-auto shrink-0 p-1.5 rounded-lg hover:bg-emerald-100 transition-colors text-emerald-400"
                                            aria-label="Deselect slot"
                                        >
                                            <X className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                )}
                            </PanelCard>
                        </div>
                    </div>
                </section>

                {/* ── Step 2 & 3: Form (only after slot is selected) ── */}
                {selectedSlot && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-3 duration-500">

                        {/* Two form panels — stacked on mobile, side-by-side on desktop, SAME HEIGHT */}
                        <section className="space-y-3">
                            <StepLabel step={2} label="Describe your visit & attach reports" />

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 lg:items-stretch">

                                {/* Description */}
                                <PanelCard className="flex flex-col gap-3" style={{ height: 280 }}>
                                    <div className="flex items-center gap-2.5 shrink-0">
                                        <div className="p-2 rounded-xl bg-primary-50 text-primary-600">
                                            <FileText className="w-4 h-4" />
                                        </div>
                                        <h2 className="font-black text-dark-900 text-sm tracking-wide">
                                            Reason for Visit
                                        </h2>
                                    </div>
                                    <Textarea style={{ height: 170 }}
                                        placeholder="Describe your symptoms, concerns..."
                                        value={description}
                                        onChange={e => setDescription(e.target.value)}
                                        className="flex-1 resize-none rounded-2xl border-2 border-dark-50 focus:border-primary-400 bg-slate-50 p-4 text-sm text-dark-800 placeholder-dark-300 transition-all outline-none overflow-y-auto"
                                        required
                                    />
                                    <p className="text-[11px] text-dark-300 font-semibold text-right shrink-0">
                                        {description.length} chars
                                    </p>
                                </PanelCard>

                                {/* Reports */}
                                <PanelCard className="flex flex-col gap-3" style={{ height: 280 }}>
                                    <div className="flex items-center gap-2.5 shrink-0">
                                        <div className="p-2 rounded-xl bg-primary-50 text-primary-600">
                                            <Upload className="w-4 h-4" />
                                        </div>
                                        <h2 className="font-black text-dark-900 text-sm tracking-wide">
                                            Medical Reports
                                        </h2>
                                        <Badge className="ml-auto text-[10px] font-black bg-dark-50 text-dark-500 border-none px-2.5 py-1 tracking-wider shrink-0">
                                            {reports.length}/5
                                        </Badge>
                                    </div>

                                    <div className="flex-1 rounded-2xl border-2 border-dashed border-dark-100 bg-slate-50 p-3 overflow-y-auto">
                                        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                                            {reports.map((file, i) => (
                                                <ReportCard
                                                    key={i}
                                                    file={file}
                                                    onRemove={() => removeReport(i)}
                                                />
                                            ))}
                                            {reports.length < 5 && (
                                                <UploadCard onChange={handleFileChange} />
                                            )}
                                        </div>
                                    </div>
                                    <p className="text-[11px] text-dark-300 font-semibold shrink-0">
                                        PDF, JPG, PNG — max 5 files
                                    </p>
                                </PanelCard>
                            </div>
                        </section>

                        {/* ── Step 3: Confirm ── */}
                        <section className="space-y-3">
                            <StepLabel step={3} label="Confirm & pay" />
                            {/* Action Bar */}
                            {selectedSlot && (
                                <div className="mt-8">
                                    <ConfirmBar
                                        doctorId={doctorId}
                                        slot={selectedSlot}
                                        canBook={!!description.trim()}
                                        booking={booking}
                                        onCancel={() => { setSelectedSlot(null); setDescription(''); }}
                                        onBook={handleBooking}
                                    />
                                </div>
                            )}
                        </section>
                    </div>
                )}
            </div>

            {/* Overlap Warning Modal */}
            <OverlapWarningModal
                isOpen={showOverlapModal}
                message={overlapWarningMessage}
                onConfirm={() => {
                    if (pendingCheckoutUrl) window.location.href = pendingCheckoutUrl;
                }}
                onCancel={() => {
                    setShowOverlapModal(false);
                    setPendingCheckoutUrl(null);
                }}
            />
        </div>
    );
};

/* ─────────────────────────────────────────────────────────────
   Sub-components
───────────────────────────────────────────────────────────── */

/* Step label */
const StepLabel: React.FC<{ step: number; label: string }> = ({ step, label }) => (
    <div className="flex items-center gap-3">
        <div className="w-7 h-7 rounded-full bg-primary-600 flex items-center justify-center text-white text-xs font-black shrink-0 shadow-sm shadow-primary-200">
            {step}
        </div>
        <h2 className="text-sm font-black text-dark-700 uppercase tracking-widest">{label}</h2>
    </div>
);

/* Reusable panel card */
interface PanelCardProps {
    children: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
}
const PanelCard: React.FC<PanelCardProps> = ({ children, className, style }) => (
    <div
        style={style}
        className={cn(
            'bg-white rounded-3xl border border-dark-100 shadow-sm p-5 sm:p-6',
            className
        )}
    >
        {children}
    </div>
);

/* Empty state when no date is chosen */
const EmptySlotPrompt: React.FC = () => (
    <div className="flex-1 flex flex-col items-center justify-center text-center py-14 border-2 border-dashed border-dark-50 rounded-2xl bg-slate-50/60">
        <div className="w-14 h-14 rounded-full bg-white shadow-sm flex items-center justify-center mb-4">
            <CalendarIcon className="w-7 h-7 text-primary-200" />
        </div>
        <p className="text-dark-400 font-bold text-sm max-w-[180px] leading-snug">
            Pick a date on the calendar to view slots
        </p>
    </div>
);

/* Individual slot button */
interface SlotButtonProps {
    slot: ISlot;
    available: boolean;
    selected: boolean;
    onClick: () => void;
}
const SlotButton: React.FC<SlotButtonProps> = ({ slot, available, selected, onClick }) => (
    <button
        disabled={!available}
        onClick={onClick}
        className={cn(
            'w-full flex items-center justify-between px-4 py-3.5 rounded-2xl border-2 transition-all duration-200 text-left group',
            selected
                ? 'bg-primary-600 border-primary-600 text-white shadow-md shadow-primary-200/50'
                : available
                    ? 'bg-white border-dark-50 hover:border-primary-300 hover:bg-primary-50/40 shadow-sm'
                    : 'bg-dark-50/50 border-transparent opacity-50 cursor-not-allowed'
        )}
    >
        <div className="flex flex-col gap-0.5 min-w-0">
            <span className="font-black text-sm leading-none truncate">
                {fmt(slot.start_time)} – {fmt(slot.end_time)}
            </span>
            <span className={cn(
                'text-[10px] font-bold uppercase tracking-wider leading-none',
                selected ? 'text-primary-100' : 'text-dark-400'
            )}>
                {slotMins(slot.start_time, slot.end_time)} min slot
            </span>
        </div>

        {!available ? (
            <span className="text-[10px] font-black bg-red-50 text-red-500 px-2 py-1 rounded-full shrink-0 border border-red-100">
                Booked
            </span>
        ) : selected ? (
            <span className="text-[10px] font-black bg-white/20 text-white px-2 py-1 rounded-full shrink-0">
                ✓ Picked
            </span>
        ) : (
            <span className="text-[10px] font-black bg-green-50 text-green-600 px-2 py-1 rounded-full shrink-0 border border-green-100 group-hover:bg-primary-50 group-hover:text-primary-600 group-hover:border-primary-100 transition-colors">
                Free
            </span>
        )}
    </button>
);

/* Report file card */
interface ReportCardProps { file: File; onRemove: () => void }
const ReportCard: React.FC<ReportCardProps> = ({ file, onRemove }) => (
    <div className="relative group rounded-xl border border-dark-100 bg-white p-2 flex flex-col items-center justify-center text-center overflow-hidden shadow-sm hover:shadow-md transition-shadow aspect-square">
        <button
            onClick={onRemove}
            className="absolute top-1.5 right-1.5 w-5 h-5 bg-red-500 text-white rounded-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:scale-110 active:scale-90 shadow-sm"
        >
            <X className="w-2.5 h-2.5" />
        </button>
        <div className="w-7 h-7 bg-primary-50 rounded-lg flex items-center justify-center text-primary-600 mb-1">
            <FileText className="w-4 h-4" />
        </div>
        <p className="text-[9px] font-bold text-dark-600 truncate w-full px-1 leading-tight">
            {file.name}
        </p>
        <p className="text-[8px] font-black text-dark-300 uppercase">
            {(file.size / (1024 * 1024)).toFixed(1)} MB
        </p>
    </div>
);

/* Upload trigger card */
interface UploadCardProps { onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }
const UploadCard: React.FC<UploadCardProps> = ({ onChange }) => (
    <label className="aspect-square rounded-xl border-2 border-dashed border-dark-200 bg-white/60 hover:bg-white hover:border-primary-400 transition-all cursor-pointer flex flex-col items-center justify-center group shadow-sm">
        <input type="file" className="hidden" multiple onChange={onChange} accept=".pdf,.jpg,.jpeg,.png" />
        <div className="w-7 h-7 bg-primary-50 rounded-lg flex items-center justify-center text-primary-400 group-hover:text-primary-600 group-hover:scale-110 transition-all mb-1">
            <Upload className="w-4 h-4" />
        </div>
        <p className="text-[9px] font-black text-dark-400 uppercase tracking-wider group-hover:text-primary-600 transition-colors">
            Add
        </p>
    </label>
);

/* Confirm booking action bar */
interface ConfirmBarProps {
    doctorId?: string;
    slot: ISlot;
    canBook: boolean;
    booking: boolean;
    onCancel: () => void;
    onBook: () => void;
}
const ConfirmBar: React.FC<ConfirmBarProps> = ({
    doctorId, slot, canBook, booking, onCancel, onBook
}) => (
    <div className="relative overflow-hidden rounded-3xl bg-primary-600 text-white shadow-xl shadow-primary-200/50">
        {/* Subtle glow */}
        <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-8 -right-8 w-48 h-48 bg-white/10 blur-[60px] rounded-full" />
        </div>

        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 sm:p-6 lg:p-8">
            {/* Left info */}
            <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-2xl bg-white/15 flex items-center justify-center shrink-0">
                    <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                    <p className="text-primary-100 text-[10px] font-black uppercase tracking-[0.2em] leading-none mb-1">
                        Confirm Booking
                    </p>
                    <h3 className="text-lg sm:text-xl font-black tracking-tight">
                        {fmt(slot.start_time)} → {fmt(slot.end_time)}
                    </h3>
                    <p className="text-primary-200 text-xs font-semibold mt-0.5">
                        Ref: {doctorId?.slice(-6).toUpperCase() ?? '------'}
                    </p>
                </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 w-full sm:w-auto shrink-0">
                <Button
                    variant="secondary"
                    size="lg"
                    className="flex-1 sm:flex-none px-6 rounded-2xl bg-white/10 hover:bg-white/20 border-white/20 text-white font-bold transition-all"
                    onClick={onCancel}
                >
                    Cancel
                </Button>
                <Button
                    size="lg"
                    className="flex-1 sm:flex-none px-8 rounded-2xl bg-white hover:bg-primary-50 text-primary-700 font-black border-none shadow-lg transition-all hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                    onClick={onBook}
                    loading={booking}
                    disabled={!canBook || booking}
                >
                    <span>Pay &amp; Confirm</span>
                    <ChevronRight className="w-5 h-5 ml-1.5" />
                </Button>
            </div>
        </div>
    </div>
);

/* Overlap Warning Modal Component */
interface OverlapWarningModalProps {
    isOpen: boolean;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
}
const OverlapWarningModal: React.FC<OverlapWarningModalProps> = ({ isOpen, message, onConfirm, onCancel }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-dark-900/60 backdrop-blur-sm transition-opacity" 
                onClick={onCancel}
            />
            
            {/* Modal */}
            <div className="relative bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
                <div className="p-6 sm:p-8">
                    <div className="flex flex-col items-center text-center">
                        <div className="w-16 h-16 bg-yellow-100 rounded-2xl flex items-center justify-center mb-6 text-yellow-600">
                            <AlertCircle className="w-8 h-8" />
                        </div>
                        
                        <h3 className="text-xl font-black text-dark-900 mb-3">
                            Appointment Overlap
                        </h3>
                        
                        <p className="text-dark-500 text-sm leading-relaxed mb-8">
                            {message || "You already have an appointment booked for this time slot. Are you sure you want to proceed with another one?"}
                        </p>
                        
                        <div className="flex flex-col sm:flex-row gap-3 w-full">
                            <Button
                                variant="secondary"
                                className="flex-1 rounded-xl font-bold order-2 sm:order-1"
                                onClick={onCancel}
                            >
                                Back to Calendar
                            </Button>
                            <Button
                                className="flex-1 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-bold order-1 sm:order-2"
                                onClick={onConfirm}
                            >
                                Confirm &amp; Pay
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookAppointment;
