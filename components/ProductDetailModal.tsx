import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Product } from '../types';
import BaseModal from './BaseModal';
import { CartIcon, StarIcon, ShareIcon } from './icons';
import ImageWithSkeleton from './ImageWithSkeleton';
import PriceHistoryChart from './PriceHistoryChart';
import Tooltip from './Tooltip';

interface ProductDetailModalProps {
  allProducts: Product[];
  isOpen: boolean;
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number, event?: React.MouseEvent<HTMLButtonElement>) => void;
  onBuyNow: (product: Product, quantity: number) => void;
  onProductClick: (product: Product) => void;
}

const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  isOpen,
  product,
  onClose,
  onAddToCart,
  onBuyNow,
  onProductClick,
  allProducts,
}) => {
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');

  useEffect(() => {
    if (isOpen) {
      setQuantity(1);
      setActiveTab('description');
    }
  }, [isOpen, product]);

  if (!product) return null;

  const handleAddToCartClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    onAddToCart(product, quantity, e);
  };
  
  const handleBuyNowClick = () => {
    onBuyNow(product, quantity);
  };

  const relatedProducts = useMemo(() => {
    if (!product) return [];
    return allProducts
      .filter(p => p.category === product.category && p.id !== product.id)
      .slice(0, 4);
  }, [allProducts, product]);

  const averageRating = useMemo(() => {
    if (!product?.reviews || product.reviews.length === 0) return null;
    return product.reviews.reduce((acc, r) => acc + r.rating, 0) / product.reviews.length;
  }, [product?.reviews]);

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title={product.name}>
      <div className="p-2 md:p-6 grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Left column: Image gallery and actions */}
        <div className="sticky top-0">
            <div className="aspect-square w-full bg-[var(--background-tertiary)] rounded-[var(--border-radius)] overflow-hidden relative">
                <ImageWithSkeleton src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" layoutId={`product-image-${product.id}`} />
                <div className="absolute top-3 right-3 flex flex-col gap-2">
                    <Tooltip text="Share">
                        <button onClick={() => navigator.clipboard.writeText(window.location.href)} className="p-2 bg-[var(--background-secondary)]/80 backdrop-blur-sm rounded-full">
                            <ShareIcon className="w-6 h-6" />
                        </button>
                    </Tooltip>
                </div>
            </div>
        </div>

        {/* Right column: Product details */}
        <div className="space-y-4">
            <h1 className="text-4xl font-bold text-[var(--text-primary)]">{product.name}</h1>
            
            {averageRating && (
                <div className="flex items-center gap-2">
                    <div className="flex">
                        {[...Array(5)].map((_, i) => <StarIcon key={i} className={`w-5 h-5 ${i < Math.round(averageRating) ? 'text-yellow-400' : 'text-gray-300'}`} />)}
                    </div>
                    <span className="text-sm text-[var(--text-secondary)]">({product.reviews?.length} reviews)</span>
                </div>
            )}

            <p className="text-4xl font-extrabold text-[var(--primary-accent)] tabular-nums">${product.price.toFixed(2)}</p>
            
            {/* Tabs */}
            <div className="border-b border-[var(--border-color)]">
                <nav className="-mb-px flex space-x-6" aria-label="Tabs">
                    <button onClick={() => setActiveTab('description')} className={`tab-button ${activeTab === 'description' ? 'active' : ''}`}>Description</button>
                    {product.specifications && <button onClick={() => setActiveTab('specs')} className={`tab-button ${activeTab === 'specs' ? 'active' : ''}`}>Specifications</button>}
                    {product.reviews && product.reviews.length > 0 && <button onClick={() => setActiveTab('reviews')} className={`tab-button ${activeTab === 'reviews' ? 'active' : ''}`}>Reviews</button>}
                    {product.priceHistory && product.priceHistory.length > 0 && <button onClick={() => setActiveTab('priceHistory')} className={`tab-button ${activeTab === 'priceHistory' ? 'active' : ''}`}>Price History</button>}
                </nav>
            </div>
            <AnimatePresence mode="wait">
                <motion.div key={activeTab} initial={{opacity: 0, y: 10}} animate={{opacity: 1, y: 0}} exit={{opacity: 0, y: -10}} className="min-h-[100px]">
                    {activeTab === 'description' && <p className="text-[var(--text-secondary)] leading-relaxed">{product.description}</p>}
                    {activeTab === 'specs' && product.specifications && (
                        <ul className="space-y-2 text-sm">
                            {Object.entries(product.specifications).map(([key, value]) => (
                                <li key={key} className="flex justify-between p-2 rounded-md even:bg-[var(--background-tertiary)]">
                                    <strong className="text-[var(--text-primary)]">{key}</strong>
                                    <span className="text-[var(--text-secondary)]">{value}</span>
                                </li>
                            ))}
                        </ul>
                    )}
                    {activeTab === 'reviews' && product.reviews && product.reviews.length > 0 && (
                        <div className="space-y-4 max-h-48 overflow-y-auto">
                            {product.reviews.map(review => (
                                <div key={review.id} className="p-3 bg-[var(--background-tertiary)] rounded-md">
                                    <div className="flex justify-between items-center">
                                        <p className="font-semibold">{review.author}</p>
                                        <div className="flex">{[...Array(5)].map((_, i) => <StarIcon key={i} className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400' : 'text-gray-400'}`} />)}</div>
                                    </div>
                                    <p className="text-sm mt-1">{review.comment}</p>
                                </div>
                            ))}
                        </div>
                    )}
                    {activeTab === 'priceHistory' && product.priceHistory && product.priceHistory.length > 0 && <PriceHistoryChart data={product.priceHistory} />}
                </motion.div>
            </AnimatePresence>

            <div className="flex items-center gap-4 pt-4 border-t border-[var(--border-color)]">
                 <div className="flex items-center border border-[var(--border-color)] rounded-[var(--border-radius)]">
                    <button onClick={() => setQuantity(q => Math.max(1, q-1))} className="px-3 py-2 text-lg">-</button>
                    <span className="px-4 text-lg font-bold tabular-nums">{quantity}</span>
                    <button onClick={() => setQuantity(q => q+1)} className="px-3 py-2 text-lg">+</button>
                </div>
                <button onClick={handleAddToCartClick} className="flex-grow py-3 bg-[var(--primary-accent)] text-white font-bold rounded-[var(--border-radius)] hover:bg-[var(--primary-accent-hover)] flex items-center justify-center gap-2">
                    <CartIcon className="w-5 h-5"/> Add to Cart
                </button>
            </div>
            <button onClick={handleBuyNowClick} className="w-full py-3 bg-[var(--background-tertiary)] text-[var(--text-primary)] font-bold rounded-[var(--border-radius)] hover:brightness-110">
                Buy Now
            </button>
        </div>
      </div>
       {relatedProducts.length > 0 && (
            <div className="p-6 border-t border-[var(--border-color)]">
                <h3 className="text-xl font-bold text-[var(--text-primary)] mb-4">Related Products</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {relatedProducts.map(p => (
                        <div key={p.id} onClick={() => onProductClick(p)} className="cursor-pointer group">
                            <div className="aspect-square bg-[var(--background-tertiary)] rounded-md overflow-hidden">
                                <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                            </div>
                            <h4 className="text-sm font-semibold mt-2 truncate">{p.name}</h4>
                            <p className="text-md font-bold text-[var(--primary-accent)]">${p.price.toFixed(2)}</p>
                        </div>
                    ))}
                </div>
            </div>
        )}
    </BaseModal>
  );
};

export default ProductDetailModal;
