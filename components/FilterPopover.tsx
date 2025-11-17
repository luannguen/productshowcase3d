import React, { useState, useRef, useEffect } from 'react';
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
  resetFilters: () => void;
}

const sortOptions: { value: SortOption, label: string }[] = [
    { value: 'default', label: 'Default' },
    { value: 'price-asc', label: 'Price: Low-High' },
    { value: 'price-desc', label: 'Price: High-Low' },
    { value: 'name-asc', label: 'Name: A-Z' },
    { value: 'name-desc', label: 'Name: Z-A' },
];

const FilterControls: React.FC<FilterPopoverProps> = ({ 
    priceRange, setPriceRange, maxPrice, 
    categories, selectedCategories, setSelectedCategories,
    sortOption, setSortOption, resetFilters
}) => {
    const minPos = (priceRange.min / maxPrice) * 100;
    const maxPos = (priceRange.max / maxPrice) * 100;

    const handleCategoryToggle = (category: string) => {
        setSelectedCategories(
            selectedCategories.includes(category)
                ? selectedCategories.filter(c => c !== category)
                : [...selectedCategories, category]
        );
    };
    
    const activeFilterCount =
        (priceRange.min > 0 || priceRange.max < maxPrice ? 1 : 0) +
        (selectedCategories.length > 0 ? 1 : 0) +
        (sortOption !== 'default' ? 1 : 0);
        
    return (
        <>
            <div className="flex justify-between items-center mb-4">
                <h4 className="font-bold text-[var(--text-primary)]">Filters</h4>
                <button onClick={resetFilters} className="text-sm text-[var(--primary-accent)] hover:underline disabled:opacity-50 disabled:no-underline" disabled={activeFilterCount === 0}>Reset All</button>
            </div>
            
            <div className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-[var(--text-secondary)]">Price Range</label>
                    <div className="flex justify-between text-sm font-semibold text-[var(--text-primary)] mt-2 tabular-nums"><span>${priceRange.min}</span><span>${priceRange.max}</span></div>
                    <div className="mt-2 relative h-5 flex items-center">
                        <div className="absolute w-full h-1 bg-[var(--background-tertiary)] rounded-full"><div className="absolute h-1 bg-[var(--primary-accent)] rounded-full" style={{ left: `${minPos}%`, right: `${100 - maxPos}%` }} /></div>
                        <input type="range" min="0" max={maxPrice} value={priceRange.min} onChange={(e) => setPriceRange({ ...priceRange, min: Math.min(Number(e.target.value), priceRange.max - 1) })} className="absolute w-full h-1 appearance-none bg-transparent pointer-events-none" aria-label="Minimum price" />
                        <input type="range" min="0" max={maxPrice} value={priceRange.max} onChange={(e) => setPriceRange({ ...priceRange, max: Math.max(Number(e.target.value), priceRange.min + 1) })} className="absolute w-full h-1 appearance-none bg-transparent pointer-events-none" aria-label="Maximum price" />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-[var(--text-secondary)]">Category</label>
                    <div className="mt-2 flex flex-wrap gap-2">{categories.map(category => (<button key={category} onClick={() => handleCategoryToggle(category)} className={`px-3 py-1 text-xs font-semibold rounded-full transition-colors ${selectedCategories.includes(category) ? 'bg-[var(--primary-accent)] text-white' : 'bg-[var(--background-tertiary)] hover:bg-[var(--border-color)] text-[var(--text-primary)]'}`}>{category}</button>))}</div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-[var(--text-secondary)]">Sort By</label>
                    <select value={sortOption} onChange={(e) => setSortOption(e.target.value as SortOption)} className="mt-2 w-full p-2 bg-[var(--background-tertiary)] text-[var(--text-primary)] rounded-[var(--border-radius)] border border-[var(--border-color)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-accent)]">
                        {sortOptions.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}
                    </select>
                </div>
            </div>
        </>
    );
};

const FilterPopover: React.FC<FilterPopoverProps> = (props) => {
  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) setIsOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  const activeFilterCount =
    (props.priceRange.min > 0 || props.priceRange.max < props.maxPrice ? 1 : 0) +
    (props.selectedCategories.length > 0 ? 1 : 0) +
    (props.sortOption !== 'default' ? 1 : 0);

  return (
    <div className="relative" ref={popoverRef}>
      <button onClick={() => setIsOpen(!isOpen)} className="relative p-2 rounded-[var(--border-radius)] bg-[var(--background-tertiary)] text-[var(--text-secondary)] hover:bg-[var(--primary-accent)] hover:text-white transition-all duration-300 flex items-center gap-2" aria-expanded={isOpen}>
        <FilterIcon className="w-5 h-5" /> Filter
        {activeFilterCount > 0 && <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-[var(--primary-accent)] text-white text-[10px] ring-2 ring-[var(--background-primary)]">{activeFilterCount}</span>}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            className="glass-header absolute top-full right-0 mt-2 w-80 rounded-[var(--border-radius)] shadow-2xl border border-[var(--border-color)] z-30 p-4"
            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2, ease: "easeOut" }}>
            <FilterControls {...props} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export { FilterControls };
export default FilterPopover;