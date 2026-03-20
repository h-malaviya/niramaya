import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../../lib/utils';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    className?: string;
}

const Pagination: React.FC<PaginationProps> = ({
    currentPage,
    totalPages,
    onPageChange,
    className
}) => {
    if (totalPages <= 1) return null;

    const getPageNumbers = () => {
        const pages: (number | string)[] = [];
        const maxVisible = 7;

        if (totalPages <= maxVisible) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            pages.push(1);
            if (currentPage > 3) pages.push('...');

            let start = Math.max(2, currentPage - 1);
            let end = Math.min(totalPages - 1, currentPage + 1);

            if (currentPage <= 3) end = 4;
            if (currentPage >= totalPages - 2) start = totalPages - 3;

            for (let i = start; i <= end; i++) pages.push(i);

            if (currentPage < totalPages - 2) pages.push('...');
            pages.push(totalPages);
        }
        return pages;
    };

    return (
        <div className={cn("flex items-center justify-center gap-1.5 min-[400px]:gap-3", className)}>
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={Number(currentPage) <= 1}
                className="flex items-center gap-1.5 px-3 min-[400px]:px-4 py-2.5 rounded-2xl border border-gray-100 bg-white text-gray-600 font-bold text-xs hover:bg-gray-50 disabled:opacity-40 disabled:grayscale disabled:cursor-not-allowed transition-all shadow-sm group"
            >
                <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                <span className="hidden min-[400px]:inline">Prev</span>
            </button>

            <div className="flex items-center gap-2">
                {getPageNumbers().map((p, idx) => (
                    typeof p === 'number' ? (
                        <button
                            key={idx}
                            onClick={() => onPageChange(p)}
                            className={cn(
                                "w-9 h-9 min-[400px]:w-11 min-[400px]:h-11 rounded-xl min-[400px]:rounded-2xl flex items-center justify-center text-sm font-black transition-all shadow-sm",
                                Number(p) === Number(currentPage)
                                    ? "bg-primary-600 text-white shadow-lg shadow-primary-200"
                                    : "bg-white text-gray-500 border border-gray-100 hover:border-primary-200 hover:text-primary-600"
                            )}
                        >
                            {p}
                        </button>
                    ) : (
                        <span key={idx} className="w-8 h-11 flex items-center justify-center text-gray-400 font-black">
                            {p}
                        </span>
                    )
                ))}
            </div>

            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={Number(currentPage) >= Number(totalPages)}
                className="flex items-center gap-1.5 px-3 min-[400px]:px-4 py-2.5 rounded-2xl border border-gray-100 bg-white text-gray-600 font-bold text-xs hover:bg-gray-50 disabled:opacity-40 disabled:grayscale disabled:cursor-not-allowed transition-all shadow-sm group"
            >
                <span className="hidden min-[400px]:inline">Next</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
        </div>
    );
};

export default Pagination;
