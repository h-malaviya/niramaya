import { cn } from "../../lib/utils";

interface CardProps {
    children: React.ReactNode;
    className?: string;
    onClick?: () => void;
    selected?: boolean;
}

export const Card = ({ children, className, onClick, selected }: CardProps) => {
    return (
        <div
            onClick={onClick}
            className={cn(
                "p-6 rounded-2xl border-2 transition-all cursor-pointer bg-white shadow-sm hover:shadow-md",
                selected
                    ? "border-primary-600 bg-primary-50/50 ring-4 ring-primary-500/10 scale-[1.02]"
                    : "border-dark-100 hover:border-primary-300 hover:bg-primary-50/10",
                className
            )}
        >
            {children}
        </div>
    );
};
