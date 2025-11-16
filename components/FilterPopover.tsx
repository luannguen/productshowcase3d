import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FilterIcon } from './icons';

interface FilterPopoverProps {
  priceRange: { min: number; max: number };
  setPriceRange: (range: { min: number; max: number }) => void;
  maxPrice: number;
}

const FilterPopover: React.FC<FilterPopoverProps> = ({ priceRange, setPriceRange, maxPrice }) => {
  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMin = Math.min(Number(e.target.value), priceRange.max - 1);
    setPriceRange({ ...priceRange, min: newMin });
  };
  
  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMax = Math.max(Number(e.target.value), priceRange.min + 1);
    setPriceRange({ ...priceRange, max: newMax });
  };

  const resetFilters = () => {
    setPriceRange({ min: 0, max: maxPrice });
  };
  
  const isFilterActive = priceRange.min > 0 || priceRange.max < maxPrice;

  return (
    <div className="relative" ref={popoverRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-[var(--border-radius)] bg-[var(--background-tertiary)] text-[var(--text-secondary)] hover:bg-[var(--primary-accent)] hover:text-white transition-all duration-300 flex items-center gap-2"
        aria-expanded={isOpen}
        aria-label="Open filters menu"
      >
        <FilterIcon className="w-5 h-5" />
        {isFilterActive && (
          <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-[var(--primary-accent)] text-white text-[10px] ring-2 ring-[var(--background-primary)]">
            1
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            className="absolute top-full right-0 mt-2 w-72 bg-[var(--background-secondary)] rounded-[var(--border-radius)] shadow-2xl border border-[var(--border-color)] z-30 p-4"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-bold text-[var(--text-primary)]">Filters</h4>
              <button onClick={resetFilters} className="text-sm text-[var(--primary-accent)] hover:underline">Reset</button>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)]">Price Range</label>
              <div className="flex justify-between text-sm font-semibold text-[var(--text-primary)] mt-2">
                <span>${priceRange.min}</span>
                <span>${priceRange.max}</span>
              </div>
              <div className="mt-2 space-y-2">
                <input 
                  type="range"
                  min="0"
                  max={maxPrice}
                  value={priceRange.min}
                  onChange={handleMinChange}
                  className="w-full h-2 bg-[var(--background-tertiary)] rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[var(--primary-accent)] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-[var(--background-secondary)] [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-[var(--primary-accent)] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-[var(--background-secondary)]"
                  aria-label="Minimum price"
                />
                <input 
                  type="range"
                  min="0"
                  max={maxPrice}
                  value={priceRange.max}
                  onChange={handleMaxChange}
                  className="w-full h-2 bg-[var(--background-tertiary)] rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[var(--primary-accent)] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-[var(--background-secondary)] [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-[var(--primary-accent)] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-[var(--background-secondary)]"
                   aria-label="Maximum price"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* FIX: Removed style jsx tag and used Tailwind arbitrary variants and Framer Motion for styling and animation. */}
    </div>
  );
};
export default FilterPopover;