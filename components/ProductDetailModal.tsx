import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Product } from '../types';
import BaseModal from './BaseModal';
import { CartIcon, ChevronDownIcon } from './icons';

interface ProductDetailModalProps {
  isOpen: boolean;
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number) => void;
}

const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ isOpen, product, onClose, onAddToCart }) => {
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (isOpen) {
        setQuantity(1);
        setIsDescriptionExpanded(false);
    }
  }, [isOpen, product]);

  if (!isOpen || !product) {
    return null;
  }

  const handleQuantityChange = (amount: number) => {
    setQuantity(prev => Math.max(1, prev + amount));
  };

  const handleAddToCartClick = () => {
    onAddToCart(product, quantity);
    onClose();
  };

  const totalPrice = product.price * quantity;

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title="Product Details">
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Column: Image */}
        <div className="w-full aspect-square bg-[var(--background-tertiary)] rounded-[var(--border-radius)] overflow-hidden">
          <motion.img 
            src={product.imageUrl} 
            alt={product.name} 
            className="w-full h-full object-cover"
            layoutId={`product-image-${product.id}`}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          />
        </div>

        {/* Right Column: Details */}
        <div className="flex flex-col">
          <h2 className="text-3xl font-bold text-[var(--text-primary)]" style={{ fontFamily: 'var(--font-family)' }}>
            {product.name}
          </h2>
          <p className="text-4xl font-extrabold text-[var(--primary-accent)] mt-4">
            ${product.price.toFixed(2)}
          </p>
          
          <div className="mt-6">
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Quantity</label>
            <div className="flex items-center gap-4">
              <div className="flex items-center border border-[var(--border-color)] rounded-[var(--border-radius)]">
                <button 
                  onClick={() => handleQuantityChange(-1)} 
                  className="px-3 py-2 text-[var(--text-secondary)] hover:bg-[var(--background-tertiary)] rounded-l-[var(--border-radius)] transition-colors duration-200"
                  aria-label="Decrement quantity"
                >
                  -
                </button>
                <span className="px-4 py-2 font-bold text-lg text-[var(--text-primary)] select-none" aria-live="polite">
                  {quantity}
                </span>
                <button 
                  onClick={() => handleQuantityChange(1)} 
                  className="px-3 py-2 text-[var(--text-secondary)] hover:bg-[var(--background-tertiary)] rounded-r-[var(--border-radius)] transition-colors duration-200"
                  aria-label="Increment quantity"
                >
                  +
                </button>
              </div>
              <div className="flex-1 text-right">
                <p className="text-sm text-[var(--text-secondary)]">Total Price</p>
                <p className="text-2xl font-bold text-[var(--primary-accent)]">${totalPrice.toFixed(2)}</p>
              </div>
            </div>
          </div>
          
          <div className="mt-6 border-t border-[var(--border-color)]">
            <button 
                onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                className="w-full flex justify-between items-center py-4 text-left text-lg font-semibold text-[var(--text-primary)]"
            >
                <span>Details</span>
                <motion.div
                    animate={{ rotate: isDescriptionExpanded ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <ChevronDownIcon className="w-5 h-5"/>
                </motion.div>
            </button>
             <AnimatePresence initial={false}>
              {isDescriptionExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                  className="overflow-hidden"
                >
                  <p className="pb-4 text-[var(--text-secondary)]">
                    {product.description}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
           <div className="border-b border-[var(--border-color)]" />

          <div className="mt-auto pt-6">
             <button 
                onClick={handleAddToCartClick}
                className="w-full px-6 py-3 bg-[var(--primary-accent)] text-white font-bold rounded-[var(--border-radius)] hover:bg-[var(--primary-accent-hover)] transition-colors duration-200 flex items-center justify-center gap-2 text-lg shadow-lg add-to-cart-animation"
                aria-label={`Add ${quantity} of ${product.name} to cart`}
            >
                <CartIcon className="w-6 h-6" />
                Add to Cart
            </button>
          </div>
        </div>
      </div>
    </BaseModal>
  );
};

export default ProductDetailModal;