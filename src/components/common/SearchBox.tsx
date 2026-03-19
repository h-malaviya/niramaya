import React, { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { cn } from '../../lib/utils';

interface SearchBoxProps {
    placeholder?: string;
    initialValue?: string;
    onSearch: (value: string) => void;
    className?: string;
}

const SearchBox: React.FC<SearchBoxProps> = ({
    placeholder = "Search...",
    initialValue = "",
    onSearch,
    className
}) => {
    const [value, setValue] = useState(initialValue);

    useEffect(() => {
        setValue(initialValue);
    }, [initialValue]);

    const handleClear = () => {
        setValue("");
        onSearch("");
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        setValue(newValue);
        onSearch(newValue);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            onSearch(value);
        }
    };

    return (
        <div className={cn("relative group flex items-center", className)}>
            <div className="absolute left-4 z-10 pointer-events-none flex items-center justify-center">
                <Search className="h-4.5 w-4.5 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
            </div>
            <input
                type="text"
                value={value}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                className="block w-full pl-10 pr-10 h-full border border-gray-200 rounded-xl leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 sm:text-sm transition-all shadow-sm"
                placeholder={placeholder}
            />
            {value && (
                <button
                    onClick={handleClear}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                >
                    <X className="h-4 w-4" />
                </button>
            )}
        </div>
    );
};

export default SearchBox;
