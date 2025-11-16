import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Product } from '../types';
import BaseModal from './BaseModal';
import { CartIcon, StarIcon, CheckIcon } from './icons';

interface ProductDetailModalProps {
  isOpen: boolean;
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number) => void;
}

const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ isOpen, product, onClose, onAddToCart }) => {
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setQuantity(1);
      setIsAdded(false);
    }
  }, [isOpen, product]);

  if (!isOpen || !product) {
    return null;
  }

  const handleQuantityChange = (amount: number) => {
    setQuantity(prev => Math.max(1, prev + amount));
  };

  const handleAddToCartClick = () => {
    if (isAdded) return;
    onAddToCart(product, quantity);
    setIsAdded(true);
    setTimeout(() => {
      onClose();
    }, 1200);
  };

  const colors = ['#3B82F6', '#EF4444', '#10B981', '#F59E0B'];

  const parentVariants = {
    visible: { transition: { staggerChildren: 0.08 } },
  };

  const childVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title="">
      <div className="p-4 sm:p-6 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        <div className="w-full aspect-square bg-[var(--background-tertiary)] rounded-[var(--border-radius)] overflow-hidden flex items-center justify-center">
          <motion.img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover"
            layoutId={`product-image-${product.id}`}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          />
        </div>

        <motion.div
          className="flex flex-col"
          variants={parentVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h2 variants={childVariants} className="text-3xl lg:text-4xl font-bold text-[var(--text-primary)]" style={{ fontFamily: 'var(--font-family)' }}>
            {product.name}
          </motion.h2>

          <motion.div variants={childVariants} className="flex items-center gap-2 mt-3">
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => <StarIcon key={i} className={`w-5 h-5 ${i < 4 ? 'fill-current' : 'text-gray-500'}`} />)}
            </div>
            <span className="text-sm text-[var(--text-secondary)]">(1,288 reviews)</span>
          </motion.div>

          <motion.p variants={childVariants} className="mt-4 text-[var(--text-secondary)] leading-relaxed">
            {product.description}
          </motion.p>
          
          <motion.div variants={childVariants} className="mt-4 flex items-center gap-4">
            <span className="text-sm font-medium text-[var(--text-primary)]">Color:</span>
            <div className="flex items-center gap-2">
              {colors.map((color, i) => (
                <button key={color} style={{ backgroundColor: color }} className={`w-6 h-6 rounded-full ring-2 ring-offset-2 ring-offset-[var(--background-secondary)] transition ${i === 0 ? 'ring-[var(--primary-accent)]' : 'ring-transparent'}`} aria-label={`Color option ${i + 1}`}></button>
              ))}
            </div>
          </motion.div>

          <motion.div variants={childVariants} className="flex items-center gap-2 mt-4">
            <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-sm font-semibold text-green-400">In Stock</span>
          </motion.div>

          <div className="my-6 border-t border-[var(--border-color)]" />

          <motion.div variants={childVariants} className="flex items-center justify-between">
            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Quantity</label>
              <div className="flex items-center border border-[var(--border-color)] rounded-[var(--border-radius)] w-fit">
                <button onClick={() => handleQuantityChange(-1)} className="px-3 py-1.5 text-[var(--text-secondary)] hover:bg-[var(--background-tertiary)] rounded-l-[var(--border-radius)] transition" aria-label="Decrement quantity">-</button>
                <span className="px-4 font-bold text-lg text-[var(--text-primary)] tabular-nums">{quantity}</span>
                <button onClick={() => handleQuantityChange(1)} className="px-3 py-1.5 text-[var(--text-secondary)] hover:bg-[var(--background-tertiary)] rounded-r-[var(--border-radius)] transition" aria-label="Increment quantity">+</button>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-[var(--text-secondary)]">Total Price</p>
              <p className="text-3xl lg:text-4xl font-extrabold text-[var(--primary-accent)] tabular-nums">
                ${(product.price * quantity).toFixed(2)}
              </p>
            </div>
          </motion.div>

          <motion.div variants={childVariants} className="mt-auto pt-6">
            <motion.button
              onClick={handleAddToCartClick}
              className="w-full px-6 py-4 font-bold rounded-[var(--border-radius)] transition-colors duration-300 flex items-center justify-center gap-2 text-lg shadow-lg overflow-hidden relative"
              animate={isAdded ? "added" : "idle"}
              variants={{
                idle: { backgroundColor: 'var(--primary-accent)', color: '#FFFFFF' },
                added: { backgroundColor: '#22C55E', color: '#FFFFFF' },
              }}
              aria-live="polite"
            >
              <AnimatePresence>
                {!isAdded ? (
                  <motion.span key="add" className="flex items-center gap-2" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -20, opacity: 0 }}>
                    <CartIcon className="w-6 h-6" /> Add to Cart
                  </motion.span>
                ) : (
                  <motion.span key="added" className="flex items-center gap-2" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -20, opacity: 0 }}>
                    <CheckIcon className="w-6 h-6" /> Added!
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </BaseModal>
  );
};

export default ProductDetailModal;