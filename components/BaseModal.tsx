import React, { useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';

interface BaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title: string;
}

const useFocusTrap = (modalRef: React.RefObject<HTMLDivElement>, isOpen: boolean) => {
  useEffect(() => {
    if (!isOpen || !modalRef.current) return;

    const focusableElements = modalRef.current.querySelectorAll<HTMLElement>(
      'a[href], button, textarea, input[type="text"], input[type="radio"], input[type="checkbox"], select'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) { // Shift + Tab
        if (document.activeElement === firstElement) {
          lastElement.focus();
          e.preventDefault();
        }
      } else { // Tab
        if (document.activeElement === lastElement) {
          firstElement.focus();
          e.preventDefault();
        }
      }
    };

    const modal = modalRef.current;
    modal.addEventListener('keydown', handleKeyDown);
    firstElement?.focus();

    return () => {
      modal.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, modalRef]);
};

const BaseModal: React.FC<BaseModalProps> = ({ isOpen, onClose, children, title }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      onClose();
    }
  }, [onClose]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);
  
  useFocusTrap(modalRef, isOpen);

  const desktopVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1 },
  };

  const mobileVariants = {
    hidden: { y: "100%" },
    visible: { y: "0%" },
  };

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (isMobile && info.offset.y > 100 && info.velocity.y > 20) {
      onClose();
    }
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
            aria-hidden="true"
          />
          <div className="fixed inset-0 z-50 flex items-end justify-center md:items-center md:justify-center p-0 md:p-4" role="dialog" aria-modal="true" aria-labelledby="modal-title">
            <motion.div
              ref={modalRef}
              className="bg-[var(--background-secondary)] w-full max-w-4xl max-h-[95vh] md:max-h-[90vh] rounded-t-[var(--border-radius)] md:rounded-[var(--border-radius)] shadow-2xl flex flex-col"
              variants={isMobile ? mobileVariants : desktopVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              transition={{ type: "spring", stiffness: 300, damping: 30, duration: 0.3 }}
              drag={isMobile ? "y" : false}
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={{ top: 0, bottom: 0.5 }}
              onDragEnd={handleDragEnd}
            >
              <header 
                className={`flex items-center justify-between p-4 border-b border-[var(--border-color)] ${!isMobile ? 'cursor-move' : ''}`}
                >
                <h2 id="modal-title" className="text-xl font-bold text-[var(--text-primary)] select-none">
                  {title}
                </h2>
                <button onClick={onClose} className="text-2xl leading-none text-[var(--text-secondary)] hover:text-[var(--text-primary)]" aria-label="Close modal">&times;</button>
              </header>
              <div className="flex-grow overflow-y-auto">
                {children}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default BaseModal;