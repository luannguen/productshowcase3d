
import React from 'react';
import { Product } from '../types';

interface ListViewProps {
  products: Product[];
}

const ListView: React.FC<ListViewProps> = ({ products }) => {
  return (
    <div className="space-y-4">
      {products.map((product) => (
        <div key={product.id} className="flex flex-col sm:flex-row items-center bg-[var(--background-secondary)] rounded-[var(--border-radius)] shadow-md overflow-hidden p-4 hover:bg-[var(--background-tertiary)]/50 transition-colors duration-300">
          <img src={product.imageUrl} alt={product.name} className="w-full sm:w-48 h-48 sm:h-auto object-cover rounded-md" />
          <div className="sm:ml-6 mt-4 sm:mt-0 flex-1">
            <h3 className="text-xl font-bold text-[var(--text-primary)]">{product.name}</h3>
            <p className="text-[var(--text-secondary)] mt-2">{product.description}</p>
          </div>
          <div className="mt-4 sm:mt-0 sm:ml-6 text-center sm:text-right">
            <p className="text-2xl font-bold text-[var(--primary-accent)]">${product.price.toFixed(2)}</p>
            <button className="mt-3 px-4 py-2 bg-[var(--primary-accent)] text-white font-semibold rounded-[var(--border-radius)] hover:bg-[var(--primary-accent-hover)] transition-colors duration-200">
              View Details
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ListView;
