import React from 'react';
import { FilterControls } from './FilterPopover';
import { SortOption } from '../types';
import SearchBar from './SearchBar';

interface FilterSidebarProps {
  priceRange: { min: number; max: number };
  setPriceRange: (range: { min: number; max: number }) => void;
  maxPrice: number;
  categories: string[];
  selectedCategories: string[];
  setSelectedCategories: (categories: string[]) => void;
  colors: string[];
  selectedColors: string[];
  setSelectedColors: (colors: string[]) => void;
  sortOption: SortOption;
  setSortOption: (option: SortOption) => void;
  resetFilters: () => void;
  className?: string;
  id?: string;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const FilterSidebar: React.FC<FilterSidebarProps> = (props) => {
  const { 
    className, id, searchQuery, setSearchQuery, 
    colors, selectedColors, setSelectedColors, 
    ...filterControlProps 
  } = props;
  
  return (
    <aside className={className} id={id}>
      <div className="sticky top-28 space-y-6">
        <SearchBar value={searchQuery} onChange={setSearchQuery} />
        <div className="p-6 bg-[var(--background-secondary)] rounded-[var(--border-radius)]">
            <FilterControls {...filterControlProps} />
             <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mt-6">Color</label>
                <div className="mt-2 flex flex-wrap gap-3">
                    {colors.map(color => (
                        <button 
                            key={color} 
                            onClick={() => setSelectedColors(
                                selectedColors.includes(color)
                                    ? selectedColors.filter(c => c !== color)
                                    : [...selectedColors, color]
                            )}
                            className={`color-swatch ${selectedColors.includes(color) ? 'selected' : ''}`}
                            style={{ backgroundColor: color }}
                            aria-label={`Filter by color ${color}`}
                        />
                    ))}
                </div>
            </div>
        </div>
      </div>
    </aside>
  );
};

export default FilterSidebar;
