import React from 'react';
import { motion } from 'framer-motion';
import { Theme } from '../types';
import Tooltip from './Tooltip';

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
        <Tooltip key={theme} text={`Switch to ${label} Theme`}>
            <motion.button
            onClick={() => setTheme(theme)}
            className={`relative px-3 py-1.5 text-sm font-medium rounded-[var(--border-radius)] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[var(--background-secondary)] focus:ring-[var(--primary-accent)] ${
                currentTheme === theme
                ? 'text-white'
                : 'text-[var(--text-secondary)] hover:bg-[var(--background-tertiary)] hover:text-[var(--text-primary)]'
            }`}
            aria-label={`Switch to ${label} theme`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            >
            {currentTheme === theme && (
                <motion.div
                    layoutId="theme-switcher-active-pill"
                    className="absolute inset-0 bg-[var(--primary-accent)] rounded-[var(--border-radius)] shadow-md z-0"
                    transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                />
            )}
            <span className="relative z-10">{label}</span>
            </motion.button>
        </Tooltip>
      ))}
    </div>
  );
};

export default ThemeSwitcher;