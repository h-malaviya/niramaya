import { cn } from "../../lib/utils";

interface BadgeProps {
    children: React.ReactNode;
    onRemove?: (e: React.MouseEvent<HTMLButtonElement>) => void;
    className?: string;
}

export const Badge = ({ children, onRemove, className }: BadgeProps) => {
    return (
        <span
            className={cn(
                "inline-flex items-center gap-1 rounded-full bg-primary-100 px-2.5 py-0.5 text-xs font-semibold text-primary-700",
                className
            )}
        >
            {children}
            {onRemove && (
                <button
                    onClick={onRemove}
                    className="ml-1 inline-flex h-3 w-3 items-center justify-center rounded-full text-primary-400 hover:bg-primary-200 hover:text-primary-500 focus:outline-none"
                >
                    <svg viewBox="0 0 20 20" fill="currentColor" className="h-3 w-3">
                        <path
                            fillRule="evenodd"
                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                            clipRule="evenodd"
                        />
                    </svg>
                </button>
            )}
        </span>
    );
};
