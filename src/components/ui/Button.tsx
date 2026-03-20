import { ReactNode } from "react";
import { cn } from "../../lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "outline" | "ghost";
    size?: "sm" | "md" | "lg";
    loading?: boolean;
    children: ReactNode;
}

export const Button = ({
    variant = "primary",
    size = "md",
    loading,
    className,
    children,
    ...props
}: ButtonProps) => {
    const variants = {
        primary: "bg-primary-600 text-white hover:bg-primary-700 shadow-lg shadow-primary-500/30 disabled:bg-dark-100 disabled:text-dark-400 disabled:shadow-none",
        secondary: "bg-accent-500 text-white hover:bg-accent-600 shadow-lg shadow-accent-500/30 disabled:bg-dark-100 disabled:text-dark-400 disabled:shadow-none",
        outline: "border-2 border-primary-600 text-primary-600 hover:bg-primary-50 disabled:border-dark-100 disabled:text-dark-300",
        ghost: "text-dark-600 hover:bg-dark-100",
    };

    const sizes = {
        sm: "px-4 py-2 text-sm",
        md: "px-6 py-3",
        lg: "px-8 py-4 text-lg",
    };

    return (
        <button
            className={cn(
                "inline-flex items-center justify-center rounded-xl font-bold transition-all active:scale-95 disabled:cursor-not-allowed disabled:scale-100",
                variants[variant],
                sizes[size],
                className
            )}
            disabled={loading || props.disabled}
            {...props}
        >
            {loading && (
                <svg
                    className="mr-2 h-5 w-5 animate-spin text-current"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                >
                    <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                    ></circle>
                    <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                </svg>
            )}
            {children}
        </button>
    );
};
