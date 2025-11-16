import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ToastMessage } from '../types';
import { CartIcon } from './icons';

interface ToastProps {
  message: string;
}

const Toast: React.FC<ToastProps> = ({ message }) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 50, scale: 0.3 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.5 }}
      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      className="flex items-center gap-3 px-4 py-3 text-sm font-semibold text-[var(--text-primary)] bg-[var(--background-secondary)] rounded-[var(--border-radius)] shadow-2xl border border-[var(--border-color)]"
    >
      <div className="text-[var(--primary-accent)]">
        <CartIcon className="w-5 h-5" />
      </div>
      <span>{message}</span>
    </motion.div>
  );
};

interface ToastContainerProps {
  toasts: ToastMessage[];
}

const ToastContainer: React.FC<ToastContainerProps> = ({ toasts }) => {
  return (
    <div className="fixed bottom-4 right-4 z-[100] space-y-2">
      <AnimatePresence>
        {toasts.map(toast => (
          <Toast key={toast.id} message={toast.message} />
        ))}
      </AnimatePresence>
    </div>
  );
};

export default ToastContainer;