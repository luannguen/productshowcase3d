import React from 'react';
import { SearchIcon, CloseIcon } from './icons';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ value, onChange }) => {
  return (
    <div className="relative w-full max-w-md">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <SearchIcon className="w-5 h-5 text-[var(--text-tertiary)]" />
      </div>
      <input
        type="text"
        placeholder="Search products..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-[var(--background-tertiary)] text-[var(--text-primary)] pl-10 pr-10 py-2 rounded-[var(--border-radius)] border border-transparent focus:outline-none focus:ring-2 focus:ring-[var(--primary-accent)] focus:border-transparent transition"
        aria-label="Search products"
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute inset-y-0 right-0 pr-3 flex items-center"
          aria-label="Clear search"
        >
          <CloseIcon className="w-5 h-5 text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors" />
        </button>
      )}
    </div>
  );
};

export default SearchBar;
