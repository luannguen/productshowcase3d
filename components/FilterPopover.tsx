import React, { useState, useRef, useEffect, useCallback } from 'react';
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

  const minPos = (priceRange.min / maxPrice) * 100;
  const maxPos = (priceRange.max / maxPrice) * 100;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMinChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.min(Number(e.target.value), priceRange.max - 1);
    setPriceRange({ ...priceRange, min: value });
  }, [priceRange, setPriceRange]);
  
  const handleMaxChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.max(Number(e.target.value), priceRange.min + 1);
    setPriceRange({ ...priceRange, max: value });
  }, [priceRange, setPriceRange]);

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
            className="glass-popover absolute top-full right-0 mt-2 w-72 rounded-[var(--border-radius)] shadow-2xl border border-[var(--border-color)] z-30 p-4"
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
              <div className="flex justify-between text-sm font-semibold text-[var(--text-primary)] mt-2 tabular-nums">
                <span>${priceRange.min}</span>
                <span>${priceRange.max}</span>
              </div>
              <div className="mt-2 relative h-5 flex items-center">
                  <div className="price-slider-track">
                      <div className="price-slider-range" style={{ left: `${minPos}%`, right: `${100 - maxPos}%` }} />
                  </div>
                  <input type="range" min="0" max={maxPrice} value={priceRange.min} onChange={handleMinChange} className="price-slider" aria-label="Minimum price" />
                  <input type="range" min="0" max={maxPrice} value={priceRange.max} onChange={handleMaxChange} className="price-slider" aria-label="Maximum price" />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
export default FilterPopover;