import { InputHTMLAttributes, forwardRef } from "react";
import { cn } from "../../lib/utils";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    prefix?: string;
    icon?: React.ReactNode;
    iconPosition?: "left" | "right";
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ label, error, prefix, icon, iconPosition = "right", className, ...props }, ref) => {
        return (
            <div className="flex w-full flex-col gap-1.5">
                {label && (
                    <label className="text-sm font-semibold text-dark-700">
                        {label} {props.required && <span className="text-red-500">*</span>}
                    </label>
                )}
                <div className="relative flex items-center group">
                    {prefix && (
                        <span className="absolute left-3 text-sm text-dark-500 border-r border-dark-200 pr-2 h-full flex items-center z-10">
                            {prefix}
                        </span>
                    )}

                    {icon && iconPosition === "left" && (
                        <div className="absolute left-3 text-dark-400 group-focus-within:text-primary-500 transition-colors z-10">
                            {icon}
                        </div>
                    )}

                    <input
                        className={cn(
                            "flex h-11 w-full rounded-xl border border-dark-200 bg-white px-4 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-dark-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/20 focus-visible:border-primary-500 disabled:cursor-not-allowed disabled:opacity-50 transition-all",
                            error && "border-red-500 focus-visible:ring-red-500/20 focus-visible:border-red-500",
                            prefix && "!pl-[4.5rem]",
                            icon && iconPosition === "left" && !prefix && "!pl-[3rem]",
                            icon && iconPosition === "left" && prefix && "!pl-[6rem]",
                            icon && iconPosition === "right" && "!pr-[3rem]",
                            className
                        )}
                        ref={ref}
                        {...props}
                    />

                    {icon && iconPosition === "right" && (
                        <div className="absolute right-3 text-dark-400 group-focus-within:text-primary-500 transition-colors">
                            {icon}
                        </div>
                    )}
                </div>
                {error && <span className="text-xs text-red-500 font-medium">{error}</span>}
            </div>
        );
    }
);

Input.displayName = "Input";
