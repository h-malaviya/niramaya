import { TextareaHTMLAttributes, forwardRef } from "react";
import { cn } from "../../lib/utils";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
    ({ label, error, className, ...props }, ref) => {
        return (
            <div className="flex w-full flex-col gap-1.5">
                {label && (
                    <label className="text-sm font-semibold text-dark-700">
                        {label} {props.required && <span className="text-red-500">*</span>}
                    </label>
                )}
                <div className="relative group">
                    <textarea
                        className={cn(
                            "flex min-h-[120px] w-full rounded-xl border border-dark-200 bg-white px-4 py-2 text-sm ring-offset-white placeholder:text-dark-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/20 focus-visible:border-primary-500 disabled:cursor-not-allowed disabled:opacity-50 transition-all resize-none",
                            error && "border-red-500 focus-visible:ring-red-500/20 focus-visible:border-red-500",
                            className
                        )}
                        ref={ref}
                        {...props}
                    />
                </div>
                {error && <span className="text-xs text-red-500 font-medium">{error}</span>}
            </div>
        );
    }
);

Textarea.displayName = "Textarea";
