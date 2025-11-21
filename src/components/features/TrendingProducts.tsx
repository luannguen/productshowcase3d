import React from 'react';
import { motion } from 'framer-motion';
import { Product } from '../../types';
import { FlameIcon } from '../ui/icons';

interface TrendingProductsProps {
  products: Product[];
  onProductClick: (product: Product) => void;
}

const TrendingProducts: React.FC<TrendingProductsProps> = ({ products, onProductClick }) => {
  if (products.length === 0) return null;

  return (
    <section className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4 flex items-center gap-2">
        <FlameIcon className="w-6 h-6 text-orange-500" />
        Trending Now
      </h2>
      <div className="flex gap-6 overflow-x-auto pb-4 -mx-4 px-4 no-scrollbar">
        {products.map(product => (
          <motion.div
            key={product.id}
            onClick={() => onProductClick(product)}
            className="flex-shrink-0 w-64 cursor-pointer group"
            whileHover={{ y: -5 }}
          >
            <div className="bg-[var(--background-secondary)] rounded-[var(--border-radius)] overflow-hidden shadow-lg h-full flex flex-col">
              <img src={product.imageUrl} alt={product.name} className="w-full h-40 object-cover" />
              <div className="p-3 flex flex-col flex-grow">
                <h3 className="text-md font-semibold text-[var(--text-primary)] truncate group-hover:text-[var(--primary-accent)] transition-colors">{product.name}</h3>
                <p className="text-lg font-bold text-[var(--primary-accent)] tabular-nums mt-auto pt-2">${product.price.toFixed(2)}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default TrendingProducts;