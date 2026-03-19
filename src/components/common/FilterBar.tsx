import React, { useState, useEffect } from 'react';
import { Filter, Star, Info, Check } from 'lucide-react';
import { cn } from '../../lib/utils';
import { MultiSelect } from '../ui/MultiSelect';

interface FilterGroup {
    name: string;
    label: string;
    type: 'select' | 'checkbox' | 'range' | 'rating' | 'radio' | 'multiselect';
    options?: { label: string; value: string }[];
    min?: number;
    max?: number;
    step?: number;
    prefix?: string;
}

interface FilterBarProps {
    groups: FilterGroup[];
    selectedFilters: Record<string, any>;
    onApply: (filters: Record<string, any>) => void;
    onClearAll: () => void;
    className?: string;
}

const FilterBar: React.FC<FilterBarProps> = ({
    groups,
    selectedFilters,
    onApply,
    onClearAll,
    className
}) => {
    const [localFilters, setLocalFilters] = useState(selectedFilters);

    useEffect(() => {
        setLocalFilters(selectedFilters);
    }, [selectedFilters]);

    const handleLocalChange = (name: string, value: any) => {
        setLocalFilters(prev => ({ ...prev, [name]: value }));
    };

    const isFeeInvalid = (localFilters.minFee !== '' && Number(localFilters.minFee) < 10) ||
        (localFilters.maxFee !== '' && Number(localFilters.maxFee) > 1000000) ||
        (localFilters.minFee !== '' && localFilters.maxFee !== '' && Number(localFilters.minFee) > Number(localFilters.maxFee));

    const handleApply = () => {
        if (isFeeInvalid) return;

        const validatedFilters = { ...localFilters };

        // Ensure values are numbers before sending up
        if (validatedFilters.minFee === '' || validatedFilters.minFee === undefined) validatedFilters.minFee = 10;
        if (validatedFilters.maxFee === '' || validatedFilters.maxFee === undefined) validatedFilters.maxFee = 1000000;

        onApply(validatedFilters);
    };

    const handleReset = () => {
        onClearAll();
    };

    return (
        <div className={cn("bg-white rounded-3xl border border-gray-100 shadow-sm p-7 space-y-8 h-fit sticky top-28", className)}>
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                    <div className="p-2 bg-primary-50 rounded-xl">
                        <Filter className="w-4 h-4 text-primary-600" />
                    </div>
                    <h3 className="font-bold text-gray-800 text-base">Filter Doctors</h3>
                </div>
                <button
                    onClick={handleReset}
                    className="text-xs font-bold text-primary-600 hover:text-primary-700 transition-colors bg-primary-50/50 hover:bg-primary-50 px-2.5 py-1.5 rounded-lg"
                >
                    Reset
                </button>
            </div>

            <div className="space-y-8">
                {groups.map((group) => (
                    <div key={group.name} className="space-y-4">
                        <div className="flex items-center justify-between">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">
                                {group.label}
                            </label>
                            {group.type === 'range' && group.name !== 'feeRange' && (
                                <span className="text-xs font-bold text-primary-600">
                                    {(localFilters[group.name] ?? group.min)}{group.name === 'minExperience' ? '+' : ''} {group.prefix || ""}
                                </span>
                            )}
                        </div>

                        {group.type === 'select' ? (
                            <div className="relative">
                                <select
                                    value={localFilters[group.name] || ""}
                                    onChange={(e) => handleLocalChange(group.name, e.target.value)}
                                    className="block w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary-500/10 focus:border-primary-500 appearance-none transition-all cursor-pointer"
                                >
                                    <option value="">All {group.label === 'Specialty' ? 'Specialties' : group.label + 's'}</option>
                                    {group.options?.map((opt) => (
                                        <option key={opt.value} value={opt.value}>
                                            {opt.label.replace(/_/g, ' ')}
                                        </option>
                                    ))}
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-400">
                                    <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </div>
                        ) : group.type === 'multiselect' ? (
                            <MultiSelect
                                placeholder={`Select ${group.label}`}
                                options={group.options || []}
                                value={(localFilters[group.name] as (string | number)[]) || []}
                                onChange={(values) => handleLocalChange(group.name, values)}
                            />
                        ) : group.name === 'feeRange' ? (
                            <div className="space-y-3">
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-1.5">
                                        <label className="text-[8px] font-bold text-gray-400 uppercase tracking-tighter">Min Fee</label>
                                        <div className="relative">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-gray-400">₹</span>
                                            <input
                                                type="number"
                                                value={localFilters.minFee ?? ''}
                                                onChange={(e) => handleLocalChange('minFee', e.target.value)}
                                                placeholder="Min"
                                                className={cn(
                                                    "w-full pl-6 pr-3 py-2.5 bg-gray-50 border rounded-xl text-[10px] font-bold focus:outline-none transition-all placeholder:text-gray-300",
                                                    (localFilters.minFee !== '' && (Number(localFilters.minFee) < 10 || Number(localFilters.minFee) > (Number(localFilters.maxFee) || 1000000)))
                                                        ? "border-red-200 focus:border-red-500 bg-red-50/30"
                                                        : "border-gray-100 focus:border-primary-500"
                                                )}
                                            />
                                        </div>
                                        {localFilters.minFee !== '' && Number(localFilters.minFee) < 10 && (
                                            <p className="text-[8px] text-red-500 font-bold mt-1">Min ₹10</p>
                                        )}
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[8px] font-bold text-gray-400 uppercase tracking-tighter">Max Fee</label>
                                        <div className="relative">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-gray-400">₹</span>
                                            <input
                                                type="number"
                                                value={localFilters.maxFee ?? ''}
                                                onChange={(e) => handleLocalChange('maxFee', e.target.value)}
                                                placeholder="Max"
                                                className={cn(
                                                    "w-full pl-6 pr-3 py-2.5 bg-gray-50 border rounded-xl text-[10px] font-bold focus:outline-none transition-all placeholder:text-gray-300",
                                                    (localFilters.maxFee !== '' && (Number(localFilters.maxFee) > 1000000 || Number(localFilters.maxFee) < (Number(localFilters.minFee) || 10)))
                                                        ? "border-red-200 focus:border-red-500 bg-red-50/30"
                                                        : "border-gray-100 focus:border-primary-500"
                                                )}
                                            />
                                        </div>
                                        {localFilters.maxFee !== '' && Number(localFilters.maxFee) > 1000000 && (
                                            <p className="text-[8px] text-red-500 font-bold mt-1">Max ₹1M</p>
                                        )}
                                    </div>
                                </div>
                                {localFilters.minFee !== '' && localFilters.maxFee !== '' && Number(localFilters.minFee) > Number(localFilters.maxFee) && (
                                    <p className="text-[9px] text-red-500 font-bold">Min cannot exceed Max</p>
                                )}
                            </div>
                        ) : group.type === 'range' ? (
                            <div className="px-1">
                                <input
                                    type="range"
                                    min={group.min}
                                    max={group.max}
                                    step={group.step || 1}
                                    value={localFilters[group.name] ?? group.min}
                                    onChange={(e) => handleLocalChange(group.name, Number(e.target.value))}
                                    className="range range-primary h-1.5 range-xs"
                                />
                                <div className="flex justify-between mt-2">
                                    <span className="text-[10px] text-gray-400 font-bold">{group.min}{group.prefix || ""}</span>
                                    <span className="text-[10px] text-gray-400 font-bold">{group.max}{group.prefix || ""}</span>
                                </div>
                            </div>
                        ) : group.type === 'rating' ? (
                            <div className="grid grid-cols-4 gap-1.5">
                                {[4, 3, 2, 1].map((rating) => (
                                    <button
                                        key={rating}
                                        type="button"
                                        onClick={() => handleLocalChange(group.name, rating)}
                                        className={cn(
                                            "flex flex-col items-center justify-center gap-1 p-2 rounded-xl border transition-all",
                                            localFilters[group.name] === rating
                                                ? "bg-primary-600 border-primary-600 text-white shadow-md shadow-primary-200"
                                                : "bg-white border-gray-100 text-gray-600 hover:border-primary-200"
                                        )}
                                    >
                                        <span className="text-[10px] font-black">{rating}+</span>
                                        <Star className={cn("w-2.5 h-2.5", localFilters[group.name] === rating ? "fill-white" : "fill-yellow-400 text-yellow-400")} />
                                    </button>
                                ))}
                            </div>
                        ) : (group.type === 'checkbox' || group.type === 'radio') ? (
                            <div className="grid grid-cols-1 gap-2">
                                {group.options?.map((opt) => (
                                    <label key={opt.value} className={cn(
                                        "flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all hover:bg-gray-50",
                                        localFilters[group.name] === opt.value ? "bg-primary-50 border-primary-200 shadow-sm" : "bg-white border-gray-100"
                                    )}>
                                        <input
                                            type={group.type === 'radio' ? 'radio' : 'checkbox'}
                                            name={`${group.name}-${className || 'sidebar'}`}
                                            checked={
                                                group.type === 'radio'
                                                    ? localFilters[group.name] === opt.value
                                                    : Array.isArray(localFilters[group.name]) && (localFilters[group.name] as any).includes(opt.value)
                                            }
                                            onChange={() => handleLocalChange(group.name, opt.value)}
                                            className={group.type === 'radio' ? "radio radio-primary radio-xs" : "checkbox checkbox-primary checkbox-xs"}
                                        />
                                        <span className={cn(
                                            "text-xs font-bold",
                                            localFilters[group.name] === opt.value ? "text-primary-700" : "text-gray-600"
                                        )}>
                                            {opt.label}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        ) : null}
                    </div>
                ))}
            </div>

            <div className="pt-2 border-t border-gray-50 flex flex-col gap-4">
                <button
                    onClick={handleApply}
                    disabled={isFeeInvalid}
                    className={cn(
                        "w-full h-12 rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2 group",
                        isFeeInvalid
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                            : "bg-primary-600 hover:bg-primary-700 text-white shadow-lg shadow-primary-200"
                    )}
                >
                    <Check className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    Apply Filters
                </button>

                <div className="bg-primary-50 rounded-2xl p-4 border border-primary-100/50 flex gap-3">
                    <Info className="w-4 h-4 text-primary-600 shrink-0 mt-0.5" />
                    <p className="text-[10px] leading-relaxed text-primary-700 font-medium font-inter">
                        Need more specific help? Try searching by doctor name or qualification.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default FilterBar;
