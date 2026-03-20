import React, { useState, useEffect, useMemo } from 'react';
import { cn } from '../../../lib/utils';
import { IDoctorAvailability, IAvailabilityUpdatePayload } from '../types/availability.types';
import { Clock, AlertTriangle, CheckCircle2, Save, X } from 'lucide-react';

interface AvailabilityFormProps {
    selectedDates: string[];
    availabilities: IDoctorAvailability[];
    onSave: (payload: IAvailabilityUpdatePayload) => void;
    onCancel: () => void;
    isSaving?: boolean;
}

const ClockDial: React.FC<{
    view: 'hours' | 'minutes';
    selectedValue: number;
    onSelect: (val: number) => void;
}> = ({ view, selectedValue, onSelect }) => {
    // Generate numbers 1-12 for outer, 13-00 for inner (for hours)
    // Or 0-55 for minutes
    const items = useMemo(() => {
        if (view === 'hours') {
            const outer = [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
            const inner = [0, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];
            return { outer, inner };
        } else {
            return { outer: [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55], inner: [] };
        }
    }, [view]);

    const getRotation = (val: number) => {
        if (view === 'hours') return (val % 12) * 30;
        return (val % 60) * 6;
    };

    const isInner = view === 'hours' && (selectedValue >= 13 || selectedValue === 0);
    const rotation = getRotation(selectedValue);

    return (
        <div className="relative w-56 h-56 sm:w-64 sm:h-64 mx-auto bg-gray-50 rounded-full border border-gray-100 flex items-center justify-center p-4">
            {/* Numbers */}
            <div className="absolute inset-0">
                {items.outer.map((num, i) => {
                    const angle = (i * 30) - 90;
                    const rad = angle * (Math.PI / 180);
                    // Responsive radius
                    const r = typeof window !== 'undefined' && window.innerWidth < 640 ? 85 : 100;
                    const x = Math.cos(rad) * r;
                    const y = Math.sin(rad) * r;
                    return (
                        <button
                            key={`outer-${num}`}
                            type="button"
                            onClick={() => onSelect(num)}
                            style={{ transform: `translate(${x}px, ${y}px)` }}
                            className={cn(
                                "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full text-xs font-black transition-all",
                                selectedValue === num ? "text-white z-20" : "text-gray-400 hover:text-primary-600 hover:scale-110"
                            )}
                        >
                            {num.toString().padStart(2, '0')}
                        </button>
                    );
                })}

                {items.inner.map((num, i) => {
                    const angle = (i * 30) - 90;
                    const rad = angle * (Math.PI / 180);
                    // Responsive radius
                    const r = typeof window !== 'undefined' && window.innerWidth < 640 ? 55 : 65;
                    const x = Math.cos(rad) * r;
                    const y = Math.sin(rad) * r;
                    return (
                        <button
                            key={`inner-${num}`}
                            type="button"
                            onClick={() => onSelect(num)}
                            style={{ transform: `translate(${x}px, ${y}px)` }}
                            className={cn(
                                "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full text-[10px] font-black transition-all",
                                selectedValue === num ? "text-white z-20" : "text-gray-300 hover:text-primary-600 hover:scale-110"
                            )}
                        >
                            {num.toString().padStart(2, '0')}
                        </button>
                    );
                })}
            </div>

            {/* Pivot */}
            <div className="w-1.5 h-1.5 bg-primary-600 rounded-full z-20" />

            {/* Hand */}
            {!isNaN(selectedValue) && (
                <div
                    className="absolute top-1/2 left-1/2 w-0.5 bg-primary-600 origin-bottom transition-all duration-300 ease-out z-10"
                    style={{
                        height: isInner
                            ? (typeof window !== 'undefined' && window.innerWidth < 640 ? '55px' : '65px')
                            : (typeof window !== 'undefined' && window.innerWidth < 640 ? '85px' : '100px'),
                        transform: `translate(-50%, -100%) rotate(${rotation}deg)`
                    }}
                >
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-primary-600 rounded-full shadow-md shadow-primary-200" />
                </div>
            )}
        </div>
    );
};

const TimeSelect: React.FC<{
    value: string;
    onChange: (val: string) => void;
    label: string;
    showError?: boolean;
    error?: string;
}> = ({ value, onChange, label, showError, error }) => {
    const [h, m] = value ? value.split(':') : ['', ''];
    const [localH, setLocalH] = useState(h);
    const [localM, setLocalM] = useState(m);
    const [showClock, setShowClock] = useState(false);
    const [clockView, setClockView] = useState<'hours' | 'minutes'>('hours');

    useEffect(() => {
        const [newH, newM] = value ? value.split(':') : ['', ''];
        setLocalH(newH);
        setLocalM(newM);
    }, [value]);

    const handleHourChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value.replace(/\D/g, '').slice(0, 2);
        setLocalH(val);
        onChange(`${val}:${localM}`);
    };

    const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value.replace(/\D/g, '').slice(0, 2);
        setLocalM(val);
        onChange(`${localH}:${val}`);
    };

    const handleBlur = () => {
        if (!localH && !localM) return;
        let finalH = localH.padStart(2, '0');
        let finalM = localM.padStart(2, '0');
        if (parseInt(finalH) > 23) finalH = "23";
        if (parseInt(finalM) > 59) finalM = "59";
        setLocalH(finalH);
        setLocalM(finalM);
        onChange(`${finalH}:${finalM}`);
    };

    const selectFromClock = (val: number) => {
        const str = val.toString().padStart(2, '0');
        if (clockView === 'hours') {
            onChange(`${str}:${localM || '00'}`);
            setClockView('minutes');
        } else {
            onChange(`${localH || '00'}:${str}`);
            setShowClock(false);
            setClockView('hours');
        }
    };

    return (
        <div className="space-y-2 relative">
            <div className="flex items-center justify-between pl-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{label}</label>
                <div className="flex items-center gap-1.5">
                    <span className="text-[9px] font-bold text-primary-400 bg-primary-50 px-2 py-0.5 rounded-md border border-primary-100 uppercase tracking-tighter">24H</span>
                </div>
            </div>
            <div className={cn(
                "flex items-center gap-1.5 px-4 py-3 bg-gray-50 border rounded-xl transition-all group relative",
                showError && error ? "border-red-200 focus-within:border-red-500 bg-red-50/30" : "border-gray-100 focus-within:border-primary-500"
            )}>
                <input
                    type="text"
                    inputMode="numeric"
                    value={localH}
                    onChange={handleHourChange}
                    onBlur={handleBlur}
                    className="w-8 bg-transparent text-sm font-bold focus:outline-none text-center placeholder:text-gray-300"
                    placeholder="HH"
                />
                <span className="font-black text-gray-300 select-none">:</span>
                <input
                    type="text"
                    inputMode="numeric"
                    value={localM}
                    onChange={handleMinChange}
                    onBlur={handleBlur}
                    className="w-8 bg-transparent text-sm font-bold focus:outline-none text-center placeholder:text-gray-300"
                    placeholder="MM"
                />
                <button
                    type="button"
                    onClick={() => { setShowClock(!showClock); setClockView('hours'); }}
                    className={cn(
                        "ml-auto p-1 rounded-lg transition-colors",
                        showClock ? "bg-primary-100 text-primary-600" : "text-gray-400 hover:bg-gray-100"
                    )}
                >
                    <Clock className="w-4 h-4" />
                </button>
            </div>

            {showClock && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 p-4 sm:p-6 bg-white border border-gray-100 shadow-2xl rounded-[32px] z-50 animate-in zoom-in-95 duration-200 w-[min(320px,90vw)]">
                    <div className="flex items-center justify-between mb-4 sm:mb-6 px-1">
                        <span className="text-[10px] font-black text-primary-600 uppercase tracking-widest">{clockView} selector</span>
                        <div className="flex bg-gray-50 p-1 rounded-xl">
                            <button
                                type="button"
                                onClick={() => setClockView('hours')}
                                className={cn("px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg text-[9px] sm:text-[10px] font-black uppercase transition-all", clockView === 'hours' ? "bg-white text-primary-600 shadow-sm" : "text-gray-400")}
                            >H</button>
                            <button
                                type="button"
                                onClick={() => setClockView('minutes')}
                                className={cn("px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg text-[9px] sm:text-[10px] font-black uppercase transition-all", clockView === 'minutes' ? "bg-white text-primary-600 shadow-sm" : "text-gray-400")}
                            >M</button>
                        </div>
                    </div>

                    <ClockDial
                        view={clockView}
                        selectedValue={parseInt((clockView === 'hours' ? localH : localM) || '0')}
                        onSelect={selectFromClock}
                    />

                    <button
                        type="button"
                        onClick={() => setShowClock(false)}
                        className="w-full mt-6 py-2 text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-gray-600 transition-colors"
                    >Close</button>
                </div>
            )}

            {showError && error && <p className="text-[10px] text-red-500 font-bold px-1">{error}</p>}
        </div>
    );
};

const AvailabilityForm: React.FC<AvailabilityFormProps> = ({
    selectedDates,
    availabilities,
    onSave,
    onCancel,
    isSaving = false
}) => {
    const selectedAvails = useMemo(() =>
        availabilities.filter(a => selectedDates.includes(a.date)),
        [availabilities, selectedDates]);

    const [form, setForm] = useState<{
        is_active: boolean;
        start_at: string;
        end_at: string;
        break_start: string;
        break_end: string;
        slot_duration: number | string;
    }>({
        is_active: true,
        start_at: '09:00',
        end_at: '17:00',
        break_start: '13:00',
        break_end: '14:00',
        slot_duration: 20
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitted, setIsSubmitted] = useState(false);

    // Detect conflicts and set initial state
    useEffect(() => {
        if (selectedAvails.length === 0) return;
        setIsSubmitted(false); // Reset on date change

        const first = selectedAvails[0];
        const getTimeStr = (isoString: string | null) => {
            if (!isoString) return null;
            const timePart = isoString.split('T')[1];
            return timePart ? timePart.substring(0, 5) : null;
        };

        const initialState = {
            is_active: selectedAvails.every(a => a.is_active === first.is_active) ? first.is_active : true,
            start_at: selectedAvails.every(a => getTimeStr(a.start_at) === getTimeStr(first.start_at)) ? (getTimeStr(first.start_at) || '') : '',
            end_at: selectedAvails.every(a => getTimeStr(a.end_at) === getTimeStr(first.end_at)) ? (getTimeStr(first.end_at) || '') : '',
            break_start: selectedAvails.every(a => getTimeStr(a.break_start) === getTimeStr(first.break_start)) ? (getTimeStr(first.break_start) || '') : '',
            break_end: selectedAvails.every(a => getTimeStr(a.break_end) === getTimeStr(first.break_end)) ? (getTimeStr(first.break_end) || '') : '',
            slot_duration: selectedAvails.every(a => a.slot_duration === first.slot_duration) ? first.slot_duration : ''
        };

        setForm(initialState);
    }, [selectedAvails]);

    // Real-time validation
    useEffect(() => {
        const validate = () => {
            const newErrors: Record<string, string> = {};
            if (!form.is_active) {
                setErrors({});
                return;
            }

            if (!form.start_at) newErrors.start_at = "Required";
            if (!form.end_at) newErrors.end_at = "Required";
            if (!form.slot_duration || Number(form.slot_duration) <= 0) newErrors.slot_duration = "Invalid";

            if (form.start_at && form.end_at && form.start_at >= form.end_at) {
                newErrors.end_at = "Must be after start time";
                newErrors._logic = "true";
            }

            if (form.break_start && form.break_end && form.start_at && form.end_at) {
                const toMin = (t: string) => {
                    const [h, m] = t.split(':').map(Number);
                    return h * 60 + m;
                };

                const startMins = toMin(form.start_at);
                const endMins = toMin(form.end_at);
                const breakStartMins = toMin(form.break_start);
                const breakEndMins = toMin(form.break_end);

                if (form.break_start >= form.break_end) {
                    newErrors.break_range = "Break End must be after Break Start";
                    newErrors._logic = "true";
                }
                if (breakStartMins <= startMins || breakEndMins >= endMins) {
                    newErrors.break_range = "Break must be strictly within working hours (cannot be at the start or end of shift)";
                    newErrors._logic = "true";
                }

                if (!newErrors.break_range && !newErrors.break_end && form.slot_duration !== '') {
                    const durationBeforeBreak = breakStartMins - startMins;
                    const durationAfterBreak = endMins - breakEndMins;
                    const maxSlotDuration = Math.min(durationBeforeBreak, durationAfterBreak);
                    if (Number(form.slot_duration) > maxSlotDuration) {
                        newErrors.slot_duration = `Cannot exceed ${maxSlotDuration} min (shortest segment)`;
                        newErrors._logic = "true";
                    }
                }
            }

            setErrors(newErrors);
        };

        validate();
    }, [form]);

    // Calculate end of day warning
    const shiftInfo = useMemo(() => {
        const durationNum = Number(form.slot_duration);
        if (!form.start_at || !form.end_at || !durationNum || durationNum <= 0) return null;

        const toMin = (t: string) => {
            const [h, m] = t.split(':').map(Number);
            return h * 60 + m;
        };

        const startMin = toMin(form.start_at);
        const endMin = toMin(form.end_at);
        if (startMin >= endMin) return { slots: 0, warning: null };

        let slots = 0;
        let lastEffectiveEnd = endMin;

        if (form.break_start && form.break_end) {
            const bStart = toMin(form.break_start);
            const bEnd = toMin(form.break_end);
            if (bStart > startMin && bEnd < endMin && bStart < bEnd) {
                const seg1Mins = bStart - startMin;
                const seg1Slots = Math.floor(seg1Mins / durationNum);
                slots += seg1Slots;
                const seg2Mins = endMin - bEnd;
                const seg2Slots = Math.floor(seg2Mins / durationNum);
                slots += seg2Slots;
                if (seg2Slots > 0) {
                    const remainder = seg2Mins % durationNum;
                    lastEffectiveEnd = endMin - remainder;
                } else if (seg1Slots > 0) {
                    const remainder = seg1Mins % durationNum;
                    lastEffectiveEnd = bStart - remainder;
                }
            }
        } else {
            const totalWorkMin = endMin - startMin;
            slots = Math.floor(totalWorkMin / durationNum);
            const remainder = totalWorkMin % durationNum;
            lastEffectiveEnd = endMin - remainder;
        }

        if (slots > 0 && lastEffectiveEnd < endMin) {
            const h = Math.floor(lastEffectiveEnd / 60);
            const m = lastEffectiveEnd % 60;
            const timeStr = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
            return { slots, warning: `Your day will effectively end at ${timeStr} due to slot alignment.` };
        }
        return { slots, warning: null };
    }, [form]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitted(true);
        if (Object.keys(errors).filter(k => k !== '_logic').length === 0) {
            const payload: any = {
                is_active: form.is_active,
                dates: selectedDates
            };

            if (form.is_active) {
                payload.start_at = form.start_at;
                payload.end_at = form.end_at;
                payload.break_start = form.break_start;
                payload.break_end = form.break_end;
                payload.slot_duration = Number(form.slot_duration);
            }

            onSave(payload);
        }
    };

    const shouldShowError = (field: string) => {
        if (errors[field] && (isSubmitted || errors._logic === "true")) {
            // Special case for logic errors: always show if they exist
            if (field === 'start_at' || field === 'end_at') return errors[field] === "Must be after start time";
            return true;
        }
        return false;
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-gray-100 shadow-sm p-4 sm:p-8 space-y-6 sm:space-y-8 animate-in slide-in-from-right-4 duration-300">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary-50 rounded-xl">
                        <Clock className="w-5 h-5 text-primary-600" />
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-900">Manage Availability</h3>
                        <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">
                            {selectedDates.length} Date(s) Selected
                        </p>
                    </div>
                </div>
                <button type="button" onClick={onCancel} className="p-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-400">
                    <X className="w-5 h-5" />
                </button>
            </div>

            <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                    <div className="space-y-0.5">
                        <p className="text-sm font-bold text-gray-800">Available for Appointments</p>
                        <p className="text-[10px] text-gray-500 font-medium">Toggle off to mark dates as unavailable</p>
                    </div>
                    <input
                        type="checkbox"
                        checked={form.is_active}
                        onChange={(e) => setForm(f => ({ ...f, is_active: e.target.checked }))}
                        className="toggle toggle-primary toggle-md cursor-pointer"
                    />
                </div>

                {form.is_active && (
                    <div className="space-y-6 animate-in fade-in duration-300">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <TimeSelect
                                label="Shift Start"
                                value={form.start_at}
                                onChange={(val) => setForm(f => ({ ...f, start_at: val }))}
                                showError={shouldShowError('start_at')}
                                error={errors.start_at}
                            />
                            <TimeSelect
                                label="Shift End"
                                value={form.end_at}
                                onChange={(val) => setForm(f => ({ ...f, end_at: val }))}
                                showError={shouldShowError('end_at')}
                                error={errors.end_at}
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <TimeSelect
                                label="Break Start"
                                value={form.break_start}
                                onChange={(val) => setForm(f => ({ ...f, break_start: val }))}
                                showError={shouldShowError('break_start')}
                                error={errors.break_start}
                            />
                            <TimeSelect
                                label="Break End"
                                value={form.break_end}
                                onChange={(val) => setForm(f => ({ ...f, break_end: val }))}
                                showError={shouldShowError('break_end')}
                                error={errors.break_end}
                            />
                        </div>
                        {errors.break_range && (
                            <div className="p-3 bg-red-50 border border-red-100 rounded-xl flex items-center gap-2">
                                <AlertTriangle className="w-4 h-4 text-red-600" />
                                <p className="text-[10px] text-red-600 font-bold">{errors.break_range}</p>
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Slot Duration (Minutes)</label>
                            <div className="relative">
                                <input
                                    type="number"
                                    value={form.slot_duration}
                                    onChange={(e) => setForm(f => ({ ...f, slot_duration: e.target.value ? parseInt(e.target.value) : '' }))}
                                    className={cn(
                                        "w-full pr-12 pl-4 py-3 bg-gray-50 border rounded-xl text-sm font-bold focus:outline-none transition-all",
                                        shouldShowError('slot_duration') ? "border-red-200 focus:border-red-500 bg-red-50/30" : "border-gray-100 focus:border-primary-500"
                                    )}
                                />
                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-gray-400 uppercase">Min</span>
                            </div>
                            {shouldShowError('slot_duration') && <p className="text-[10px] text-red-500 font-bold px-1 mt-2">{errors.slot_duration}</p>}
                        </div>

                        {shiftInfo && (
                            <div className="space-y-3">
                                <div className="p-4 bg-primary-50 rounded-2xl border border-primary-100 flex items-start gap-3">
                                    <CheckCircle2 className="w-5 h-5 text-primary-600 shrink-0" />
                                    <div>
                                        <p className="text-xs font-bold text-primary-900">Calculated Slots</p>
                                        <p className="text-sm font-black text-primary-600">{shiftInfo.slots} Appointments per day</p>
                                    </div>
                                </div>
                                {shiftInfo.warning && (
                                    <div className="p-4 bg-orange-50 rounded-2xl border border-orange-100 flex items-start gap-3">
                                        <AlertTriangle className="w-5 h-5 text-orange-600 shrink-0" />
                                        <p className="text-xs font-medium text-orange-900 leading-relaxed italic">
                                            "{shiftInfo.warning}"
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>

            <div className="pt-6 border-t border-gray-50 flex flex-col sm:flex-row gap-3">
                <button type="button" onClick={onCancel} className="w-full sm:flex-1 h-12 rounded-2xl font-bold text-gray-500 hover:bg-gray-100 transition-all order-2 sm:order-1">Cancel</button>
                <button
                    type="submit"
                    disabled={isSaving}
                    className="w-full sm:flex-[2] h-12 rounded-2xl bg-primary-600 hover:bg-primary-700 disabled:bg-gray-200 disabled:text-gray-400 disabled:shadow-none text-white font-bold shadow-lg shadow-primary-200 transition-all flex items-center justify-center gap-2 group order-1 sm:order-2"
                >
                    <Save className={cn("w-4 h-4 group-hover:scale-110 transition-transform", isSaving && "animate-spin")} />
                    {isSaving ? "Saving..." : "Update Availability"}
                </button>
            </div>
        </form>
    );
};

export default AvailabilityForm;
