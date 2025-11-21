import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Theme, ViewMode } from '../../types';
import { themes } from '../../constants';
import * as Icons from '../ui/icons';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  setView: (view: ViewMode) => void;
  setTheme: (theme: Theme) => void;
}

type Action = {
  id: string;
  name: string;
  section: string;
  keywords?: string;
  icon: React.ReactNode;
  perform: () => void;
};

const viewIcons: Record<ViewMode, React.FC<{ className?: string }>> = {
    [ViewMode.Grid]: Icons.GridIcon,
    [ViewMode.List]: Icons.ListIcon,
    [ViewMode.Table]: Icons.TableIcon,
    [ViewMode.Flip]: Icons.FlipIcon,
    [ViewMode.Carousel]: Icons.CarouselIcon,
    [ViewMode.ThreeD]: Icons.ThreeDIcon,
    [ViewMode.Story]: Icons.StoryIcon,
    [ViewMode.ForYou]: Icons.UserIcon,
    // FIX: Add missing ReadBook view mode icon
    [ViewMode.ReadBook]: Icons.BookOpenIcon,
};

const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose, setView, setTheme }) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  const actions: Action[] = [
    ...Object.values(ViewMode).map(view => ({
      id: `view-${view}`, name: `Change view to ${view}`, section: 'Views', icon: React.createElement(viewIcons[view], {className: 'w-5 h-5'}),
      perform: () => setView(view),
    })),
    ...Object.values(Theme).map(theme => ({
      id: `theme-${theme}`, name: `Change theme to ${theme}`, section: 'Themes', keywords: 'color style design', icon: <div className="w-5 h-5 rounded-full" style={{backgroundColor: themes[theme].styles.dark['--primary-accent'] as string}} />,
      perform: () => setTheme(theme),
    })),
  ];

  const filteredActions = query ? actions.filter(action =>
    action.name.toLowerCase().includes(query.toLowerCase()) ||
    action.section.toLowerCase().includes(query.toLowerCase()) ||
    action.keywords?.toLowerCase().includes(query.toLowerCase())
  ) : actions;

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!isOpen) return;

    if (e.key === 'Escape') {
      onClose();
      return;
    }
    
    if (filteredActions.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(i => (i + 1) % filteredActions.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(i => (i - 1 + filteredActions.length) % filteredActions.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      filteredActions[selectedIndex]?.perform();
      onClose();
    }
  }, [isOpen, filteredActions, selectedIndex, onClose]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const sections = [...new Set(filteredActions.map(a => a.section))];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="fixed inset-0 bg-black/60" onClick={onClose} />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: -20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: -20 }} transition={{ duration: 0.2 }}
            className="relative w-full max-w-xl bg-[var(--background-secondary)] rounded-[var(--border-radius)] shadow-2xl border border-[var(--border-color)]"
          >
            <div className="flex items-center p-4 border-b border-[var(--border-color)]">
              <Icons.SearchIcon className="w-5 h-5 text-[var(--text-tertiary)] mr-3" />
              <input type="text" placeholder="Search commands..." value={query} onChange={e => { setQuery(e.target.value); setSelectedIndex(0); }} className="w-full bg-transparent text-[var(--text-primary)] focus:outline-none" autoFocus />
            </div>
            <div className="max-h-[40vh] overflow-y-auto p-2">
              {filteredActions.length > 0 ? sections.map(section => (
                <div key={section}>
                  <h3 className="px-2 py-1 text-xs font-semibold text-[var(--text-tertiary)]">{section}</h3>
                  <ul>
                    {filteredActions.filter(a => a.section === section).map((action) => {
                      const globalIndex = filteredActions.findIndex(a => a.id === action.id);
                      return (
                        <li key={action.id} data-selected={selectedIndex === globalIndex} onClick={() => { action.perform(); onClose(); }} className="command-palette-item flex items-center gap-3 p-2 rounded-md cursor-pointer">
                          <span className="text-[var(--text-secondary)]">{action.icon}</span>
                          <span>{action.name}</span>
                        </li>
                      )
                    })}
                  </ul>
                </div>
              )) : <p className="p-4 text-center text-[var(--text-secondary)]">No results found.</p>}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default CommandPalette;