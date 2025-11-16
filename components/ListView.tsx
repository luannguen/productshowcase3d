import React from 'react';
import { motion } from 'framer-motion';
import { Product } from '../types';
import { CartIcon } from './icons';

interface ListViewProps {
  products: Product[];
  onProductClick: (product: Product) => void;
  onAddToCart: (product: Product) => void;
}

const ListItem: React.FC<{ product: Product, onProductClick: (product: Product) => void, onAddToCart: (product: Product) => void }> = ({ product, onProductClick, onAddToCart }) => {
    
    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const { currentTarget: target } = e;
        const rect = target.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        target.style.setProperty("--x", `${x}px`);
        target.style.setProperty("--y", `${y}px`);
    };

    return (
        <div 
          className="flex flex-col sm:flex-row items-center rounded-[var(--border-radius)] shadow-md overflow-hidden p-4 transition-colors duration-300 cursor-pointer aurora-item"
          onMouseMove={handleMouseMove}
          onClick={() => onProductClick(product)}
        >
          <motion.img 
            src={product.imageUrl} 
            alt={product.name} 
            className="w-full sm:w-48 h-48 sm:h-32 object-cover rounded-md flex-shrink-0"
            layoutId={`product-image-${product.id}`}
          />
          <div className="sm:ml-6 mt-4 sm:mt-0 flex-1 z-10">
            <h3 className="text-2xl font-bold text-[var(--text-primary)]">{product.name}</h3>
            <p className="text-[var(--text-secondary)] mt-2 leading-relaxed">{product.description}</p>
          </div>
          <div className="mt-4 sm:mt-0 sm:ml-6 text-center sm:text-right flex-shrink-0 z-10">
            <p className="text-3xl font-bold text-[var(--primary-accent)] tabular-nums">${product.price.toFixed(2)}</p>
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
    );
};

const ListView: React.FC<ListViewProps> = ({ products, onProductClick, onAddToCart }) => {
  return (
    <div className="space-y-4">
      {products.map((product) => (
        <ListItem 
          key={product.id} 
          product={product}
          onProductClick={onProductClick}
          onAddToCart={onAddToCart}
        />
      ))}
    </div>
  );
};

export default ListView;