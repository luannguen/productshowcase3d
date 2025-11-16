
import React from 'react';
import { motion } from 'framer-motion';
import { Product } from '../types';
import { CartIcon } from './icons';
import BaseCard from './BaseCard';

interface FlipViewProps {
  products: Product[];
  onProductClick: (product: Product) => void;
  onAddToCart: (product: Product) => void;
}

const FlipCard: React.FC<{ product: Product; onAddToCart: (product: Product) => void; }> = ({ product, onAddToCart }) => (
    <div className="group h-80 w-full perspective-1000">
        <div className="flipper relative w-full h-full transform-style-3d transition-transform duration-700">
            {/* Front of card */}
            <div className="absolute w-full h-full backface-hidden rounded-[var(--border-radius)] overflow-hidden shadow-xl bg-[var(--background-secondary)] flex flex-col">
                <motion.img 
                    src={product.imageUrl} 
                    alt={product.name} 
                    className="w-full h-48 object-cover" 
                    layoutId={`product-image-${product.id}`}
                />
                <div className="p-4 flex flex-col flex-grow justify-between">
                    <h3 className="text-xl font-bold text-[var(--text-primary)]">{product.name}</h3>
                    <p className="text-2xl font-bold text-[var(--primary-accent)] self-end">${product.price.toFixed(2)}</p>
                </div>
            </div>
            {/* Back of card */}
            <div className="absolute w-full h-full backface-hidden rotate-y-180 rounded-[var(--border-radius)] overflow-hidden shadow-xl bg-[var(--background-tertiary)] p-6 flex flex-col justify-center items-center text-center">
                 <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">{product.name}</h3>
                <p className="text-[var(--text-secondary)] flex-grow">{product.description}</p>
                 <div className="mt-4 flex justify-between items-center w-full">
                    <p className="text-2xl font-bold text-[var(--primary-accent)]">${product.price.toFixed(2)}</p>
                    <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          onAddToCart(product);
                        }}
                        className="btn-3d flex items-center gap-2 px-4 py-2 bg-[var(--primary-accent)] text-white font-semibold rounded-[var(--border-radius)] hover:brightness-110 transition-all duration-200"
                        aria-label={`Add ${product.name} to cart`}
                        >
                        <CartIcon className="w-5 h-5" />
                        Add to Cart
                    </button>
                 </div>
            </div>
        </div>
    </div>
);

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.07,
    },
  },
};

const FlipView: React.FC<FlipViewProps> = ({ products, onProductClick, onAddToCart }) => {
  return (
    <motion.div 
      className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {products.map((product) => (
        <BaseCard key={product.id} onClick={() => onProductClick(product)}>
          <div className="group" onMouseEnter={e => e.currentTarget.classList.add('hover')} onMouseLeave={e => e.currentTarget.classList.remove('hover')}>
            <FlipCard product={product} onAddToCart={onAddToCart} />
          </div>
        </BaseCard>
      ))}
    </motion.div>
  );
};

export default FlipView;