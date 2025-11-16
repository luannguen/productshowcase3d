import React from 'react';
import { ViewMode } from '../types';
import { GridIcon, ListIcon, TableIcon, FlipIcon, CarouselIcon, ThreeDIcon, StoryIcon } from './icons';

interface ViewSwitcherProps {
  currentView: ViewMode;
  setView: (view: ViewMode) => void;
}

const viewOptions = [
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
        <button
          key={mode}
          onClick={() => setView(mode)}
          className={`flex items-center justify-center px-3 py-1.5 text-sm font-medium rounded-[var(--border-radius)] transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[var(--background-tertiary)] focus:ring-[var(--primary-accent)] ${
            currentView === mode
              ? 'bg-[var(--primary-accent)] text-white shadow-md'
              : 'text-[var(--text-secondary)] hover:bg-[var(--background-secondary)] hover:text-[var(--text-primary)]'
          }`}
          aria-label={`Switch to ${mode} view`}
        >
          <Icon className="w-5 h-5 mr-2" />
          <span className="hidden sm:inline">{mode}</span>
        </button>
      ))}
    </div>
  );
};

export default ViewSwitcher;