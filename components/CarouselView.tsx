import React, { useState, useEffect, useCallback, useRef } from 'react';
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
  const angle = products.length > 0 ? 360 / products.length : 0;
  const isDragging = useRef(false);
  const rotationRef = useRef(0);

  const rotateTo = useCallback((index: number) => {
    if (products.length === 0) return;
    const currentRotation = rotationRef.current;
    const currentCycle = Math.round(currentRotation / 360);
    const targetAngle = -index * angle;

    // Find the shortest path to rotate
    const directPath = targetAngle;
    const forwardPath = targetAngle - 360;
    const backwardPath = targetAngle + 360;

    const currentActualRotation = currentRotation % 360;
    const diffDirect = Math.abs(currentActualRotation - (targetAngle % 360));
    const diffForward = Math.abs(currentActualRotation - (forwardPath % 360));
    const diffBackward = Math.abs(currentActualRotation - (backwardPath % 360));

    let finalAngle = targetAngle;
    if (diffForward < diffDirect && diffForward < diffBackward) {
        finalAngle = forwardPath;
    } else if (diffBackward < diffDirect && diffBackward < diffForward) {
        finalAngle = backwardPath;
    }

    rotationRef.current = finalAngle + (360 * currentCycle);
    setActiveIndex(index);
  }, [angle, products.length]);

  const rotateCarousel = useCallback((direction: 'next' | 'prev') => {
      const newIndex = direction === 'next'
          ? (activeIndex + 1) % products.length
          : (activeIndex - 1 + products.length) % products.length;
      
      if (direction === 'next') {
        if( (rotationRef.current / angle) % products.length === -newIndex + 1 ){
             rotationRef.current -= angle;
        } else {
             rotationRef.current = Math.round(rotationRef.current/angle)*angle - angle;
        }
      } else {
        if( (rotationRef.current / angle) % products.length === -newIndex - 1 ){
            rotationRef.current += angle;
        } else {
            rotationRef.current = Math.round(rotationRef.current/angle)*angle + angle;
        }
      }
      setActiveIndex(newIndex);
  }, [activeIndex, products.length, angle]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'ArrowRight') rotateCarousel('next');
        else if (e.key === 'ArrowLeft') rotateCarousel('prev');
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [rotateCarousel]);

  // Snap to nearest item logic
  const handleDragEnd = () => {
    if (!isDragging.current) return;
    isDragging.current = false;
    const closestIndex = Math.round(-rotationRef.current / angle) % products.length;
    const finalIndex = (closestIndex + products.length) % products.length;
    rotateTo(finalIndex);
  };

  const rotation = rotationRef.current;

  return (
    <div className="flex flex-col items-center justify-center py-16 min-h-[60vh]">
        <div className="carousel-container w-full h-[300px] flex items-center justify-center">
            <motion.div 
              className="carousel" 
              style={{ transform: `rotateY(${rotation}deg)` }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              onDragStart={() => { isDragging.current = true; }}
              onDrag={(_, info) => { rotationRef.current += info.delta.x * 0.5; }}
              onDragEnd={handleDragEnd}
            >
            {products.map((product, i) => {
                const itemAngle = angle * i;
                const itemRotation = (rotation + itemAngle) % 360;
                const normalizedRotation = Math.abs(itemRotation > 180 ? itemRotation - 360 : itemRotation);
                
                const isFacingFront = i === activeIndex;
                const scale = isFacingFront ? 1 : 0.85;
                const opacity = isFacingFront ? 1 : 0.6;
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
                            cursor: isDragging.current ? 'grabbing' : 'grab'
                        }}
                    >
                         <div 
                           className="bg-[var(--background-secondary)] rounded-[var(--border-radius)] overflow-hidden shadow-lg w-full h-full flex flex-col items-center justify-center text-center p-4 border-2 border-[var(--primary-accent)]/30"
                           onClick={() => !isDragging.current && onProductClick(product)}
                           style={{ pointerEvents: isFacingFront ? 'auto' : 'none' }}
                         >
                            <motion.img 
                                src={product.imageUrl} 
                                alt={product.name} 
                                className="w-3/4 h-32 object-contain rounded-md" 
                                layoutId={`product-image-${product.id}`}
                            />
                            <h3 className="mt-4 text-lg font-semibold text-[var(--text-primary)]">{product.name}</h3>
                            <div className="mt-2 flex w-full justify-around items-center">
                                <p className="text-xl font-bold text-[var(--primary-accent)] tabular-nums">${product.price.toFixed(2)}</p>
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
            </motion.div>
        </div>

        <div className="mt-8 flex space-x-2">
            {products.map((_, index) => (
                <button
                    key={index}
                    onClick={() => rotateTo(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${activeIndex === index ? 'bg-[var(--primary-accent)] scale-125' : 'bg-[var(--background-tertiary)]/70 hover:bg-[var(--background-tertiary)]'}`}
                    aria-label={`Go to product ${index + 1}`}
                />
            ))}
        </div>
    </div>
  );
};

export default CarouselView;