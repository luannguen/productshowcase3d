import React from 'react';
import { motion } from 'framer-motion';
import { Product } from '../types';
import { CartIcon, EyeIcon, HeartIcon } from './icons';
import Tooltip from './Tooltip';

interface ListViewProps {
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

const ListItem: React.FC<Omit<ListViewProps, 'products' | 'searchQuery'> & { product: Product; searchQuery: string }> = 
({ product, onProductClick, onAddToCart, onQuickView, onToggleWishlist, isProductInWishlist, searchQuery }) => {
    return (
        <div className="interactive-border">
            <div 
              className="flex flex-col sm:flex-row items-center rounded-[var(--border-radius)] shadow-md overflow-hidden p-4 transition-colors duration-300 cursor-pointer bg-[var(--background-secondary)]"
              onClick={() => onProductClick(product)}
            >
              <div className="relative shine-effect w-full sm:w-48 h-48 sm:h-32 rounded-md flex-shrink-0 overflow-hidden">
                  <motion.img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" layoutId={`product-image-${product.id}`} loading="lazy"/>
              </div>
              <div className="sm:ml-6 mt-4 sm:mt-0 flex-1">
                <h3 className="text-2xl font-bold text-[var(--text-primary)]">{highlightMatch(product.name, searchQuery)}</h3>
                <p className="text-[var(--text-secondary)] mt-2 leading-relaxed line-clamp-2">{highlightMatch(product.description, searchQuery)}</p>
              </div>
              <div className="mt-4 sm:mt-0 sm:ml-6 flex-shrink-0 flex flex-col items-end gap-3">
                <p className="text-3xl font-bold text-[var(--primary-accent)] tabular-nums">${product.price.toFixed(2)}</p>
                <div className="flex items-center gap-2">
                    <Tooltip text={isProductInWishlist(product.id) ? "Remove from Wishlist" : "Add to Wishlist"}>
                        <motion.button whileTap={{scale: 0.9}} onClick={(e) => { e.stopPropagation(); onToggleWishlist(product); }} className={`p-2 bg-[var(--background-tertiary)] rounded-full hover:bg-[var(--primary-accent)] transition-colors ${isProductInWishlist(product.id) ? 'text-[var(--primary-accent)]' : 'text-white'}`} aria-label="Add to Wishlist"><HeartIcon className={`w-5 h-5 ${isProductInWishlist(product.id) ? 'fill-current' : ''}`}/></motion.button>
                    </Tooltip>
                    <Tooltip text="Quick View">
                        <motion.button whileTap={{scale: 0.9}} onClick={(e) => { e.stopPropagation(); onQuickView(product); }} className="p-2 bg-[var(--background-tertiary)] text-white rounded-full hover:bg-[var(--primary-accent)]" aria-label="Quick View"><EyeIcon className="w-5 h-5"/></motion.button>
                    </Tooltip>
                    <motion.button whileTap={{ scale: 0.95 }} onClick={(e) => { e.stopPropagation(); onAddToCart(product); }} className="px-3 py-2 bg-[var(--primary-accent)] text-white font-semibold rounded-[var(--border-radius)] hover:bg-[var(--primary-accent-hover)] transition-colors flex items-center gap-2" aria-label={`Add ${product.name} to cart`}>
                        <CartIcon className="w-5 h-5" /> Add
                    </motion.button>
                </div>
              </div>
            </div>
        </div>
    );
};

const ListView: React.FC<ListViewProps> = (props) => {
  return (
    <div className="space-y-4">
      {props.products.map((product) => (
        <ListItem key={product.id} {...props} product={product} />
      ))}
    </div>
  );
};

export default ListView;