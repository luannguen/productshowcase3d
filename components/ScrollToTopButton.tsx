import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpIcon } from './icons';

interface ScrollToTopButtonProps {
  isVisible: boolean;
}

const ScrollToTopButton: React.FC<ScrollToTopButtonProps> = ({ isVisible }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          onClick={scrollToTop}
          className="scroll-to-top-btn p-3 bg-[var(--primary-accent)] text-white rounded-full shadow-lg hover:bg-[var(--primary-accent-hover)] transition-colors"
          aria-label="Scroll to top"
        >
          <ArrowUpIcon className="w-6 h-6 transform -rotate-45" />
        </motion.button>
      )}
    </AnimatePresence>
  );
};

export default ScrollToTopButton;