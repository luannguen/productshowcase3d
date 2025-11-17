import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FilterIcon } from './icons';
import { SortOption } from '../types';

interface FilterPopoverProps {
  priceRange: { min: number; max: number };
  setPriceRange: (range: { min: number; max: number }) => void;
  maxPrice: number;
  categories: string[];
  selectedCategories: string[];
  setSelectedCategories: (categories: string[]) => void;
  sortOption: SortOption;
  setSortOption: (option: SortOption) => void;
}

const sortOptions: { value: SortOption, label: string }[] = [
    { value: 'default', label: 'Default' },
    { value: 'price-asc', label: 'Price: Low-High' },
    { value: 'price-desc', label: 'Price: High-Low' },
    { value: 'name-asc', label: 'Name: A-Z' },
    { value: 'name-desc', label: 'Name: Z-A' },
];

const FilterPopover: React.FC<FilterPopoverProps> = ({ 
    priceRange, setPriceRange, maxPrice, 
    categories, selectedCategories, setSelectedCategories,
    sortOption, setSortOption
}) => {
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

  const handleCategoryToggle = (category: string) => {
    setSelectedCategories(
        selectedCategories.includes(category)
            ? selectedCategories.filter(c => c !== category)
            : [...selectedCategories, category]
    );
  };

  const resetFilters = () => {
    setPriceRange({ min: 0, max: maxPrice });
    setSelectedCategories([]);
    setSortOption('default');
  };
  
  const activeFilterCount =
    (priceRange.min > 0 || priceRange.max < maxPrice ? 1 : 0) +
    (selectedCategories.length > 0 ? 1 : 0) +
    (sortOption !== 'default' ? 1 : 0);

  return (
    <div className="relative" ref={popoverRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-[var(--border-radius)] bg-[var(--background-tertiary)] text-[var(--text-secondary)] hover:bg-[var(--primary-accent)] hover:text-white transition-all duration-300 flex items-center gap-2"
        aria-expanded={isOpen}
      >
        <FilterIcon className="w-5 h-5" />
        {activeFilterCount > 0 && (
          <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-[var(--primary-accent)] text-white text-[10px] ring-2 ring-[var(--background-primary)]">
            {activeFilterCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            className="glass-popover absolute top-full right-0 mt-2 w-80 rounded-[var(--border-radius)] shadow-2xl border border-[var(--border-color)] z-30 p-4"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-bold text-[var(--text-primary)]">Filters</h4>
              <button onClick={resetFilters} className="text-sm text-[var(--primary-accent)] hover:underline disabled:opacity-50 disabled:no-underline" disabled={activeFilterCount === 0}>Reset</button>
            </div>
            
            <div className="space-y-4">
                {/* Price Range */}
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

                {/* Categories */}
                <div>
                    <label className="block text-sm font-medium text-[var(--text-secondary)]">Category</label>
                    <div className="mt-2 flex flex-wrap gap-2">
                        {categories.map(category => (
                            <button
                                key={category}
                                onClick={() => handleCategoryToggle(category)}
                                className={`px-3 py-1 text-xs font-semibold rounded-full transition-colors ${selectedCategories.includes(category) ? 'bg-[var(--primary-accent)] text-white' : 'bg-[var(--background-tertiary)] hover:bg-[var(--border-color)] text-[var(--text-primary)]'}`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Sort By */}
                <div>
                    <label className="block text-sm font-medium text-[var(--text-secondary)]">Sort By</label>
                    <div className="mt-2 grid grid-cols-1 gap-2">
                        {sortOptions.map(option => (
                            <button
                                key={option.value}
                                onClick={() => setSortOption(option.value)}
                                className={`p-2 text-sm text-left rounded-[var(--border-radius)] transition-colors ${sortOption === option.value ? 'bg-[var(--primary-accent)] text-white' : 'bg-[var(--background-tertiary)] hover:bg-[var(--border-color)] text-[var(--text-primary)]'}`}
                            >
                                {option.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
export default FilterPopover;