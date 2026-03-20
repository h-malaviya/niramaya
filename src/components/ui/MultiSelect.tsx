import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Search, ChevronDown, Check, X } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Badge } from './Badge';

interface MultiSelectProps {
  label?: string;
  placeholder?: string;
  options: { label: string; value: string | number }[];
  value: (string | number)[];
  onChange: (value: (string | number)[]) => void;
  error?: string;
  className?: string;
  required?: boolean;
}

export const MultiSelect: React.FC<MultiSelectProps> = ({
  label,
  placeholder = "Select options...",
  options,
  value,
  onChange,
  error,
  className,
  required
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredOptions = useMemo(() => {
    return options.filter(opt => 
      opt.label.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [options, searchQuery]);

  const toggleOption = (optionValue: string | number) => {
    const newValue = value.includes(optionValue)
      ? value.filter(v => v !== optionValue)
      : [...value, optionValue];
    onChange(newValue);
  };

  const removeOption = (optionValue: string | number) => {
    onChange(value.filter(v => v !== optionValue));
  };

  return (
    <div className={cn("flex w-full flex-col gap-1.5", className)} ref={containerRef}>
      {label && (
        <label className="text-sm font-semibold text-dark-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      <div className="relative">
        {/* Trigger / Selected Items display */}
        <div
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "flex min-h-[44px] w-full flex-wrap items-center gap-2 rounded-xl border border-dark-200 bg-white px-4 py-2 text-sm transition-all cursor-pointer ring-offset-white focus-within:ring-2 focus-within:ring-primary-500/20 focus-within:border-primary-500",
            isOpen && "ring-2 ring-primary-500/20 border-primary-500",
            error && "border-red-500 focus-within:ring-red-500/20 focus-within:border-red-500"
          )}
        >
          {value.length > 0 ? (
            <div className="flex flex-wrap gap-1.5 flex-1">
              {value.map(val => {
                const option = options.find(o => o.value === val);
                return (
                  <Badge 
                    key={val} 
                    onRemove={(e: React.MouseEvent) => {
                      e.stopPropagation();
                      removeOption(val);
                    }}
                    className="bg-primary-50 text-primary-700 border-primary-100 py-0.5 px-2 text-[11px]"
                  >
                    {option?.label || val}
                  </Badge>
                );
              })}
            </div>
          ) : (
            <span className="text-dark-400 flex-1">{placeholder}</span>
          )}
          
          <ChevronDown 
            className={cn(
              "w-4 h-4 text-dark-400 transition-transform duration-200 shrink-0",
              isOpen && "rotate-180"
            )} 
          />
        </div>

        {/* Dropdown Menu */}
        {isOpen && (
          <div className="absolute z-50 mt-2 w-full bg-white border border-dark-100 rounded-2xl shadow-xl shadow-dark-200/50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Search Input */}
            <div className="p-3 border-b border-dark-50 sticky top-0 bg-white z-10">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-dark-400" />
                <input
                  type="text"
                  autoFocus
                  className="w-full bg-dark-50 border-none rounded-lg pl-9 pr-4 py-2 text-xs focus:ring-1 focus:ring-primary-500 outline-none placeholder:text-dark-300"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                />
                {searchQuery && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSearchQuery("");
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-400 hover:text-dark-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>

            {/* Options List */}
            <div className="max-h-60 overflow-y-auto py-1 custom-scrollbar">
              {filteredOptions.length > 0 ? (
                filteredOptions.map((option) => {
                  const isSelected = value.includes(option.value);
                  return (
                    <div
                      key={option.value}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleOption(option.value);
                      }}
                      className={cn(
                        "flex items-center gap-3 px-4 py-2.5 text-sm cursor-pointer transition-colors hover:bg-dark-50",
                        isSelected && "bg-primary-50 text-primary-700 hover:bg-primary-100"
                      )}
                    >
                      <div className={cn(
                        "w-4 h-4 rounded border border-dark-300 flex items-center justify-center transition-all",
                        isSelected && "bg-primary-600 border-primary-600"
                      )}>
                        {isSelected && <Check className="w-3 h-3 text-white stroke-[3]" />}
                      </div>
                      <span className={cn(
                        "flex-1 font-medium",
                        isSelected ? "text-primary-700" : "text-dark-600"
                      )}>
                        {option.label}
                      </span>
                    </div>
                  );
                })
              ) : (
                <div className="p-8 text-center bg-dark-50/50">
                   <div className="p-3 bg-white w-fit mx-auto rounded-xl shadow-sm mb-3">
                      <Search className="w-5 h-5 text-dark-300" />
                   </div>
                   <p className="text-xs font-bold text-dark-400 uppercase tracking-widest">No options found</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {error && <span className="text-xs text-red-500 font-medium">{error}</span>}
    </div>
  );
};
