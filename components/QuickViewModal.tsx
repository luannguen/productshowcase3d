import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Product } from '../types';
import BaseModal from './BaseModal';
import { CartIcon } from './icons';

interface QuickViewModalProps {
  isOpen: boolean;
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number) => void;
  onNavigateToProduct: (product: Product) => void;
}

const QuickViewModal: React.FC<QuickViewModalProps> = ({ isOpen, product, onClose, onAddToCart, onNavigateToProduct }) => {
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (isOpen) setQuantity(1);
  }, [isOpen]);

  if (!isOpen || !product) return null;

  const handleQuantityChange = (amount: number) => setQuantity(prev => Math.max(1, prev + amount));
  const handleAddToCartClick = () => { onAddToCart(product, quantity); onClose(); };
  const handleNavigate = () => { onNavigateToProduct(product); onClose(); };

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title={product.name}>
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="w-full aspect-square bg-[var(--background-tertiary)] rounded-[var(--border-radius)] overflow-hidden">
          <motion.img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" layoutId={`product-image-${product.id}`} />
        </div>
        <div className="flex flex-col">
          <h2 className="text-3xl font-bold text-[var(--text-primary)]">{product.name}</h2>
          <p className="text-[var(--text-secondary)] mt-2 leading-relaxed line-clamp-3">{product.description}</p>
          <p className="text-4xl font-extrabold text-[var(--primary-accent)] my-6 tabular-nums">${product.price.toFixed(2)}</p>
          
          <div className="flex items-center gap-4 mt-auto">
            <div className="flex items-center border border-[var(--border-color)] rounded-[var(--border-radius)] w-fit">
              <button onClick={() => handleQuantityChange(-1)} className="px-3 py-2 text-[var(--text-secondary)]">-</button>
              <span className="px-4 font-bold text-lg text-[var(--text-primary)] tabular-nums">{quantity}</span>
              <button onClick={() => handleQuantityChange(1)} className="px-3 py-2 text-[var(--text-secondary)]">+</button>
            </div>
            <button onClick={handleAddToCartClick} className="flex-grow px-6 py-3 bg-[var(--primary-accent)] text-white font-bold rounded-[var(--border-radius)] hover:bg-[var(--primary-accent-hover)] transition-colors flex items-center justify-center gap-2">
              <CartIcon className="w-5 h-5" /> Add to Cart
            </button>
          </div>
          <button onClick={handleNavigate} className="mt-3 text-sm text-[var(--primary-accent)] hover:underline">
            View Full Details
          </button>
        </div>
      </div>
    </BaseModal>
  );
};

export default QuickViewModal;