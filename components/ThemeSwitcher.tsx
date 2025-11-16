
import React from 'react';
import { Theme } from '../types';

interface ThemeSwitcherProps {
  currentTheme: Theme;
  setTheme: (theme: Theme) => void;
}

const themeOptions = [
    { theme: Theme.Electronics, label: 'Electronics' },
    { theme: Theme.Youthful, label: 'Youthful' },
    { theme: Theme.Fashion, label: 'Fashion' },
];

const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({ currentTheme, setTheme }) => {
  return (
    <div className="flex items-center bg-[var(--background-secondary)] rounded-[var(--border-radius)] p-1 space-x-1">
      {themeOptions.map(({ theme, label }) => (
        <button
          key={theme}
          onClick={() => setTheme(theme)}
          className={`px-3 py-1.5 text-sm font-medium rounded-[var(--border-radius)] transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[var(--background-secondary)] focus:ring-[var(--primary-accent)] ${
            currentTheme === theme
              ? 'bg-[var(--primary-accent)] text-white shadow-md'
              : 'text-[var(--text-secondary)] hover:bg-[var(--background-tertiary)] hover:text-[var(--text-primary)]'
          }`}
          aria-label={`Switch to ${label} theme`}
        >
          {label}
        </button>
      ))}
    </div>
  );
};

export default ThemeSwitcher;
