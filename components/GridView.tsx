import React from 'react';
import { motion } from 'framer-motion';
import { Product } from '../types';
import { CartIcon, HeartIcon, EyeIcon, PlusIcon, ShareIcon, BookmarkIcon, BellIcon, SparklesIcon, FlameIcon } from './icons';
import BaseCard from './BaseCard';
import Tooltip from './Tooltip';
import ImageWithSkeleton from './ImageWithSkeleton';

interface GridViewProps {
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
  onAddToCollection: (product: Product) => void;
  onNotifyMe: (product: Product) => void;
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

const ProductCardContent: React.FC<Pick<GridViewProps, 'onAddToCart' | 'onQuickView' | 'onToggleWishlist' | 'isProductInWishlist' | 'onToggleCompare' | 'isProductInCompare' | 'onAddToCollection' | 'onNotifyMe'> & { product: Product; searchQuery: string }> = 
({ product, onAddToCart, searchQuery, onQuickView, onToggleWishlist, isProductInWishlist, onToggleCompare, isProductInCompare, onAddToCollection, onNotifyMe }) => {
    const isOutOfStock = product.stock.level === 'out-of-stock';
    return (
        <>
        <div className="relative group">
            <ImageWithSkeleton src={product.imageUrl} alt={product.name} className="w-full h-48 object-cover" />
            
            {product.tags?.map(tag => {
                if (tag === 'New') {
                    return (
                        <span key={tag} className="product-badge product-badge-new">
                            <SparklesIcon className="w-4 h-4" />
                            <span>{tag}</span>
                        </span>
                    );
                }
                if (tag === 'Best Seller') {
                    return (
                        <span key={tag} className="product-badge product-badge-bestseller">
                            <FlameIcon className="w-4 h-4" />
                            <span>{tag}</span>
                        </span>
                    );
                }
                return null;
            })}
            <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Tooltip text="Quick View"><motion.button whileTap={{scale: 0.9}} onClick={(e) => { e.stopPropagation(); onQuickView(product); }} className="p-2 bg-[var(--background-secondary)]/80 backdrop-blur-sm rounded-full hover:bg-[var(--primary-accent)] hover:text-white" aria-label="Quick View"><EyeIcon className="w-5 h-5"/></motion.button></Tooltip>
                <Tooltip text={isProductInWishlist(product.id) ? "Remove from Wishlist" : "Add to Wishlist"}><motion.button whileTap={{scale: 0.9}} onClick={(e) => { e.stopPropagation(); onToggleWishlist(product); }} className={`p-2 bg-[var(--background-secondary)]/80 backdrop-blur-sm rounded-full hover:bg-[var(--primary-accent)] transition-colors ${isProductInWishlist(product.id) ? 'text-[var(--primary-accent)]' : ''}`} aria-label="Add to Wishlist"><HeartIcon className={`w-5 h-5 ${isProductInWishlist(product.id) ? 'fill-current' : ''}`}/></motion.button></Tooltip>
                <Tooltip text="Add to Collection"><motion.button whileTap={{scale: 0.9}} onClick={(e) => { e.stopPropagation(); onAddToCollection(product); }} className="p-2 bg-[var(--background-secondary)]/80 backdrop-blur-sm rounded-full hover:bg-[var(--primary-accent)] hover:text-white" aria-label="Add to Collection"><BookmarkIcon className="w-5 h-5"/></motion.button></Tooltip>
                <Tooltip text={isProductInCompare(product.id) ? "Remove from Compare" : "Add to Compare"}><motion.button whileTap={{scale: 0.9}} onClick={(e) => { e.stopPropagation(); onToggleCompare(product); }} className={`p-2 bg-[var(--background-secondary)]/80 backdrop-blur-sm rounded-full hover:bg-[var(--primary-accent)] transition-colors ${isProductInCompare(product.id) ? 'text-[var(--primary-accent)]' : ''}`} aria-label="Add to Compare"><PlusIcon className={`w-5 h-5 ${isProductInCompare(product.id) ? 'rotate-45' : ''}`}/></motion.button></Tooltip>
                <Tooltip text="Share"><motion.button whileTap={{scale: 0.9}} onClick={(e) => { e.stopPropagation(); navigator.clipboard.writeText(window.location.href); }} className="p-2 bg-[var(--background-secondary)]/80 backdrop-blur-sm rounded-full hover:bg-[var(--primary-accent)] hover:text-white" aria-label="Share product"><ShareIcon className="w-5 h-5"/></motion.button></Tooltip>
            </div>
        </div>
        <div className="p-4 flex flex-col flex-grow">
            <h3 className="text-lg font-semibold text-[var(--text-primary)] flex-grow h-14">{highlightMatch(product.name, searchQuery)}</h3>
            <div className="mt-2"><StockIndicator stock={product.stock} /></div>
            <div className="mt-4 flex justify-between items-center">
            <p className="text-2xl font-bold text-[var(--primary-accent)] tabular-nums">${product.price.toFixed(2)}</p>
            {isOutOfStock ? (
                <Tooltip text="Notify me when back in stock">
                    <motion.button 
                        whileTap={{ scale: 0.90 }}
                        onClick={(e) => { e.stopPropagation(); onNotifyMe(product); }}
                        className="p-2 bg-[var(--background-tertiary)] text-[var(--text-secondary)] rounded-[var(--border-radius)] hover:bg-[var(--primary-accent)] hover:text-white transition-colors"
                        aria-label={`Notify me about ${product.name}`}
                    >
                        <BellIcon className="w-5 h-5" />
                    </motion.button>
                </Tooltip>
            ) : (
                 <motion.button 
                    whileTap={{ scale: 0.90 }}
                    onClick={(e) => { e.stopPropagation(); onAddToCart(product, 1, e); }}
                    className="p-2 bg-[var(--primary-accent)] text-white rounded-[var(--border-radius)] hover:bg-[var(--primary-accent-hover)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label={`Add ${product.name} to cart`}
                >
                    <CartIcon className="w-5 h-5" />
                </motion.button>
            )}
            </div>
        </div>
        </>
    );
};


const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const GridView: React.FC<GridViewProps> = React.memo((props) => {
  const motionProps = props.reduceMotion ? {} : {
    variants: containerVariants,
    initial: "hidden",
    animate: "visible",
  };

  return (
    <motion.div 
      className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6"
      {...motionProps}
    >
      {props.products.map((product) => (
        <div key={product.id} className="interactive-border">
          <BaseCard onClick={() => props.onProductClick(product)} reduceMotion={props.reduceMotion}>
            <div className="bg-[var(--background-secondary)] rounded-[var(--border-radius)] overflow-hidden shadow-lg flex flex-col h-full transition-shadow duration-300 hover:shadow-2xl">
              <ProductCardContent
                product={product}
                onAddToCart={props.onAddToCart}
                searchQuery={props.searchQuery}
                onQuickView={props.onQuickView}
                onToggleWishlist={props.onToggleWishlist}
                isProductInWishlist={props.isProductInWishlist}
                onToggleCompare={props.onToggleCompare}
                isProductInCompare={props.isProductInCompare}
                onAddToCollection={props.onAddToCollection}
                onNotifyMe={props.onNotifyMe}
              />
            </div>
          </BaseCard>
        </div>
      ))}
    </motion.div>
  );
});

export default GridView;