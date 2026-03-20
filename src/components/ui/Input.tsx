import { InputHTMLAttributes, forwardRef, useState, useEffect } from "react";
import { cn } from "../../lib/utils";
import { Eye, EyeOff } from "lucide-react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    prefix?: string;
    icon?: React.ReactNode;
    iconPosition?: "left" | "right";
    rightElement?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ label, error, prefix, icon, iconPosition = "right", rightElement, className, type, ...props }, ref) => {
        const [showPassword, setShowPassword] = useState(false);
        const [hasValue, setHasValue] = useState(Boolean(props.value || props.defaultValue));
        
        const isPassword = type === "password";
        const inputType = isPassword ? (showPassword ? "text" : "password") : type;

        // Sync with external value changes if controlled
        useEffect(() => {
            if (props.value !== undefined) {
                setHasValue(String(props.value).length > 0);
                if (String(props.value).length === 0) {
                    setShowPassword(false);
                }
            }
        }, [props.value]);

        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            const val = e.target.value;
            setHasValue(val.length > 0);
            if (val.length === 0) {
                setShowPassword(false);
            }
            if (props.onChange) {
                props.onChange(e);
            }
        };

        return (
            <div className="flex w-full flex-col gap-1.5">
                {label && (
                    <label className="text-sm font-semibold text-dark-700">
                        {label} {props.required && <span className="text-red-500">*</span>}
                    </label>
                )}
                <div className="relative flex items-center group">
                    {prefix && (
                        <span className={cn(
                            "absolute text-sm text-dark-500 border-r border-dark-200 pr-2 h-full flex items-center z-10 transition-all",
                            icon && iconPosition === "left" ? "left-10" : "left-3"
                        )}>
                            {prefix}
                        </span>
                    )}

                    {icon && iconPosition === "left" && (
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-400 group-focus-within:text-primary-500 transition-colors z-10">
                            {icon}
                        </div>
                    )}

                    <input
                        type={inputType}
                        className={cn(
                            "flex h-11 w-full rounded-xl border border-dark-200 bg-white px-4 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-dark-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/20 focus-visible:border-primary-500 disabled:cursor-not-allowed disabled:opacity-50 transition-all",
                            error && "border-red-500 focus-visible:ring-red-500/20 focus-visible:border-red-500",
                            prefix && !icon && "!pl-[4.5rem]",
                            icon && iconPosition === "left" && !prefix && "!pl-[3rem]",
                            icon && iconPosition === "left" && prefix && "!pl-[6.4rem]",
                            icon && iconPosition === "right" && !isPassword && !rightElement && "!pr-[3rem]",
                            icon && iconPosition === "right" && (isPassword || rightElement) && "!pr-[5.5rem]",
                            rightElement && !icon && "!pr-[5.5rem]",
                            className
                        )}
                        ref={ref}
                        {...props}
                        onChange={handleChange}
                    />

                    {(icon && iconPosition === "right") && (
                        <div className={cn(
                            "absolute top-1/2 -translate-y-1/2 text-dark-400 group-focus-within:text-primary-500 transition-colors",
                            (isPassword && hasValue) || rightElement ? "right-10" : "right-3"
                        )}>
                            {icon}
                        </div>
                    )}

                    {rightElement && (
                        <div className="absolute right-1.5 top-1/2 -translate-y-1/2 z-20">
                            {rightElement}
                        </div>
                    )}

                    {isPassword && hasValue && (
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className={cn(
                                "absolute top-1/2 -translate-y-1/2 text-dark-400 hover:text-dark-600 focus:outline-none transition-colors",
                                rightElement ? "right-10" : "right-3"
                            )}
                        >
                            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                    )}
                </div>
                {error && <span className="text-xs text-red-500 font-medium">{error}</span>}
            </div>
        );
    }
);

Input.displayName = "Input";
