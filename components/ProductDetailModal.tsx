import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Product } from '../types';
import BaseModal from './BaseModal';
import { CartIcon, StarIcon, CheckIcon, GridIcon } from './icons';

interface ProductDetailModalProps {
  isOpen: boolean;
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number) => void;
}

type Tab = 'details' | 'specifications' | 'reviews';
type ActiveMedia = 'image' | 'video';

const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ isOpen, product, onClose, onAddToCart }) => {
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('details');
  const [activeMedia, setActiveMedia] = useState<ActiveMedia>('image');

  useEffect(() => {
    if (isOpen) {
      setQuantity(1);
      setIsAdded(false);
      setActiveTab('details');
      setActiveMedia('image');
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

  const parentVariants = {
    visible: { transition: { staggerChildren: 0.08 } },
  };

  const childVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const renderTabContent = () => {
    switch (activeTab) {
        case 'specifications':
            return (
                <div className="space-y-3 text-sm">
                    {product.specifications ? Object.entries(product.specifications).map(([key, value]) => (
                        <div key={key} className="grid grid-cols-2 gap-4 border-b border-[var(--border-color)] pb-3">
                            <dt className="font-medium text-[var(--text-secondary)]">{key}</dt>
                            <dd className="text-[var(--text-primary)]">{value}</dd>
                        </div>
                    )) : <p>No specifications available.</p>}
                </div>
            );
        case 'reviews':
            return (
                <div className="space-y-6">
                    {product.reviews && product.reviews.length > 0 ? product.reviews.map(review => (
                        <div key={review.id}>
                            <div className="flex items-center gap-2">
                                <div className="flex text-yellow-400">
                                    {[...Array(5)].map((_, i) => <StarIcon key={i} className={`w-4 h-4 ${i < review.rating ? 'fill-current' : 'text-gray-600'}`} />)}
                                </div>
                                <span className="font-bold text-[var(--text-primary)]">{review.author}</span>
                            </div>
                            <p className="mt-2 text-[var(--text-secondary)] text-sm">{review.comment}</p>
                        </div>
                    )) : <p>No reviews yet.</p>}
                </div>
            );
        case 'details':
        default:
            return (
                <>
                    <motion.p variants={childVariants} className="text-[var(--text-secondary)] leading-relaxed">
                        {product.description}
                    </motion.p>
                    <div className="my-6 border-t border-[var(--border-color)]" />
                    <motion.div variants={childVariants} className="flex items-center justify-between">
                        <div>
                        <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Quantity</label>
                        <div className="flex items-center border border-[var(--border-color)] rounded-[var(--border-radius)] w-fit">
                            <motion.button whileTap={{ scale: 0.9 }} onClick={() => handleQuantityChange(-1)} className="px-3 py-1.5 text-[var(--text-secondary)] hover:bg-[var(--background-tertiary)] rounded-l-[var(--border-radius)] transition" aria-label="Decrement quantity">-</motion.button>
                            <AnimatePresence mode="popLayout">
                                <motion.span key={quantity} initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 10, opacity: 0 }} transition={{ duration: 0.15 }} className="px-4 font-bold text-lg text-[var(--text-primary)] tabular-nums">{quantity}</motion.span>
                            </AnimatePresence>
                            <motion.button whileTap={{ scale: 0.9 }} onClick={() => handleQuantityChange(1)} className="px-3 py-1.5 text-[var(--text-secondary)] hover:bg-[var(--background-tertiary)] rounded-r-[var(--border-radius)] transition" aria-label="Increment quantity">+</motion.button>
                        </div>
                        </div>
                        <div className="text-right">
                        <p className="text-sm text-[var(--text-secondary)]">Total Price</p>
                        <p className="text-3xl lg:text-4xl font-extrabold text-[var(--primary-accent)] tabular-nums">
                            ${(product.price * quantity).toFixed(2)}
                        </p>
                        </div>
                    </motion.div>
                </>
            );
    }
  }

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title="">
      <div className="p-4 sm:p-6 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        <div className="w-full flex flex-col gap-3">
             <div className="w-full aspect-square bg-[var(--background-tertiary)] rounded-[var(--border-radius)] overflow-hidden flex items-center justify-center">
                <AnimatePresence mode="wait">
                  <motion.div key={activeMedia} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full h-full">
                    {activeMedia === 'image' ? (
                      <motion.img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full h-full object-cover"
                        layoutId={`product-image-${product.id}`}
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.3 }}
                      />
                    ) : (
                      <video src={product.videoUrl} className="w-full h-full object-cover" controls autoPlay loop />
                    )}
                  </motion.div>
                </AnimatePresence>
             </div>
             <div className="flex gap-2">
                <button onClick={() => setActiveMedia('image')} className={`w-16 h-16 rounded-md overflow-hidden ring-2 ${activeMedia === 'image' ? 'ring-[var(--primary-accent)]' : 'ring-transparent'}`}>
                    <img src={product.imageUrl} alt="Product thumbnail" className="w-full h-full object-cover" />
                </button>
                {product.videoUrl && (
                    <button onClick={() => setActiveMedia('video')} className={`w-16 h-16 rounded-md overflow-hidden ring-2 flex items-center justify-center bg-black ${activeMedia === 'video' ? 'ring-[var(--primary-accent)]' : 'ring-transparent'}`}>
                        <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20"><path d="M4 3.222v13.556c0 .75.773 1.222 1.444.889l10.889-6.778a1 1 0 000-1.778L5.444 2.333A1 1 0 004 3.222z"></path></svg>
                    </button>
                )}
             </div>
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

          <div className="mt-4 border-b border-[var(--border-color)]">
            <nav className="flex gap-6 -mb-px">
                <button onClick={() => setActiveTab('details')} className={`product-modal-tab ${activeTab === 'details' ? 'active' : ''}`}>Details</button>
                {product.specifications && <button onClick={() => setActiveTab('specifications')} className={`product-modal-tab ${activeTab === 'specifications' ? 'active' : ''}`}>Specifications</button>}
                {product.reviews && <button onClick={() => setActiveTab('reviews')} className={`product-modal-tab ${activeTab === 'reviews' ? 'active' : ''}`}>Reviews</button>}
            </nav>
          </div>
          
          <div className="mt-6 flex-grow">
            <AnimatePresence mode="wait">
                <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
                    {renderTabContent()}
                </motion.div>
            </AnimatePresence>
          </div>

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