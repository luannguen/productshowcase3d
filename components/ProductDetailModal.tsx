import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Product } from '../types';
import BaseModal from './BaseModal';
import { CartIcon, StarIcon, CheckIcon, ShareIcon, LineChartIcon } from './icons';
import ImageWithSkeleton from './ImageWithSkeleton';
import PriceHistoryChart from './PriceHistoryChart';

interface ProductDetailModalProps {
  isOpen: boolean;
  product: Product | null;
  allProducts: Product[];
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number) => void;
  onBuyNow: (product: Product, quantity: number) => void;
  onProductClick: (product: Product) => void;
}

type Tab = 'details' | 'specifications' | 'reviews' | 'priceHistory';
type ActiveMedia = 'image' | 'video';

const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ isOpen, product, allProducts, onClose, onAddToCart, onBuyNow, onProductClick }) => {
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('details');
  const [activeMedia, setActiveMedia] = useState<ActiveMedia>('image');
  const [selectedColor, setSelectedColor] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && product) {
      setQuantity(1);
      setIsAdded(false);
      setActiveTab('details');
      setActiveMedia('image');
      setSelectedColor(product.colors?.[0] || null);
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
    setTimeout(() => setIsAdded(false), 1500); // Reset after animation
  };

  const handleBuyNowClick = () => {
    onBuyNow(product, quantity);
  };
  
  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    // You can add a toast notification here
  };

  const relatedProducts = allProducts.filter(p => p.category === product.category && p.id !== product.id).slice(0, 5);

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
            return <div className="space-y-3 text-sm">{product.specifications ? Object.entries(product.specifications).map(([key, value]) => (<div key={key} className="grid grid-cols-2 gap-4 border-b border-[var(--border-color)] pb-3"><dt className="font-medium text-[var(--text-secondary)]">{key}</dt><dd className="text-[var(--text-primary)]">{value}</dd></div>)) : <p>No specifications available.</p>}</div>;
        case 'reviews':
            return <div className="space-y-6">{product.reviews && product.reviews.length > 0 ? product.reviews.map(review => (<div key={review.id}><div className="flex items-center gap-2"><div className="flex text-yellow-400">{[...Array(5)].map((_, i) => <StarIcon key={i} className={`w-4 h-4 ${i < review.rating ? 'fill-current' : 'text-gray-600'}`} />)}</div><span className="font-bold text-[var(--text-primary)]">{review.author}</span></div><p className="mt-2 text-[var(--text-secondary)] text-sm">{review.comment}</p></div>)) : <p>No reviews yet.</p>}</div>;
        case 'priceHistory':
            return product.priceHistory ? <PriceHistoryChart data={product.priceHistory} /> : <p>No price history available.</p>;
        case 'details':
        default:
            return <motion.p variants={childVariants} className="text-[var(--text-secondary)] leading-relaxed">{product.description}</motion.p>;
    }
  }

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title="">
      <div className="p-4 sm:p-6 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        <div className="w-full flex flex-col gap-3">
             <div className="w-full aspect-square bg-[var(--background-tertiary)] rounded-[var(--border-radius)] overflow-hidden flex items-center justify-center">
                <AnimatePresence mode="wait"><motion.div key={activeMedia} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full h-full">{activeMedia === 'image' ? (<ImageWithSkeleton src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" layoutId={`product-image-${product.id}`} />) : (<video src={product.videoUrl} className="w-full h-full object-cover" controls autoPlay loop />)}</motion.div></AnimatePresence>
             </div>
             <div className="flex gap-2">
                <button onClick={() => setActiveMedia('image')} className={`w-16 h-16 rounded-md overflow-hidden ring-2 ${activeMedia === 'image' ? 'ring-[var(--primary-accent)]' : 'ring-transparent'}`}><img src={product.imageUrl} alt="Product thumbnail" className="w-full h-full object-cover" /></button>
                {product.videoUrl && (<button onClick={() => setActiveMedia('video')} className={`w-16 h-16 rounded-md overflow-hidden ring-2 flex items-center justify-center bg-black ${activeMedia === 'video' ? 'ring-[var(--primary-accent)]' : 'ring-transparent'}`}><svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20"><path d="M4 3.222v13.556c0 .75.773 1.222 1.444.889l10.889-6.778a1 1 0 000-1.778L5.444 2.333A1 1 0 004 3.222z"></path></svg></button>)}
             </div>
        </div>

        <motion.div className="flex flex-col" variants={parentVariants} initial="hidden" animate="visible">
          <motion.div variants={childVariants} className="flex justify-between items-start">
            <h2 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-[var(--header-gradient-from)] to-[var(--header-gradient-to)] text-transparent bg-clip-text" style={{ fontFamily: 'var(--font-family)' }}>{product.name}</h2>
            <button onClick={handleShare} className="p-2 text-[var(--text-secondary)] hover:text-[var(--primary-accent)]"><ShareIcon /></button>
          </motion.div>
          
           {product.colors && product.colors.length > 0 && (
              <motion.div variants={childVariants} className="mt-4">
                  <h4 className="text-sm font-semibold text-[var(--text-secondary)] mb-2">Color</h4>
                  <div className="flex gap-2">{product.colors.map(color => (<button key={color} onClick={() => setSelectedColor(color)} className={`color-swatch ${selectedColor === color ? 'selected' : ''}`} style={{ backgroundColor: color }} aria-label={`Select color ${color}`}/>))}</div>
              </motion.div>
          )}

          <motion.div variants={childVariants} className="mt-4 flex items-center justify-between">
              <p className="text-3xl lg:text-4xl font-extrabold text-[var(--primary-accent)] tabular-nums">${product.price.toFixed(2)}</p>
              <div className="flex items-center border border-[var(--border-color)] rounded-[var(--border-radius)] w-fit">
                  <motion.button whileTap={{ scale: 0.9 }} onClick={() => handleQuantityChange(-1)} className="px-3 py-1.5 text-[var(--text-secondary)] hover:bg-[var(--background-tertiary)] rounded-l-[var(--border-radius)]" aria-label="Decrement quantity">-</motion.button>
                  <AnimatePresence mode="popLayout"><motion.span key={quantity} initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 10, opacity: 0 }} transition={{ duration: 0.15 }} className="px-4 font-bold text-lg text-[var(--text-primary)] tabular-nums">{quantity}</span></AnimatePresence>
                  <motion.button whileTap={{ scale: 0.9 }} onClick={() => handleQuantityChange(1)} className="px-3 py-1.5 text-[var(--text-secondary)] hover:bg-[var(--background-tertiary)] rounded-r-[var(--border-radius)]" aria-label="Increment quantity">+</motion.button>
              </div>
          </motion.div>
          
          <div className="my-6 border-b border-[var(--border-color)]">
            <nav className="flex gap-6 -mb-px">
                <button onClick={() => setActiveTab('details')} className={`product-modal-tab ${activeTab === 'details' ? 'active' : ''}`}>Details</button>
                {product.specifications && <button onClick={() => setActiveTab('specifications')} className={`product-modal-tab ${activeTab === 'specifications' ? 'active' : ''}`}>Specifications</button>}
                {product.reviews && <button onClick={() => setActiveTab('reviews')} className={`product-modal-tab ${activeTab === 'reviews' ? 'active' : ''}`}>Reviews</button>}
                {product.priceHistory && <button onClick={() => setActiveTab('priceHistory')} className={`product-modal-tab ${activeTab === 'priceHistory' ? 'active' : ''}`}>Price History</button>}
            </nav>
          </div>
          
          <div className="flex-grow min-h-[120px]">
            <AnimatePresence mode="wait"><motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>{renderTabContent()}</motion.div></AnimatePresence>
          </div>

          <motion.div variants={childVariants} className="mt-auto pt-6 flex flex-col sm:flex-row gap-3">
            <motion.button onClick={handleAddToCartClick} className="w-full px-6 py-3 font-bold rounded-[var(--border-radius)] transition-colors duration-300 flex items-center justify-center gap-2 text-lg shadow-lg overflow-hidden relative border-2 border-[var(--primary-accent)] disabled:opacity-50 disabled:cursor-not-allowed" animate={isAdded ? "added" : "idle"} variants={{ idle: { backgroundColor: 'transparent', color: 'var(--primary-accent)' }, added: { backgroundColor: 'var(--primary-accent)', color: '#FFFFFF' } }} aria-live="polite" disabled={product.stock.level === 'out-of-stock'}>
              <AnimatePresence>{product.stock.level === 'out-of-stock' ? 'Out of Stock' : !isAdded ? (<motion.span key="add" className="flex items-center gap-2" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -20, opacity: 0 }}><CartIcon className="w-6 h-6" /> Add to Cart</motion.span>) : (<motion.span key="added" className="flex items-center gap-2" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -20, opacity: 0 }}><CheckIcon className="w-6 h-6" /> Added</motion.span>)}</AnimatePresence>
            </motion.button>
            <motion.button onClick={handleBuyNowClick} className="w-full px-6 py-3 font-bold rounded-[var(--border-radius)] transition-colors duration-300 flex items-center justify-center gap-2 text-lg shadow-lg bg-[var(--primary-accent)] text-white hover:bg-[var(--primary-accent-hover)] disabled:opacity-50 disabled:cursor-not-allowed" disabled={product.stock.level === 'out-of-stock'}>Buy Now</motion.button>
          </motion.div>
        </motion.div>
      </div>
      {relatedProducts.length > 0 && (
        <div className="p-4 sm:p-6 border-t border-[var(--border-color)]">
            <h3 className="text-xl font-bold text-[var(--text-primary)] mb-4">You Might Also Like</h3>
            <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
                {relatedProducts.map(rp => (
                    <div key={rp.id} onClick={() => onProductClick(rp)} className="flex-shrink-0 w-32 cursor-pointer group">
                        <div className="w-full h-32 rounded-md overflow-hidden bg-[var(--background-tertiary)]"><ImageWithSkeleton src={rp.imageUrl} alt={rp.name} className="w-full h-full object-cover"/></div>
                        <h4 className="text-sm font-semibold mt-2 truncate text-[var(--text-primary)] group-hover:text-[var(--primary-accent)]">{rp.name}</h4>
                        <p className="text-sm font-bold text-[var(--primary-accent)]">${rp.price.toFixed(2)}</p>
                    </div>
                ))}
            </div>
        </div>
      )}
    </BaseModal>
  );
};

export default ProductDetailModal;
