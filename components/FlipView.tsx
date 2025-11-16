
import React from 'react';
import { Product } from '../types';

interface FlipViewProps {
  products: Product[];
}

const FlipCard: React.FC<{ product: Product }> = ({ product }) => (
    <div className="group h-80 w-full perspective-1000">
        <div className="flipper relative w-full h-full transform-style-3d transition-transform duration-700">
            {/* Front of card */}
            <div className="absolute w-full h-full backface-hidden rounded-[var(--border-radius)] overflow-hidden shadow-xl bg-[var(--background-secondary)] flex flex-col">
                <img src={product.imageUrl} alt={product.name} className="w-full h-48 object-cover" />
                <div className="p-4 flex flex-col flex-grow justify-between">
                    <h3 className="text-xl font-bold text-[var(--text-primary)]">{product.name}</h3>
                    <p className="text-2xl font-bold text-[var(--primary-accent)] self-end">${product.price.toFixed(2)}</p>
                </div>
            </div>
            {/* Back of card */}
            <div className="absolute w-full h-full backface-hidden rotate-y-180 rounded-[var(--border-radius)] overflow-hidden shadow-xl bg-[var(--background-tertiary)] p-6 flex flex-col justify-center items-center text-center">
                 <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">{product.name}</h3>
                <p className="text-[var(--text-secondary)]">{product.description}</p>
                 <p className="mt-4 text-2xl font-bold text-[var(--primary-accent)]">${product.price.toFixed(2)}</p>
            </div>
        </div>
    </div>
);


const FlipView: React.FC<FlipViewProps> = ({ products }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
      {products.map((product) => (
        <FlipCard key={product.id} product={product} />
      ))}
    </div>
  );
};

export default FlipView;
