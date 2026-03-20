import React from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '../../lib/utils';

interface SortOption {
    label: string;
    value: string;
}

interface SortDropdownProps {
    options: SortOption[];
    value: string;
    onChange: (value: string) => void;
    className?: string;
}

const SortDropdown: React.FC<SortDropdownProps> = ({
    options,
    value,
    onChange,
    className
}) => {
    return (
        <div className={cn("relative group", className)}>
            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="appearance-none bg-white border border-gray-200 rounded-xl px-4 pr-10 h-full text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 shadow-sm transition-all cursor-pointer w-full sm:w-auto"
            >
                {options.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                        {opt.label}
                    </option>
                ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400 group-focus-within:text-primary-500 transition-colors">
                <ChevronDown className="w-4 h-4" />
            </div>
        </div>
    );
};

export default SortDropdown;
