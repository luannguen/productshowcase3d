
import React, { useState } from 'react';
import { Product } from '../types';

interface CarouselViewProps {
  products: Product[];
}

const CarouselView: React.FC<CarouselViewProps> = ({ products }) => {
  const [rotation, setRotation] = useState(0);
  const angle = 360 / products.length;

  const rotateCarousel = (direction: 'next' | 'prev') => {
    setRotation(prev => prev + (direction === 'next' ? -angle : angle));
  };

  return (
    <div className="flex flex-col items-center justify-center py-16 min-h-[60vh]">
        <div className="carousel-container w-full h-[300px] flex items-center justify-center">
            <div className="carousel" style={{ transform: `rotateY(${rotation}deg)` }}>
            {products.map((product, i) => {
                const itemAngle = angle * i;
                const translateZ = (products.length > 5) ? 400 : 250;
                return (
                    <div
                        key={product.id}
                        className="carousel-item"
                        style={{ transform: `rotateY(${itemAngle}deg) translateZ(${translateZ}px)` }}
                    >
                         <div className="bg-[var(--background-secondary)] rounded-[var(--border-radius)] overflow-hidden shadow-lg w-full h-full flex flex-col items-center justify-center text-center p-4 border-2 border-[var(--primary-accent)]/30">
                            <img src={product.imageUrl} alt={product.name} className="w-3/4 h-32 object-contain rounded-md" />
                            <h3 className="mt-4 text-lg font-semibold text-[var(--text-primary)]">{product.name}</h3>
                            <p className="mt-1 text-xl font-bold text-[var(--primary-accent)]">${product.price.toFixed(2)}</p>
                        </div>
                    </div>
                );
            })}
            </div>
        </div>
        <div className="mt-12 flex space-x-4">
            <button 
                onClick={() => rotateCarousel('prev')}
                className="px-6 py-2 bg-[var(--background-tertiary)] text-[var(--text-primary)] font-semibold rounded-[var(--border-radius)] hover:bg-[var(--primary-accent)] transition-colors duration-300 shadow-md">
                Prev
            </button>
            <button 
                onClick={() => rotateCarousel('next')}
                className="px-6 py-2 bg-[var(--background-tertiary)] text-[var(--text-primary)] font-semibold rounded-[var(--border-radius)] hover:bg-[var(--primary-accent)] transition-colors duration-300 shadow-md">
                Next
            </button>
        </div>
    </div>
  );
};

export default CarouselView;
