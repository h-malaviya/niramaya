import { SelectHTMLAttributes, forwardRef } from "react";
import { cn } from "../../lib/utils";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    error?: string;
    options: { label: string; value: string | number }[];
    placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
    ({ label, error, options, placeholder, className, ...props }, ref) => {
        return (
            <div className="flex w-full flex-col gap-1.5">
                {label && (
                    <label className="text-sm font-semibold text-dark-700">
                        {label} {props.required && <span className="text-red-500">*</span>}
                    </label>
                )}
                <div className="relative">
                    <select
                        className={cn(
                            "flex h-11 w-full rounded-xl border border-dark-200 bg-white px-4 pr-10 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/20 focus-visible:border-primary-500 disabled:cursor-not-allowed disabled:opacity-50 transition-all appearance-none",
                            error && "border-red-500 focus-visible:ring-red-500/20 focus-visible:border-red-500",
                            className
                        )}
                        ref={ref}
                        {...props}
                    >
                        {placeholder && <option value="" disabled>{placeholder}</option>}
                        {options.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                                {opt.label}
                            </option>
                        ))}
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-dark-400">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>
                </div>
                {error && <span className="text-xs text-red-500 font-medium">{error}</span>}
            </div>
        );
    }
);

Select.displayName = "Select";
