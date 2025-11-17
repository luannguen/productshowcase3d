import React from 'react';
import { motion } from 'framer-motion';
import { Product } from '../types';
import { CartIcon, HeartIcon, EyeIcon } from './icons';
import BaseCard from './BaseCard';
import Tooltip from './Tooltip';

interface GridViewProps {
  products: Product[];
  onProductClick: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  searchQuery: string;
  onQuickView: (product: Product) => void;
  onToggleWishlist: (product: Product) => void;
  isProductInWishlist: (id: number) => boolean;
}

const highlightMatch = (text: string, query: string) => {
    if (!query) return text;
    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    return <>{parts.map((part, i) => part.toLowerCase() === query.toLowerCase() ? <mark key={i}>{part}</mark> : part)}</>;
};

const ProductCardContent: React.FC<{ product: Product; onAddToCart: (product: Product) => void; searchQuery: string; onQuickView: (product: Product) => void; onToggleWishlist: (product: Product) => void; isProductInWishlist: boolean; }> = 
({ product, onAddToCart, searchQuery, onQuickView, onToggleWishlist, isProductInWishlist }) => (
  <>
    <div className="relative shine-effect group">
      <motion.img 
          src={product.imageUrl} 
          alt={product.name} 
          className="w-full h-48 object-cover"
          layoutId={`product-image-${product.id}`}
          loading="lazy"
      />
      {product.tags?.map(tag => (
        <span key={tag} className={`product-badge ${tag === 'New' ? 'product-badge-new' : 'product-badge-bestseller'}`}>{tag}</span>
      ))}
      <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Tooltip text="Quick View">
            <motion.button whileTap={{scale: 0.9}} onClick={(e) => { e.stopPropagation(); onQuickView(product); }} className="p-2 bg-[var(--background-secondary)]/80 backdrop-blur-sm rounded-full hover:bg-[var(--primary-accent)] hover:text-white" aria-label="Quick View"><EyeIcon className="w-5 h-5"/></motion.button>
          </Tooltip>
          <Tooltip text={isProductInWishlist ? "Remove from Wishlist" : "Add to Wishlist"}>
            <motion.button whileTap={{scale: 0.9}} onClick={(e) => { e.stopPropagation(); onToggleWishlist(product); }} className={`p-2 bg-[var(--background-secondary)]/80 backdrop-blur-sm rounded-full hover:bg-[var(--primary-accent)] transition-colors ${isProductInWishlist ? 'text-[var(--primary-accent)]' : ''}`} aria-label="Add to Wishlist"><HeartIcon className={`w-5 h-5 ${isProductInWishlist ? 'fill-current' : ''}`}/></motion.button>
          </Tooltip>
      </div>
    </div>
    <div className="p-4 flex flex-col flex-grow">
      <h3 className="text-lg font-semibold text-[var(--text-primary)] flex-grow h-14">
        {highlightMatch(product.name, searchQuery)}
      </h3>
      <div className="mt-4 flex justify-between items-center">
        <p className="text-2xl font-bold text-[var(--primary-accent)] tabular-nums">${product.price.toFixed(2)}</p>
        <motion.button 
          whileTap={{ scale: 0.90 }}
          onClick={(e) => { e.stopPropagation(); onAddToCart(product); }}
          className="p-2 bg-[var(--primary-accent)] text-white rounded-[var(--border-radius)] hover:bg-[var(--primary-accent-hover)] transition-colors"
          aria-label={`Add ${product.name} to cart`}
        >
          <CartIcon className="w-5 h-5" />
        </motion.button>
      </div>
    </div>
  </>
);

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const GridView: React.FC<GridViewProps> = (props) => {
  return (
    <motion.div 
      className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {props.products.map((product) => (
        <div key={product.id} className="interactive-border">
          <BaseCard onClick={() => props.onProductClick(product)}>
            <div className="bg-[var(--background-secondary)] rounded-[var(--border-radius)] overflow-hidden shadow-lg flex flex-col h-full">
              <ProductCardContent product={product} onAddToCart={props.onAddToCart} searchQuery={props.searchQuery} onQuickView={props.onQuickView} onToggleWishlist={props.onToggleWishlist} isProductInWishlist={props.isProductInWishlist(product.id)} />
            </div>
          </BaseCard>
        </div>
      ))}
    </motion.div>
  );
};

export default GridView;