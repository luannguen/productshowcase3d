import React from 'react';
import { motion } from 'framer-motion';
import { Product } from '../types';
import { CartIcon, EyeIcon, HeartIcon, PlusIcon, ShareIcon } from './icons';
import Tooltip from './Tooltip';
import ImageWithSkeleton from './ImageWithSkeleton';

interface ListViewProps {
  products: Product[];
  onProductClick: (product: Product) => void;
  onAddToCart: (product: Product, quantity: number, event?: React.MouseEvent<HTMLButtonElement>) => void;
  searchQuery: string;
  onQuickView: (product: Product) => void;
  onToggleWishlist: (product: Product) => void;
  isProductInWishlist: (id: number) => boolean;
  onToggleCompare: (product: Product) => void;
  isProductInCompare: (id: number) => boolean;
  reduceMotion: boolean;
}

const highlightMatch = (text: string, query: string) => {
    if (!query) return text;
    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    return <>{parts.map((part, i) => part.toLowerCase() === query.toLowerCase() ? <mark key={i}>{part}</mark> : part)}</>;
};

const StockIndicator: React.FC<{ stock: Product['stock'] }> = ({ stock }) => {
    if (stock.level === 'out-of-stock') {
        return <p className="text-sm font-semibold text-red-500">Out of Stock</p>;
    }
    if (stock.level === 'low') {
        return <p className="text-sm font-semibold text-yellow-500">Only {stock.quantity} left!</p>;
    }
    return <p className="text-sm font-semibold text-green-500">In Stock</p>;
};

const ListItem: React.FC<Omit<ListViewProps, 'products' | 'searchQuery' | 'reduceMotion'> & { product: Product; searchQuery: string }> = 
({ product, onProductClick, onAddToCart, onQuickView, onToggleWishlist, isProductInWishlist, onToggleCompare, isProductInCompare, searchQuery }) => {
    const isOutOfStock = product.stock.level === 'out-of-stock';
    return (
        <div className="interactive-border">
            <div 
              className="flex flex-col sm:flex-row items-center rounded-[var(--border-radius)] shadow-md overflow-hidden p-4 transition-colors duration-300 cursor-pointer bg-[var(--background-secondary)]"
              onClick={() => onProductClick(product)}
            >
              <div className="relative w-full sm:w-48 h-48 sm:h-32 rounded-md flex-shrink-0 overflow-hidden">
                  <ImageWithSkeleton src={product.imageUrl} alt={product.name} className="w-full h-full object-cover"/>
              </div>
              <div className="sm:ml-6 mt-4 sm:mt-0 flex-1">
                <h3 className="text-2xl font-bold text-[var(--text-primary)]">{highlightMatch(product.name, searchQuery)}</h3>
                <p className="text-[var(--text-secondary)] mt-2 leading-relaxed line-clamp-2">{highlightMatch(product.description, searchQuery)}</p>
                <div className="mt-2"><StockIndicator stock={product.stock} /></div>
              </div>
              <div className="mt-4 sm:mt-0 sm:ml-6 flex-shrink-0 flex flex-col items-end gap-3">
                <p className="text-3xl font-bold text-[var(--primary-accent)] tabular-nums">${product.price.toFixed(2)}</p>
                <div className="flex items-center gap-2">
                    <Tooltip text={isProductInWishlist(product.id) ? "Remove from Wishlist" : "Add to Wishlist"}><motion.button whileTap={{scale: 0.9}} onClick={(e) => { e.stopPropagation(); onToggleWishlist(product); }} className={`p-2 bg-[var(--background-tertiary)] rounded-full hover:bg-[var(--primary-accent)] transition-colors ${isProductInWishlist(product.id) ? 'text-[var(--primary-accent)]' : 'text-white'}`} aria-label="Add to Wishlist"><HeartIcon className={`w-5 h-5 ${isProductInWishlist(product.id) ? 'fill-current' : ''}`}/></motion.button></Tooltip>
                    <Tooltip text="Quick View"><motion.button whileTap={{scale: 0.9}} onClick={(e) => { e.stopPropagation(); onQuickView(product); }} className="p-2 bg-[var(--background-tertiary)] text-white rounded-full hover:bg-[var(--primary-accent)]" aria-label="Quick View"><EyeIcon className="w-5 h-5"/></motion.button></Tooltip>
                    <Tooltip text={isProductInCompare(product.id) ? "Remove from Compare" : "Add to Compare"}><motion.button whileTap={{scale: 0.9}} onClick={(e) => { e.stopPropagation(); onToggleCompare(product); }} className={`p-2 bg-[var(--background-tertiary)] rounded-full hover:bg-[var(--primary-accent)] transition-colors ${isProductInCompare(product.id) ? 'text-[var(--primary-accent)]' : 'text-white'}`} aria-label="Add to Compare"><PlusIcon className={`w-5 h-5 transition-transform ${isProductInCompare(product.id) ? 'rotate-45' : ''}`}/></motion.button></Tooltip>
                    <motion.button whileTap={{ scale: 0.95 }} onClick={(e) => { e.stopPropagation(); onAddToCart(product, 1, e); }} className="px-3 py-2 bg-[var(--primary-accent)] text-white font-semibold rounded-[var(--border-radius)] hover:bg-[var(--primary-accent-hover)] transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed" aria-label={`Add ${product.name} to cart`} disabled={isOutOfStock}>
                        <CartIcon className="w-5 h-5" /> Add
                    </motion.button>
                </div>
              </div>
            </div>
        </div>
    );
};

const ListView: React.FC<ListViewProps> = React.memo((props) => {
  return (
    <div className="space-y-4">
      {props.products.map((product) => (
        <ListItem
            key={product.id}
            product={product}
            searchQuery={props.searchQuery}
            onProductClick={props.onProductClick}
            onAddToCart={props.onAddToCart}
            onQuickView={props.onQuickView}
            onToggleWishlist={props.onToggleWishlist}
            isProductInWishlist={props.isProductInWishlist}
            onToggleCompare={props.onToggleCompare}
            isProductInCompare={props.isProductInCompare}
        />
      ))}
    </div>
  );
});

export default ListView;