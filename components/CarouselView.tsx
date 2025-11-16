
import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Product } from '../types';
import { CartIcon } from './icons';

interface CarouselViewProps {
  products: Product[];
  onProductClick: (product: Product) => void;
  onAddToCart: (product: Product) => void;
}

const CarouselView: React.FC<CarouselViewProps> = ({ products, onProductClick, onAddToCart }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const angle = 360 / products.length;

  const rotateTo = useCallback((index: number) => {
    setActiveIndex(index);
  }, []);

  const rotateCarousel = (direction: 'next' | 'prev') => {
    setActiveIndex(prev => (direction === 'next' ? (prev + 1) % products.length : (prev - 1 + products.length) % products.length));
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'ArrowRight') {
            rotateCarousel('next');
        } else if (e.key === 'ArrowLeft') {
            rotateCarousel('prev');
        }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
        window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const rotation = -activeIndex * angle;

  return (
    <div className="flex flex-col items-center justify-center py-16 min-h-[60vh]">
        <div className="carousel-container w-full h-[300px] flex items-center justify-center">
            <div className="carousel" style={{ transform: `rotateY(${rotation}deg)` }}>
            {products.map((product, i) => {
                const itemAngle = angle * i;
                const isFacingFront = i === activeIndex;
                const scale = isFacingFront ? 1 : 0.85;
                const opacity = isFacingFront ? 1 : 0.5;
                const blur = isFacingFront ? 'blur(0px)' : 'blur(2px)';

                const translateZ = (products.length > 5) ? 400 : 250;

                return (
                    <div
                        key={product.id}
                        className="carousel-item"
                        style={{ 
                            transform: `rotateY(${itemAngle}deg) translateZ(${translateZ}px) scale(${scale})`,
                            opacity: opacity,
                            filter: blur,
                            cursor: 'pointer'
                        }}
                        onClick={() => onProductClick(product)}
                    >
                         <div className="bg-[var(--background-secondary)] rounded-[var(--border-radius)] overflow-hidden shadow-lg w-full h-full flex flex-col items-center justify-center text-center p-4 border-2 border-[var(--primary-accent)]/30">
                            <motion.img 
                                src={product.imageUrl} 
                                alt={product.name} 
                                className="w-3/4 h-32 object-contain rounded-md" 
                                layoutId={`product-image-${product.id}`}
                            />
                            <h3 className="mt-4 text-lg font-semibold text-[var(--text-primary)]">{product.name}</h3>
                            <div className="mt-2 flex w-full justify-around items-center">
                                <p className="text-xl font-bold text-[var(--primary-accent)]">${product.price.toFixed(2)}</p>
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
                    </div>
                );
            })}
            </div>
        </div>
        <div className="mt-8 flex space-x-4">
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
        <div className="mt-8 flex space-x-2">
            {products.map((_, index) => (
                <button
                    key={index}
                    onClick={() => rotateTo(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${activeIndex === index ? 'bg-[var(--primary-accent)] scale-125' : 'bg-[var(--background-tertiary)]/70'}`}
                    aria-label={`Go to product ${index + 1}`}
                />
            ))}
        </div>
    </div>
  );
};

export default CarouselView;