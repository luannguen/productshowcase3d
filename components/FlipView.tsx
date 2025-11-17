import React from 'react';
import { motion } from 'framer-motion';
import { Product } from '../types';
import { CartIcon, HeartIcon, EyeIcon } from './icons';
import BaseCard from './BaseCard';
import Tooltip from './Tooltip';

interface FlipViewProps {
  products: Product[];
  onProductClick: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onQuickView: (product: Product) => void;
  onToggleWishlist: (product: Product) => void;
  isProductInWishlist: (id: number) => boolean;
}

const FlipCard: React.FC<{ product: Product; onAddToCart: (product: Product) => void; onQuickView: (product: Product) => void; onToggleWishlist: (product: Product) => void; isProductInWishlist: boolean; }> = 
({ product, onAddToCart, onQuickView, onToggleWishlist, isProductInWishlist }) => (
    <div className="group h-80 w-full perspective-1000">
        <div className="flipper relative w-full h-full transform-style-3d transition-transform duration-700">
            {/* Front */}
            <div className="absolute w-full h-full backface-hidden rounded-[var(--border-radius)] overflow-hidden shadow-xl group-hover:shadow-2xl transition-shadow bg-[var(--background-secondary)] flex flex-col">
                <div className="relative shine-effect">
                    <motion.img src={product.imageUrl} alt={product.name} className="w-full h-48 object-cover" layoutId={`product-image-${product.id}`} />
                    {product.tags?.map(tag => <span key={tag} className={`product-badge ${tag === 'New' ? 'product-badge-new' : 'product-badge-bestseller'}`}>{tag}</span>)}
                </div>
                <div className="p-4 flex flex-col flex-grow justify-between">
                    <h3 className="text-xl font-bold text-[var(--text-primary)]">{product.name}</h3>
                    <p className="text-2xl font-bold text-[var(--primary-accent)] self-end tabular-nums">${product.price.toFixed(2)}</p>
                </div>
            </div>
            {/* Back */}
            <div className="absolute w-full h-full backface-hidden rotate-y-180 rounded-[var(--border-radius)] overflow-hidden shadow-xl group-hover:shadow-2xl bg-[var(--background-tertiary)] p-4 flex flex-col justify-between items-center text-center">
                 <h3 className="text-lg font-bold text-[var(--text-primary)]">{product.name}</h3>
                <p className="text-sm text-[var(--text-secondary)] flex-grow overflow-y-auto no-scrollbar">{product.description}</p>
                 <div className="flex justify-center items-center gap-2 mt-2">
                    <Tooltip text="Quick View">
                        <motion.button whileTap={{scale: 0.9}} onClick={(e) => { e.stopPropagation(); onQuickView(product); }} className="p-2 bg-[var(--background-secondary)] rounded-full hover:bg-[var(--primary-accent)] hover:text-white" aria-label="Quick View"><EyeIcon className="w-5 h-5"/></motion.button>
                    </Tooltip>
                    <Tooltip text={isProductInWishlist ? "Remove from Wishlist" : "Add to Wishlist"}>
                        <motion.button whileTap={{scale: 0.9}} onClick={(e) => { e.stopPropagation(); onToggleWishlist(product); }} className={`p-2 bg-[var(--background-secondary)] rounded-full hover:bg-[var(--primary-accent)] transition-colors ${isProductInWishlist ? 'text-[var(--primary-accent)]' : ''}`} aria-label="Add to Wishlist"><HeartIcon className={`w-5 h-5 ${isProductInWishlist ? 'fill-current' : ''}`}/></motion.button>
                    </Tooltip>
                 </div>
                 <div className="mt-3 flex justify-between items-center w-full">
                    <p className="text-xl font-bold text-[var(--primary-accent)] tabular-nums">${product.price.toFixed(2)}</p>
                    <motion.button whileTap={{ scale: 0.95 }} onClick={(e) => { e.stopPropagation(); onAddToCart(product); }} className="flex items-center gap-2 px-3 py-2 bg-[var(--primary-accent)] text-white font-semibold rounded-[var(--border-radius)] hover:brightness-110 transition-all" aria-label={`Add ${product.name} to cart`}>
                        <CartIcon className="w-5 h-5" /> Add
                    </motion.button>
                 </div>
            </div>
        </div>
    </div>
);

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.07 } },
};

const FlipView: React.FC<FlipViewProps> = (props) => {
  return (
    <motion.div 
      className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {props.products.map((product) => (
        <div key={product.id} className="interactive-border">
          <BaseCard onClick={() => props.onProductClick(product)}>
            <div className="group">
              <FlipCard product={product} onAddToCart={props.onAddToCart} onQuickView={props.onQuickView} onToggleWishlist={props.onToggleWishlist} isProductInWishlist={props.isProductInWishlist(product.id)} />
            </div>
          </BaseCard>
        </div>
      ))}
    </motion.div>
  );
};

export default FlipView;