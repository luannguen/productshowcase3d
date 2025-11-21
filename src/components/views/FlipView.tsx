
import React from 'react';
import { motion } from 'framer-motion';
import { Product } from '../../types';
import { CartIcon, HeartIcon, EyeIcon, PlusIcon, ShareIcon, BookmarkIcon, BellIcon } from '../ui/icons';
import BaseCard from '../ui/BaseCard';
import Tooltip from '../ui/Tooltip';
import ImageWithSkeleton from '../ui/ImageWithSkeleton';

interface FlipViewProps {
  products: Product[];
  onProductClick: (product: Product) => void;
  onAddToCart: (product: Product, quantity: number, event?: React.MouseEvent<HTMLButtonElement>) => void;
  onQuickView: (product: Product) => void;
  onToggleWishlist: (product: Product) => void;
  isProductInWishlist: (id: number) => boolean;
  onToggleCompare: (product: Product) => void;
  isProductInCompare: (id: number) => boolean;
  reduceMotion: boolean;
  onAddToCollection: (product: Product) => void;
  onNotifyMe: (product: Product) => void;
  onReadBook: (product: Product) => void;
}

const FlipCard: React.FC<Omit<FlipViewProps, 'products' | 'reduceMotion'> & { product: Product; }> = 
({ product, onAddToCart, onQuickView, onToggleWishlist, isProductInWishlist, onToggleCompare, isProductInCompare, onAddToCollection, onNotifyMe, onReadBook }) => {
    const isOutOfStock = product.stock.level === 'out-of-stock';
    return (
        <div className="group h-80 w-full perspective-1000">
            <div className="flipper relative w-full h-full transform-style-3d transition-transform duration-700">
                {/* Front */}
                <div className="absolute w-full h-full backface-hidden rounded-[var(--border-radius)] overflow-hidden shadow-xl group-hover:shadow-2xl transition-shadow bg-[var(--background-secondary)] flex flex-col">
                    <div className="relative">
                        <ImageWithSkeleton src={product.imageUrl} alt={product.name} className="w-full h-48 object-cover" />
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
                        <Tooltip text="Quick View"><motion.button whileTap={{scale: 0.9}} onClick={(e) => { e.stopPropagation(); onQuickView(product); }} className="p-2 bg-[var(--background-secondary)] rounded-full hover:bg-[var(--primary-accent)] hover:text-white" aria-label="Quick View"><EyeIcon className="w-5 h-5"/></motion.button></Tooltip>
                        <Tooltip text={isProductInWishlist(product.id) ? "Remove from Wishlist" : "Add to Wishlist"}><motion.button whileTap={{scale: 0.9}} onClick={(e) => { e.stopPropagation(); onToggleWishlist(product); }} className={`p-2 bg-[var(--background-secondary)] rounded-full hover:bg-[var(--primary-accent)] transition-colors ${isProductInWishlist(product.id) ? 'text-[var(--primary-accent)]' : ''}`} aria-label="Add to Wishlist"><HeartIcon className={`w-5 h-5 ${isProductInWishlist(product.id) ? 'fill-current' : ''}`}/></motion.button></Tooltip>
                        <Tooltip text="Add to Collection"><motion.button whileTap={{scale: 0.9}} onClick={(e) => { e.stopPropagation(); onAddToCollection(product); }} className="p-2 bg-[var(--background-secondary)] rounded-full hover:bg-[var(--primary-accent)] hover:text-white" aria-label="Add to Collection"><BookmarkIcon className="w-5 h-5"/></motion.button></Tooltip>
                        <Tooltip text={isProductInCompare(product.id) ? "Remove from Compare" : "Add to Compare"}><motion.button whileTap={{scale: 0.9}} onClick={(e) => { e.stopPropagation(); onToggleCompare(product); }} className={`p-2 bg-[var(--background-secondary)] rounded-full hover:bg-[var(--primary-accent)] transition-colors ${isProductInCompare(product.id) ? 'text-[var(--primary-accent)]' : ''}`} aria-label="Add to Compare"><PlusIcon className={`w-5 h-5 transition-transform ${isProductInCompare(product.id) ? 'rotate-45' : ''}`}/></motion.button></Tooltip>
                        <Tooltip text="Share"><motion.button whileTap={{scale: 0.9}} onClick={(e) => { e.stopPropagation(); navigator.clipboard.writeText(window.location.href); }} className="p-2 bg-[var(--background-secondary)] rounded-full hover:bg-[var(--primary-accent)] hover:text-white" aria-label="Share product"><ShareIcon className="w-5 h-5"/></motion.button></Tooltip>
                     </div>
                     <div className="mt-3 flex justify-between items-center w-full">
                        <p className="text-xl font-bold text-[var(--primary-accent)] tabular-nums">${product.price.toFixed(2)}</p>
                        <div className="flex items-center gap-2">
                            {product.content && (
                                <motion.button whileTap={{ scale: 0.95 }} onClick={(e) => { e.stopPropagation(); onReadBook(product); }} className="px-3 py-2 bg-[var(--background-secondary)] text-white font-semibold rounded-[var(--border-radius)] hover:bg-[var(--primary-accent)] transition-all">Read</motion.button>
                            )}
                            {isOutOfStock ? (
                                <Tooltip text="Notify Me">
                                    <motion.button whileTap={{ scale: 0.95 }} onClick={(e) => { e.stopPropagation(); onNotifyMe(product); }} className="flex items-center gap-2 px-3 py-2 bg-[var(--background-secondary)] text-[var(--text-primary)] font-semibold rounded-[var(--border-radius)] hover:brightness-110 transition-all" aria-label={`Notify me about ${product.name}`}>
                                        <BellIcon className="w-5 h-5" />
                                    </motion.button>
                                </Tooltip>
                            ) : (
                                <motion.button whileTap={{ scale: 0.95 }} onClick={(e) => { e.stopPropagation(); onAddToCart(product, 1, e); }} className="flex items-center gap-2 px-3 py-2 bg-[var(--primary-accent)] text-white font-semibold rounded-[var(--border-radius)] hover:brightness-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed" aria-label={`Add ${product.name} to cart`}>
                                    <CartIcon className="w-5 h-5" /> Add
                                </motion.button>
                            )}
                        </div>
                     </div>
                </div>
            </div>
        </div>
    );
};


const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.07 } },
};

const FlipView: React.FC<FlipViewProps> = React.memo((props) => {
  const motionProps = props.reduceMotion ? {} : {
    variants: containerVariants,
    initial: "hidden",
    animate: "visible",
  };
  return (
    <motion.div 
      className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-8"
      {...motionProps}
    >
      {props.products.map((product) => (
        <div key={product.id} className="interactive-border">
          <BaseCard onClick={() => props.onProductClick(product)} reduceMotion={props.reduceMotion}>
            <div className="group">
              <FlipCard
                product={product}
                onProductClick={props.onProductClick}
                onAddToCart={props.onAddToCart}
                onQuickView={props.onQuickView}
                onToggleWishlist={props.onToggleWishlist}
                isProductInWishlist={props.isProductInWishlist}
                onToggleCompare={props.onToggleCompare}
                isProductInCompare={props.isProductInCompare}
                onAddToCollection={props.onAddToCollection}
                onNotifyMe={props.onNotifyMe}
                onReadBook={props.onReadBook}
              />
            </div>
          </BaseCard>
        </div>
      ))}
    </motion.div>
  );
});

export default FlipView;