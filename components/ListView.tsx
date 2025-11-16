
import React from 'react';
import { motion } from 'framer-motion';
import { Product } from '../types';
import { CartIcon } from './icons';

interface ListViewProps {
  products: Product[];
  onProductClick: (product: Product) => void;
  onAddToCart: (product: Product) => void;
}

const ListView: React.FC<ListViewProps> = ({ products, onProductClick, onAddToCart }) => {
  return (
    <div className="space-y-4">
      {products.map((product) => (
        <div 
          key={product.id} 
          className="flex flex-col sm:flex-row items-center bg-[var(--background-secondary)] rounded-[var(--border-radius)] shadow-md overflow-hidden p-4 hover:bg-[var(--background-tertiary)]/50 transition-colors duration-300 cursor-pointer"
          onClick={() => onProductClick(product)}
        >
          <motion.img 
            src={product.imageUrl} 
            alt={product.name} 
            className="w-full sm:w-48 h-48 sm:h-32 object-cover rounded-md"
            layoutId={`product-image-${product.id}`}
          />
          <div className="sm:ml-6 mt-4 sm:mt-0 flex-1">
            <h3 className="text-2xl font-bold text-[var(--text-primary)]">{product.name}</h3>
            <p className="text-[var(--text-secondary)] mt-2 leading-relaxed">{product.description}</p>
          </div>
          <div className="mt-4 sm:mt-0 sm:ml-6 text-center sm:text-right flex-shrink-0">
            <p className="text-3xl font-bold text-[var(--primary-accent)]">${product.price.toFixed(2)}</p>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onAddToCart(product);
              }}
              className="mt-3 w-full px-4 py-2 bg-[var(--primary-accent)] text-white font-semibold rounded-[var(--border-radius)] hover:bg-[var(--primary-accent-hover)] transition-colors duration-200 flex items-center justify-center gap-2 add-to-cart-animation"
              aria-label={`Add ${product.name} to cart`}
            >
              <CartIcon className="w-5 h-5" />
              Add to Cart
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ListView;