import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WishlistItem, Product } from '../../types';
import BaseModal from '../ui/BaseModal';
import { CartIcon, HeartIcon } from '../ui/icons';

interface WishlistModalProps {
  isOpen: boolean;
  onClose: () => void;
  wishlistItems: WishlistItem[];
  onRemoveFromWishlist: (product: Product) => void;
  onAddToCart: (product: Product) => void;
}

const WishlistModal: React.FC<WishlistModalProps> = ({ isOpen, onClose, wishlistItems, onRemoveFromWishlist, onAddToCart }) => {
  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title={`Your Wishlist (${wishlistItems.length})`}>
      <div className="p-6">
        {wishlistItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center py-12">
            <HeartIcon className="w-16 h-16 text-[var(--primary-accent)]/50 mb-4" />
            <h3 className="text-xl font-semibold text-[var(--text-primary)]">Your wishlist is empty</h3>
            <p className="text-[var(--text-secondary)] mt-1">Add items you love to your wishlist.</p>
            <button onClick={onClose} className="mt-6 px-6 py-2 bg-[var(--primary-accent)] text-white font-semibold rounded-[var(--border-radius)] hover:bg-[var(--primary-accent-hover)] transition-colors">
              Discover Products
            </button>
          </div>
        ) : (
          <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
            <AnimatePresence>
              {wishlistItems.map((product) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  key={product.id}
                  className="flex items-center gap-4 bg-[var(--background-tertiary)] p-3 rounded-[var(--border-radius)]"
                >
                  <img src={product.imageUrl} alt={product.name} className="w-16 h-16 object-cover rounded-md flex-shrink-0" />
                  <div className="flex-grow">
                    <h4 className="font-semibold text-[var(--text-primary)]">{product.name}</h4>
                    <p className="text-sm font-bold text-[var(--primary-accent)] tabular-nums">${product.price.toFixed(2)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => onRemoveFromWishlist(product)} className="p-2 text-red-500 hover:bg-red-500/10 rounded-full" aria-label="Remove from wishlist">
                        <HeartIcon className="w-5 h-5 fill-current" />
                    </button>
                    <button onClick={() => onAddToCart(product)} className="p-2 bg-[var(--primary-accent)] text-white rounded-full hover:bg-[var(--primary-accent-hover)]" aria-label="Add to cart">
                        <CartIcon className="w-5 h-5" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </BaseModal>
  );
};

export default WishlistModal;