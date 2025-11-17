
import React from 'react';
import { motion } from 'framer-motion';
import { ViewMode } from '../types';
import { GridIcon, ListIcon, TableIcon, FlipIcon, CarouselIcon, ThreeDIcon, StoryIcon, UserIcon } from './icons';
import Tooltip from './Tooltip';

interface ViewSwitcherProps {
  currentView: ViewMode;
  setView: (view: ViewMode) => void;
}

const viewOptions = [
  { mode: ViewMode.ForYou, Icon: UserIcon },
  { mode: ViewMode.Story, Icon: StoryIcon },
  { mode: ViewMode.Flip, Icon: FlipIcon },
  { mode: ViewMode.Carousel, Icon: CarouselIcon },
  { mode: ViewMode.ThreeD, Icon: ThreeDIcon },
  { mode: ViewMode.Grid, Icon: GridIcon },
  { mode: ViewMode.List, Icon: ListIcon },
  { mode: ViewMode.Table, Icon: TableIcon },
];

const ViewSwitcher: React.FC<ViewSwitcherProps> = ({ currentView, setView }) => {
  return (
    <div className="flex items-center bg-[var(--background-tertiary)] rounded-[var(--border-radius)] p-1 space-x-1">
      {viewOptions.map(({ mode, Icon }) => (
        <Tooltip key={mode} text={`Switch to ${mode} View`}>
          <motion.button
            onClick={() => setView(mode)}
            className={`relative flex items-center justify-center p-2 lg:px-3 lg:py-1.5 text-sm font-medium rounded-[var(--border-radius)] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[var(--background-tertiary)] focus:ring-[var(--primary-accent)] ${
              currentView === mode
                ? 'text-white'
                : 'text-[var(--text-secondary)] hover:bg-[var(--background-secondary)] hover:text-[var(--text-primary)]'
            }`}
            aria-label={`Switch to ${mode} view`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {currentView === mode && (
              <motion.div
                layoutId="view-switcher-active-pill"
                className="absolute inset-0 bg-[var(--primary-accent)] rounded-[var(--border-radius)] shadow-md z-0"
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              />
            )}
            <div className="relative z-10 flex items-center">
                <Icon className="w-5 h-5 lg:mr-2" />
                <span className="hidden lg:inline">{mode}</span>
            </div>
          </motion.button>
        </Tooltip>
      ))}
    </div>
  );
};

export default ViewSwitcher;