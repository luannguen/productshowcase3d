import React from 'react';
import { FilterControls } from './FilterPopover';
import { SortOption } from '../types';

interface FilterSidebarProps {
  priceRange: { min: number; max: number };
  setPriceRange: (range: { min: number; max: number }) => void;
  maxPrice: number;
  categories: string[];
  selectedCategories: string[];
  setSelectedCategories: (categories: string[]) => void;
  sortOption: SortOption;
  setSortOption: (option: SortOption) => void;
  resetFilters: () => void;
  className?: string;
}

const FilterSidebar: React.FC<FilterSidebarProps> = (props) => {
  return (
    <aside className={props.className}>
      <div className="sticky top-28 p-6 bg-[var(--background-secondary)] rounded-[var(--border-radius)]">
        <FilterControls {...props} />
      </div>
    </aside>
  );
};

export default FilterSidebar;