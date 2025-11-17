import React from 'react';
import { SearchIcon, CloseIcon, MicIcon } from './icons';
import Tooltip from './Tooltip';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onVoiceSearch?: () => void;
  isListening?: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({ value, onChange, onVoiceSearch, isListening }) => {
  return (
    <div className="relative w-full max-w-md">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <SearchIcon className="w-5 h-5 text-[var(--text-tertiary)]" />
      </div>
      <input
        type="text"
        placeholder={isListening ? "Listening..." : "Search or use voice..."}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-[var(--background-tertiary)] text-[var(--text-primary)] pl-10 pr-20 py-2 rounded-[var(--border-radius)] border border-transparent focus:outline-none focus:ring-2 focus:ring-[var(--primary-accent)] focus:border-transparent transition"
        aria-label="Search products"
      />
      <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
        {value && (
          <button
            onClick={() => onChange('')}
            className="p-1"
            aria-label="Clear search"
          >
            <CloseIcon className="w-5 h-5 text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors" />
          </button>
        )}
        {onVoiceSearch && (
          <Tooltip text="Voice Search">
            <button
              onClick={onVoiceSearch}
              className={`p-1 ml-1 rounded-full ${isListening ? 'bg-[var(--primary-accent)] text-white animate-pulse' : 'text-[var(--text-tertiary)] hover:text-[var(--primary-accent)]'}`}
              aria-label="Search by voice"
            >
              <MicIcon className="w-5 h-5" />
            </button>
          </Tooltip>
        )}
      </div>
    </div>
  );
};

export default SearchBar;
