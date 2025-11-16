
import React from 'react';
import { motion } from 'framer-motion';
import { Product } from '../types';
import { CartIcon } from './icons';
import BaseCard from './BaseCard';

interface GridViewProps {
  products: Product[];
  onProductClick: (product: Product) => void;
  onAddToCart: (product: Product) => void;
}

const ProductCardContent: React.FC<{ product: Product, onAddToCart: (product: Product) => void; }> = ({ product, onAddToCart }) => (
  <>
    <motion.img 
        src={product.imageUrl} 
        alt={product.name} 
        className="w-full h-48 object-cover"
        layoutId={`product-image-${product.id}`}
    />
    <div className="p-4 flex flex-col flex-grow">
      <h3 className="text-lg font-semibold text-[var(--text-primary)] flex-grow">{product.name}</h3>
      <div className="mt-4 flex justify-between items-center">
        <p className="text-2xl font-bold text-[var(--primary-accent)]">${product.price.toFixed(2)}</p>
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onAddToCart(product);
          }}
          className="p-2 bg-[var(--primary-accent)] text-white rounded-[var(--border-radius)] hover:bg-[var(--primary-accent-hover)] transition-colors duration-200 add-to-cart-animation"
          aria-label={`Add ${product.name} to cart`}
        >
          <CartIcon className="w-5 h-5" />
        </button>
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

const GridView: React.FC<GridViewProps> = ({ products, onProductClick, onAddToCart }) => {
  return (
    <motion.div 
      className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {products.map((product) => (
        <BaseCard key={product.id} onClick={() => onProductClick(product)}>
          <div className="gradient-border-hover bg-[var(--background-secondary)] rounded-[var(--border-radius)] overflow-hidden shadow-lg flex flex-col h-full">
            <ProductCardContent product={product} onAddToCart={onAddToCart} />
          </div>
        </BaseCard>
      ))}
    </motion.div>
  );
};

export default GridView;