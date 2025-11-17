import React from 'react';
import { motion } from 'framer-motion';
import { Product } from '../types';
import { CartIcon } from './icons';
import BaseCard from './BaseCard';

interface GridViewProps {
  products: Product[];
  onProductClick: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  searchQuery: string;
}

const highlightMatch = (text: string, query: string) => {
    if (!query) return text;
    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    return (
        <>
            {parts.map((part, i) =>
                part.toLowerCase() === query.toLowerCase() ? (
                    <mark key={i}>{part}</mark>
                ) : (
                    part
                )
            )}
        </>
    );
};

const ProductCardContent: React.FC<{ product: Product; onAddToCart: (product: Product) => void; searchQuery: string }> = ({ product, onAddToCart, searchQuery }) => (
  <>
    <div className="relative shine-effect">
      <motion.img 
          src={product.imageUrl} 
          alt={product.name} 
          className="w-full h-48 object-cover"
          layoutId={`product-image-${product.id}`}
          loading="lazy"
      />
      {product.tags && product.tags.length > 0 && (
        <span className="product-badge">{product.tags[0]}</span>
      )}
    </div>
    <div className="p-4 flex flex-col flex-grow">
      <h3 className="text-lg font-semibold text-[var(--text-primary)] flex-grow">
        {highlightMatch(product.name, searchQuery)}
      </h3>
      <div className="mt-4 flex justify-between items-center">
        <p className="text-2xl font-bold text-[var(--primary-accent)] tabular-nums">${product.price.toFixed(2)}</p>
        <motion.button 
          whileTap={{ scale: 0.90 }}
          onClick={(e) => {
            e.stopPropagation();
            onAddToCart(product);
          }}
          className="p-2 bg-[var(--primary-accent)] text-white rounded-[var(--border-radius)] hover:bg-[var(--primary-accent-hover)] transition-colors duration-200"
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
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const GridView: React.FC<GridViewProps> = ({ products, onProductClick, onAddToCart, searchQuery }) => {
  return (
    <>
      <div className="mb-4">
        <p className="text-sm text-[var(--text-secondary)]">
          Displaying <span className="font-bold text-[var(--text-primary)]">{products.length}</span> product{products.length !== 1 ? 's' : ''}.
        </p>
      </div>
      <motion.div 
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {products.map((product) => (
          <BaseCard key={product.id} onClick={() => onProductClick(product)}>
            <div className="bg-[var(--background-secondary)] rounded-[var(--border-radius)] overflow-hidden shadow-lg flex flex-col h-full">
              <ProductCardContent product={product} onAddToCart={onAddToCart} searchQuery={searchQuery} />
            </div>
          </BaseCard>
        ))}
      </motion.div>
    </>
  );
};

export default GridView;