import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Product } from '../types';
import { XIcon } from './icons';

interface CompareTrayProps {
  items: Product[];
  onRemove: (product: Product) => void;
  onClear: () => void;
  onCompare: () => void;
}

const CompareTray: React.FC<CompareTrayProps> = ({ items, onRemove, onClear, onCompare }) => {
  return (
    <AnimatePresence>
      {items.length > 0 && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="compare-tray flex items-center gap-4 p-3 bg-[var(--background-secondary)] rounded-[var(--border-radius)] shadow-2xl border border-[var(--border-color)]"
        >
          <div className="flex items-center gap-2">
            {items.map(item => (
              <div key={item.id} className="relative group">
                <img src={item.imageUrl} alt={item.name} className="w-12 h-12 object-cover rounded-md" />
                <button
                  onClick={() => onRemove(item)}
                  className="absolute -top-1 -right-1 w-5 h-5 bg-red-600 text-white rounded-full flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-label={`Remove ${item.name} from comparison`}
                >
                  <XIcon className="w-3 h-3" />
                </button>
              </div>
            ))}
            {[...Array(4 - items.length)].map((_, i) => (
                <div key={`placeholder-${i}`} className="w-12 h-12 bg-[var(--background-tertiary)] rounded-md border-2 border-dashed border-[var(--border-color)]" />
            ))}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onCompare}
              disabled={items.length < 2}
              className="px-4 py-2 bg-[var(--primary-accent)] text-white font-semibold rounded-[var(--border-radius)] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Compare ({items.length})
            </button>
            <button onClick={onClear} className="text-sm text-[var(--text-secondary)] hover:underline">
              Clear
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CompareTray;