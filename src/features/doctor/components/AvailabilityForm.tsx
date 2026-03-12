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

const TimeSelect: React.FC<{
    value: string;
    onChange: (val: string) => void;
    label: string;
    error?: string;
}> = ({ value, onChange, label, error }) => {
    // Handle empty initial value (clash)
    const [h, m] = value ? value.split(':') : ['', ''];
    const [localH, setLocalH] = useState(h);
    const [localM, setLocalM] = useState(m);

    // Sync with external value changes
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
        // Only pad if something was actually typed
        if (!localH && !localM) return;

        let finalH = localH.padStart(2, '0');
        let finalM = localM.padStart(2, '0');

        if (parseInt(finalH) > 23) finalH = "23";
        if (parseInt(finalM) > 59) finalM = "59";

        setLocalH(finalH);
        setLocalM(finalM);
        onChange(`${finalH}:${finalM}`);
    };

    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between pl-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{label}</label>
                <span className="text-[9px] font-bold text-primary-400 bg-primary-50 px-2 py-0.5 rounded-md border border-primary-100 uppercase tracking-tighter">24H format</span>
            </div>
            <div className={cn(
                "flex items-center justify-center gap-1.5 px-4 py-3 bg-gray-50 border rounded-xl transition-all group",
                error ? "border-red-200 focus-within:border-red-500 bg-red-50/30" : "border-gray-100 focus-within:border-primary-500"
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
            </div>
            {error && <p className="text-[10px] text-red-500 font-bold px-1">{error}</p>}
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

    // Detect conflicts and set initial state
    useEffect(() => {
        if (selectedAvails.length === 0) return;

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
                }
                if (breakStartMins <= startMins || breakEndMins >= endMins) {
                    newErrors.break_range = "Break must be strictly within working hours (cannot be at the start or end of shift)";
                }

                // Slot duration validation: cannot exceed shortest segment
                if (!newErrors.break_range && !newErrors.break_end && form.slot_duration !== '') {
                    const durationBeforeBreak = breakStartMins - startMins;
                    const durationAfterBreak = endMins - breakEndMins;
                    const maxSlotDuration = Math.min(durationBeforeBreak, durationAfterBreak);

                    if (Number(form.slot_duration) > maxSlotDuration) {
                        newErrors.slot_duration = `Cannot exceed ${maxSlotDuration} min (shortest segment)`;
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
                // Segment 1: Before Break
                const seg1Mins = bStart - startMin;
                const seg1Slots = Math.floor(seg1Mins / durationNum);
                slots += seg1Slots;

                // Segment 2: After Break
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
        if (Object.keys(errors).length === 0) {
            onSave({
                ...form,
                dates: selectedDates,
                slot_duration: Number(form.slot_duration)
            });
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 space-y-8 animate-in slide-in-from-right-4 duration-300">
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
                {/* Active Toggle */}
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
                        {/* Working Hours */}
                        <div className="grid grid-cols-2 gap-4">
                            <TimeSelect
                                label="Shift Start"
                                value={form.start_at}
                                onChange={(val) => setForm(f => ({ ...f, start_at: val }))}
                                error={errors.start_at}
                            />
                            <TimeSelect
                                label="Shift End"
                                value={form.end_at}
                                onChange={(val) => setForm(f => ({ ...f, end_at: val }))}
                                error={errors.end_at}
                            />
                        </div>

                        {/* Break Hours */}
                        <div className="grid grid-cols-2 gap-4">
                            <TimeSelect
                                label="Break Start"
                                value={form.break_start}
                                onChange={(val) => setForm(f => ({ ...f, break_start: val }))}
                                error={errors.break_start}
                            />
                            <TimeSelect
                                label="Break End"
                                value={form.break_end}
                                onChange={(val) => setForm(f => ({ ...f, break_end: val }))}
                                error={errors.break_end}
                            />
                        </div>
                        {errors.break_range && (
                            <div className="p-3 bg-red-50 border border-red-100 rounded-xl flex items-center gap-2">
                                <AlertTriangle className="w-4 h-4 text-red-600" />
                                <p className="text-[10px] text-red-600 font-bold">{errors.break_range}</p>
                            </div>
                        )}

                        {/* Slot Duration */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Slot Duration (Minutes)</label>
                            <div className="relative">
                                <input
                                    type="number"
                                    value={form.slot_duration}
                                    onChange={(e) => setForm(f => ({ ...f, slot_duration: e.target.value ? parseInt(e.target.value) : '' }))}
                                    className={cn(
                                        "w-full pr-12 pl-4 py-3 bg-gray-50 border rounded-xl text-sm font-bold focus:outline-none transition-all",
                                        errors.slot_duration ? "border-red-200 focus:border-red-500 bg-red-50/30" : "border-gray-100 focus:border-primary-500"
                                    )}
                                />
                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-gray-400 uppercase">Min</span>
                            </div>
                            {errors.slot_duration && <p className="text-[10px] text-red-500 font-bold px-1 mt-2">{errors.slot_duration}</p>}
                        </div>

                        {/* Summary & Warnings */}
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

            <div className="pt-6 border-t border-gray-50 flex gap-3">
                <button
                    type="button"
                    onClick={onCancel}
                    className="flex-1 h-12 rounded-2xl font-bold text-gray-500 hover:bg-gray-100 transition-all"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={isSaving || Object.keys(errors).length > 0}
                    className="flex-[2] h-12 rounded-2xl bg-primary-600 hover:bg-primary-700 disabled:bg-gray-200 disabled:text-gray-400 disabled:shadow-none text-white font-bold shadow-lg shadow-primary-200 transition-all flex items-center justify-center gap-2 group"
                >
                    <Save className={cn("w-4 h-4 group-hover:scale-110 transition-transform", isSaving && "animate-spin")} />
                    {isSaving ? "Saving..." : "Update Availability"}
                </button>
            </div>
        </form>
    );
};

export default AvailabilityForm;
