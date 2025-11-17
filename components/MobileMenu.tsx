import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SearchBar from './SearchBar';
import FilterPopover from './FilterPopover';
import ThemeSwitcher from './ThemeSwitcher';
import ViewSwitcher from './ViewSwitcher';
import { CloseIcon, CommandIcon, ManageIcon, SparklesIcon } from './icons';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filterPopoverProps: React.ComponentProps<typeof FilterPopover>;
  themeSwitcherProps: React.ComponentProps<typeof ThemeSwitcher>;
  viewSwitcherProps: React.ComponentProps<typeof ViewSwitcher>;
  surpriseMe: () => void;
  openCommandPalette: () => void;
  openManageModal: () => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({
  isOpen,
  onClose,
  searchQuery,
  setSearchQuery,
  filterPopoverProps,
  themeSwitcherProps,
  viewSwitcherProps,
  surpriseMe,
  openCommandPalette,
  openManageModal,
}) => {
  const handleAction = (action: () => void) => {
    action();
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/70 z-40"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: '0%' }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed top-0 right-0 h-full w-full max-w-sm bg-[var(--background-primary)] z-50 flex flex-col shadow-2xl"
          >
            <header className="flex items-center justify-between p-4 border-b border-[var(--border-color)]">
              <h2 className="text-xl font-bold text-[var(--text-primary)]">Menu</h2>
              <button onClick={onClose} className="p-1 text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
                <CloseIcon className="w-6 h-6" />
              </button>
            </header>
            <div className="flex-grow p-6 overflow-y-auto space-y-8">
              <div className="space-y-4">
                <SearchBar value={searchQuery} onChange={setSearchQuery} />
                <div className="flex justify-start">
                    <FilterPopover {...filterPopoverProps} />
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-[var(--text-tertiary)] mb-3">THEME</h3>
                <ThemeSwitcher {...themeSwitcherProps} />
              </div>
              
              <div>
                <h3 className="text-sm font-semibold text-[var(--text-tertiary)] mb-3">VIEW</h3>
                <div className="[&>div]:w-full [&>div]:grid [&>div]:grid-cols-2 [&>div]:gap-2">
                    <ViewSwitcher {...viewSwitcherProps} />
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-[var(--text-tertiary)] mb-3">ACTIONS</h3>
                <div className="flex flex-col items-start gap-2">
                    <button onClick={() => handleAction(surpriseMe)} className="flex items-center gap-3 p-2 text-lg text-[var(--text-primary)] hover:text-[var(--primary-accent)] transition-colors w-full text-left rounded-md hover:bg-[var(--background-secondary)]"><SparklesIcon className="w-5 h-5"/> Surprise Me</button>
                    <button onClick={() => handleAction(openCommandPalette)} className="flex items-center gap-3 p-2 text-lg text-[var(--text-primary)] hover:text-[var(--primary-accent)] transition-colors w-full text-left rounded-md hover:bg-[var(--background-secondary)]"><CommandIcon className="w-5 h-5"/> Command Palette</button>
                    <button onClick={() => handleAction(openManageModal)} className="flex items-center gap-3 p-2 text-lg text-[var(--text-primary)] hover:text-[var(--primary-accent)] transition-colors w-full text-left rounded-md hover:bg-[var(--background-secondary)]"><ManageIcon className="w-5 h-5"/> Manage Products</button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MobileMenu;
