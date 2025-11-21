import React from 'react';
import { motion } from 'framer-motion';
import { Product } from '../../types';

interface RecentlyViewedProps {
  products: Product[];
  onProductClick: (product: Product) => void;
}

const RecentlyViewed: React.FC<RecentlyViewedProps> = ({ products, onProductClick }) => {
  if (products.length === 0) return null;

  return (
    <section className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4">Recently Viewed</h2>
      <div className="flex gap-6 overflow-x-auto pb-4 no-scrollbar">
        {products.map(product => (
          <motion.div
            key={product.id}
            onClick={() => onProductClick(product)}
            className="flex-shrink-0 w-48 cursor-pointer group"
            whileHover={{ y: -5 }}
          >
            <div className="bg-[var(--background-secondary)] rounded-[var(--border-radius)] overflow-hidden shadow-lg h-full">
              <img src={product.imageUrl} alt={product.name} className="w-full h-32 object-cover" />
              <div className="p-3">
                <h3 className="text-sm font-semibold text-[var(--text-primary)] truncate group-hover:text-[var(--primary-accent)] transition-colors">{product.name}</h3>
                <p className="text-lg font-bold text-[var(--primary-accent)] tabular-nums">${product.price.toFixed(2)}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default RecentlyViewed;