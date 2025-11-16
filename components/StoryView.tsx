
import React, { useState, useRef, useEffect } from 'react';
import { Product } from '../types';
import { CartIcon } from './icons';

interface StoryViewProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
}

const StoryView: React.FC<StoryViewProps> = ({ products, onAddToCart }) => {
    const [activeIndex, setActiveIndex] = useState(0);
    const [imageLoaded, setImageLoaded] = useState<Record<number, boolean>>({});
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const storyRefs = useRef<(HTMLDivElement | null)[]>([]);

    useEffect(() => {
        storyRefs.current = storyRefs.current.slice(0, products.length);
        // Preload adjacent images
        if (products.length > 0) {
            const preloadNext = (activeIndex + 1) % products.length;
            const preloadPrev = (activeIndex - 1 + products.length) % products.length;
            [products[activeIndex], products[preloadNext], products[preloadPrev]].forEach(p => {
                if (p && p.story) {
                    new Image().src = p.imageUrl;
                    new Image().src = p.story.imageUrl;
                }
            });
        }
    }, [products, activeIndex]);

    const handleScroll = () => {
        if (!scrollContainerRef.current) return;
        const { scrollLeft, clientWidth } = scrollContainerRef.current;
        const index = Math.round(scrollLeft / clientWidth);
        if (index !== activeIndex) {
            setActiveIndex(index);
        }
    };
    
    useEffect(() => {
        const currentImage = products[activeIndex]?.imageUrl;
        if (currentImage && !imageLoaded[activeIndex]) {
            const img = new Image();
            img.src = currentImage;
            img.onload = () => {
                setImageLoaded(prev => ({ ...prev, [activeIndex]: true }));
            };
        } else if (!currentImage) {
            // No image, so content can show immediately
            setImageLoaded(prev => ({ ...prev, [activeIndex]: true }));
        }
    }, [activeIndex, products, imageLoaded]);

    useEffect(() => {
        const container = scrollContainerRef.current;
        container?.addEventListener('scroll', handleScroll, { passive: true });
        return () => container?.removeEventListener('scroll', handleScroll);
    }, [activeIndex]);

    const scrollToStory = (index: number) => {
        storyRefs.current[index]?.scrollIntoView({
            behavior: 'smooth',
            inline: 'start',
        });
    };

    if (products.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] text-center bg-[var(--background-secondary)] rounded-[var(--border-radius)] p-8">
                <h2 className="text-2xl font-bold text-[var(--text-primary)]">No Stories to Tell</h2>
                <p className="mt-2 text-[var(--text-secondary)]">There are no products with stories available for this theme yet.</p>
            </div>
        );
    }
    
    return (
        <div className="h-[calc(100vh-200px)] w-full relative flex flex-col items-center justify-center bg-[var(--background-secondary)] rounded-[var(--border-radius)] shadow-2xl overflow-hidden">
            <div ref={scrollContainerRef} className="w-full h-full flex overflow-x-auto snap-x snap-mandatory scroll-smooth no-scrollbar">
                {products.map((product, index) => (
                    <div
                        key={product.id}
                        ref={el => { storyRefs.current[index] = el; }}
                        className="w-full h-full flex-shrink-0 snap-start flex items-center justify-center p-8 relative overflow-hidden"
                    >
                        <div className="absolute inset-0 z-0">
                             <img src={product.story?.imageUrl} alt={`${product.name} story background`} className={`w-full h-full object-cover transition-opacity duration-500 ${Math.abs(activeIndex - index) <= 1 ? 'opacity-100' : 'opacity-0'} ${activeIndex === index ? 'animate-kenburns' : ''}`} />
                            <div className="absolute inset-0 bg-gradient-to-r from-[var(--background-secondary)] via-[var(--background-secondary)]/70 to-transparent"></div>
                        </div>

                        <div className={`relative z-10 w-full h-full flex flex-col md:flex-row items-center justify-center gap-8 transition-opacity duration-700 ${activeIndex === index ? 'opacity-100' : 'opacity-0'}`}>
                           {activeIndex === index && (
                            <>
                                <div className="w-full md:w-1/2 flex items-center justify-center">
                                    <img src={product.imageUrl} alt={product.name} className={`max-h-[60vh] w-auto object-contain rounded-lg drop-shadow-2xl transition-opacity duration-700 ${imageLoaded[index] ? 'opacity-100' : 'opacity-0'}`} style={{ animation: `slideInUp 0.8s 0.2s ease-out forwards`, opacity: 0 }} />
                                </div>
                                <div className="w-full md:w-1/2 text-center md:text-left">
                                   {imageLoaded[index] && (
                                     <>
                                        <div style={{ animation: `slideInUp 0.8s 0.4s ease-out forwards`, opacity: 0 }}>
                                            <h2 className="text-4xl lg:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[var(--header-gradient-from)] to-[var(--header-gradient-to)]" style={{ fontFamily: 'var(--font-family)' }}>
                                                {product.story?.title}
                                            </h2>
                                            <h3 className="text-2xl lg:text-3xl mt-1 font-semibold text-[var(--text-primary)]">{product.name}</h3>
                                        </div>
                                        <p className="mt-4 text-lg text-[var(--text-secondary)] max-w-prose mx-auto md:mx-0" style={{ animation: `slideInUp 0.8s 0.6s ease-out forwards`, opacity: 0 }}>
                                            {product.story?.narrative}
                                        </p>
                                        <div className="mt-6 flex items-center justify-center md:justify-start gap-6" style={{ animation: `fadeIn 0.8s 0.8s ease-out forwards`, opacity: 0 }}>
                                            <p className="text-4xl font-extrabold text-[var(--primary-accent)]">
                                                ${product.price.toFixed(2)}
                                            </p>
                                            <button 
                                                onClick={() => onAddToCart(product)}
                                                className="px-6 py-3 bg-[var(--primary-accent)] text-white font-bold rounded-[var(--border-radius)] hover:bg-[var(--primary-accent-hover)] transition-colors duration-200 flex items-center gap-2 text-lg shadow-lg add-to-cart-animation"
                                                aria-label={`Add ${product.name} to cart`}
                                            >
                                                <CartIcon className="w-6 h-6" />
                                                Add to Cart
                                            </button>
                                        </div>
                                     </>
                                   )}
                                </div>
                            </>
                           )}
                        </div>
                    </div>
                ))}
            </div>

            {activeIndex > 0 && (
                <button onClick={() => scrollToStory(activeIndex - 1)} className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-[var(--background-tertiary)]/50 backdrop-blur-sm rounded-full p-3 text-[var(--text-primary)] hover:bg-[var(--primary-accent)] transition-all duration-300">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
                </button>
            )}
            {activeIndex < products.length - 1 && (
                <button onClick={() => scrollToStory(activeIndex + 1)} className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-[var(--background-tertiary)]/50 backdrop-blur-sm rounded-full p-3 text-[var(--text-primary)] hover:bg-[var(--primary-accent)] transition-all duration-300">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                </button>
            )}

            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex space-x-2">
                {products.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => scrollToStory(index)}
                        className={`w-3 h-3 rounded-full transition-all duration-300 ${activeIndex === index ? 'bg-[var(--primary-accent)] scale-125' : 'bg-[var(--background-tertiary)]/50'}`}
                        aria-label={`Go to story ${index + 1}`}
                    />
                ))}
            </div>
        </div>
    );
};

export default StoryView;