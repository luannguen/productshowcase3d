
import React from 'react';
import { Product } from '../types';

interface GridViewProps {
  products: Product[];
}

const ProductCard: React.FC<{ product: Product }> = ({ product }) => (
  <div className="bg-[var(--background-secondary)] rounded-[var(--border-radius)] overflow-hidden shadow-lg transform hover:scale-105 transition-transform duration-300 ease-in-out">
    <img src={product.imageUrl} alt={product.name} className="w-full h-48 object-cover" />
    <div className="p-4">
      <h3 className="text-lg font-semibold text-[var(--text-primary)]">{product.name}</h3>
      <p className="mt-2 text-2xl font-bold text-[var(--primary-accent)]">${product.price.toFixed(2)}</p>
    </div>
  </div>
);

const GridView: React.FC<GridViewProps> = ({ products }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};

export default GridView;
