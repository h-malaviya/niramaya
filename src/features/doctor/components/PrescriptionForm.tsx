import { useState, useEffect } from 'react';
import { Plus, Trash2, Save, X } from 'lucide-react';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Button } from '../../../components/ui/Button';
import {
    DosageUnit,
    MealTiming,
    IPrescriptionItem,
    ICreatePrescriptionRequest
} from '../types/prescription.types';
import { prescriptionService } from '../services/prescription.service';
import { toast } from 'react-hot-toast';
import { cn } from '../../../lib/utils';
interface PrescriptionFormProps {
    appointmentId: string;
    onSuccess: () => void;
    onCancel: () => void;
}

const INITIAL_ITEM: Omit<IPrescriptionItem, 'id'> = {
    medicine_name: '',
    dosage_value: 1,
    dosage_unit: DosageUnit.TABLET,
    morning: true,
    afternoon: false,
    night: true,
    timing: MealTiming.AFTER_MEAL,
    total_quantity: 10,
    note: ''
};

export const PrescriptionForm = ({
    appointmentId,
    onSuccess,
    onCancel
}: PrescriptionFormProps) => {
    const [items, setItems] = useState<Omit<IPrescriptionItem, 'id'>[]>([INITIAL_ITEM]);
    const [loading, setLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true);
    const [internalMode, setInternalMode] = useState<'create' | 'update'>('create');

    useEffect(() => {
        fetchExistingPrescription();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [appointmentId]);

    const fetchExistingPrescription = async () => {
        try {
            setIsFetching(true);
            const data = await prescriptionService.getPrescriptionByAppointment(appointmentId);
            if (data && data.items) {
                // Ensure we strip internal IDs if any, matching our ICreate/Update request type
                setInternalMode('update');
                setItems(data.items.map((item: IPrescriptionItem) => ({
                    medicine_name: item.medicine_name,
                    dosage_value: item.dosage_value,
                    dosage_unit: item.dosage_unit,
                    morning: item.morning,
                    afternoon: item.afternoon,
                    night: item.night,
                    timing: item.timing,
                    total_quantity: item.total_quantity,
                    note: item.note
                })));
            }
        } catch (error) {
            const err = error as { response?: { status?: number, data?: { message?: string } } };
            // A 404 means no prescription exists, stay in create mode
            if (err.response?.status !== 404) {
                console.error("Failed to fetch prescription:", err);
                toast.error(err.response?.data?.message || "Failed to load existing prescription");
            }
        } finally {
            setIsFetching(false);
        }
    };

    const handleAddRow = () => {
        setItems([...items, { ...INITIAL_ITEM }]);
    };

    const handleDeleteRow = (index: number) => {
        if (items.length === 1) {
            toast.error("At least one medicine is required");
            return;
        }
        setItems(items.filter((_, i) => i !== index));
    };

    const handleUpdateItem = <K extends keyof Omit<IPrescriptionItem, 'id'>>(index: number, field: K, value: Omit<IPrescriptionItem, 'id'>[K]) => {
        const newItems = [...items];
        newItems[index] = { ...newItems[index], [field]: value };
        setItems(newItems);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validation
        const isValid = items.every(item =>
            item.medicine_name.trim() !== '' &&
            item.dosage_value > 0 &&
            item.total_quantity > 0 &&
            (item.morning || item.afternoon || item.night)
        );

        if (!isValid) {
            toast.error("Please fill all required fields and select at least one schedule for each medicine");
            return;
        }

        try {
            setLoading(true);
            const payload: ICreatePrescriptionRequest = { items };

            if (internalMode === 'create') {
                await prescriptionService.createPrescription(appointmentId, payload);
                toast.success("Prescription created successfully");
            } else {
                await prescriptionService.updatePrescription(appointmentId, payload);
                toast.success("Prescription updated successfully");
            }
            onSuccess();
        } catch (error) {
            const err = error as { response?: { data?: { message?: string } } };
            toast.error(err.response?.data?.message || `Failed to ${internalMode} prescription`);
        } finally {
            setLoading(false);
        }
    };

    if (isFetching) {
        return (
            <div className="flex justify-center items-center p-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-white rounded-2xl border border-dark-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-dark-50 border-b border-dark-100">
                                <th className="px-3 py-3 text-xs font-bold text-dark-500 uppercase tracking-wider w-[20%] min-w-[120px]">Medicine Name</th>
                                <th className="px-3 py-3 text-xs font-bold text-dark-500 uppercase tracking-wider w-[120px]">Schedule</th>
                                <th className="px-3 py-3 text-xs font-bold text-dark-500 uppercase tracking-wider w-[180px]">Dosage</th>
                                <th className="px-3 py-3 text-xs font-bold text-dark-500 uppercase tracking-wider w-[130px]">Timing</th>
                                <th className="px-3 py-3 text-xs font-bold text-dark-500 uppercase tracking-wider w-[80px]">Total Qty</th>
                                <th className="px-3 py-3 text-xs font-bold text-dark-500 uppercase tracking-wider w-[20%] min-w-[100px]">Note</th>
                                <th className="px-3 py-3 text-xs font-bold text-dark-500 uppercase tracking-wider w-[50px]"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-dark-100">
                            {items.map((item, index) => (
                                <tr key={index} className="hover:bg-dark-50/50 transition-colors">
                                    <td className="px-3 py-3">
                                        <Input
                                            value={item.medicine_name}
                                            onChange={(e) => handleUpdateItem(index, 'medicine_name', e.target.value)}
                                            placeholder="e.g. Paracetamol"
                                            className="h-10 text-xs w-full"
                                            required
                                        />
                                    </td>
                                    <td className="px-3 py-3">
                                        <div className="flex gap-1">
                                            {(['morning', 'afternoon', 'night'] as const).map((field) => {
                                                const label = field === 'morning' ? 'M' : field === 'afternoon' ? 'A' : 'N';
                                                return (
                                                    <button
                                                        key={field}
                                                        type="button"
                                                        onClick={() => handleUpdateItem(index, field, !item[field])}
                                                        className={cn(
                                                            "w-8 h-8 rounded-lg text-xs font-bold transition-all border shrink-0",
                                                            item[field]
                                                                ? "bg-primary-600 border-primary-600 text-white"
                                                                : "bg-white border-dark-200 text-dark-400 hover:border-dark-300"
                                                        )}
                                                    >
                                                        {label}
                                                    </button>
                                                )
                                            })}
                                        </div>
                                    </td>
                                    <td className="px-3 py-3">
                                        <div className="flex gap-1 items-center">
                                            <Input
                                                type="number"
                                                step="0.1"
                                                value={item.dosage_value}
                                                onChange={(e) => handleUpdateItem(index, 'dosage_value', parseFloat(e.target.value))}
                                                className="h-10 w-16 text-xs px-2 shrink-0"
                                                required
                                            />
                                            <Select
                                                value={item.dosage_unit}
                                                onChange={(e) => handleUpdateItem(index, 'dosage_unit', e.target.value as DosageUnit)}
                                                options={Object.values(DosageUnit)
                                                    .map(unit => ({ label: unit.charAt(0) + unit.slice(1).toLowerCase(), value: unit }))
                                                    .sort((a, b) => a.label.localeCompare(b.label))
                                                }
                                                className="h-10 text-xs px-2 pr-8 shrink-0 flex-1 min-w-[90px]"
                                            />
                                        </div>
                                    </td>
                                    <td className="px-3 py-3">
                                        <Select
                                            value={item.timing}
                                            onChange={(e) => handleUpdateItem(index, 'timing', e.target.value as MealTiming)}
                                            options={[
                                                { label: 'After Meal', value: MealTiming.AFTER_MEAL },
                                                { label: 'Before Meal', value: MealTiming.BEFORE_MEAL },
                                                { label: 'With Meal', value: MealTiming.WITH_MEAL },
                                            ].sort((a, b) => a.label.localeCompare(b.label))}
                                            className="h-10 text-xs w-full min-w-[110px] px-2 pr-8 shrink-0"
                                        />
                                    </td>
                                    <td className="px-3 py-3">
                                        <Input
                                            type="number"
                                            value={item.total_quantity}
                                            onChange={(e) => handleUpdateItem(index, 'total_quantity', parseInt(e.target.value))}
                                            className="h-10 w-16 text-xs px-2 shrink-0"
                                            required
                                        />
                                    </td>
                                    <td className="px-3 py-3">
                                        <Input
                                            value={item.note}
                                            onChange={(e) => handleUpdateItem(index, 'note', e.target.value)}
                                            placeholder="Optional note"
                                            className="h-10 text-xs w-full min-w-[100px]"
                                        />
                                    </td>
                                    <td className="px-3 py-3">
                                        <button
                                            type="button"
                                            onClick={() => handleDeleteRow(index)}
                                            className="p-2 text-dark-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                            title="Remove medicine"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="p-4 bg-dark-50/50 border-t border-dark-100">
                    <button
                        type="button"
                        onClick={handleAddRow}
                        className="flex items-center gap-2 text-sm font-bold text-primary-600 hover:text-primary-700 transition-colors"
                    >
                        <Plus size={18} />
                        Add Another Medicine
                    </button>
                </div>
            </div>

            <div className="flex justify-end gap-3">
                <Button
                    type="button"
                    variant="ghost"
                    onClick={onCancel}
                    className="flex items-center gap-2"
                >
                    <X size={18} />
                    Cancel
                </Button>
                <Button
                    type="submit"
                    loading={loading}
                    className="flex items-center gap-2"
                >
                    <Save size={18} />
                    {internalMode === 'create' ? 'Issue Prescription' : 'Update Prescription'}
                </Button>
            </div>
        </form>
    );
};
