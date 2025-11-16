
import React, { useState, useRef, useEffect } from 'react';
import { Product } from '../types';

interface StoryViewProps {
  products: Product[];
}

const StoryView: React.FC<StoryViewProps> = ({ products }) => {
    const [activeIndex, setActiveIndex] = useState(0);
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const storyRefs = useRef<(HTMLDivElement | null)[]>([]);

    useEffect(() => {
        storyRefs.current = storyRefs.current.slice(0, products.length);
    }, [products]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const index = storyRefs.current.indexOf(entry.target as HTMLDivElement);
                        if (index !== -1) {
                            setActiveIndex(index);
                        }
                    }
                });
            },
            {
                root: scrollContainerRef.current,
                threshold: 0.5,
            }
        );

        storyRefs.current.forEach(ref => {
            if (ref) observer.observe(ref);
        });

        return () => {
            storyRefs.current.forEach(ref => {
                if (ref) observer.unobserve(ref);
            });
        };
    }, [products.length]);

    const scrollToStory = (index: number) => {
        storyRefs.current[index]?.scrollIntoView({
            behavior: 'smooth',
            inline: 'start',
            block: 'nearest'
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
                        // FIX: The ref callback function must not return a value. Wrapped in curly braces.
                        ref={el => { storyRefs.current[index] = el; }}
                        className="w-full h-full flex-shrink-0 snap-start flex items-center justify-center p-8 relative overflow-hidden"
                    >
                        {/* Background Image with Ken Burns effect */}
                        <div className="absolute inset-0 z-0">
                            {activeIndex === index && (
                                <img src={product.story?.imageUrl} alt={`${product.name} story background`} className="w-full h-full object-cover animate-kenburns" />
                            )}
                            <div className="absolute inset-0 bg-gradient-to-r from-[var(--background-secondary)] via-[var(--background-secondary)]/70 to-transparent"></div>
                        </div>

                        {/* Animated Content */}
                        <div className={`relative z-10 w-full h-full flex flex-col md:flex-row items-center justify-center gap-8 transition-opacity duration-500 ${activeIndex === index ? 'opacity-100' : 'opacity-0'}`}>
                           {activeIndex === index && (
                            <>
                                <div className="w-full md:w-1/2 flex items-center justify-center" style={{ animation: `slideInUp 0.8s 0.2s ease-out forwards`, opacity: 0 }}>
                                    <img src={product.imageUrl} alt={product.name} className="max-h-[60vh] w-auto object-contain rounded-lg drop-shadow-2xl" />
                                </div>
                                <div className="w-full md:w-1/2 text-center md:text-left">
                                    <div style={{ animation: `slideInUp 0.8s 0.4s ease-out forwards`, opacity: 0 }}>
                                        <h2 className="text-4xl lg:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[var(--header-gradient-from)] to-[var(--header-gradient-to)]" style={{ fontFamily: 'var(--font-family)' }}>
                                            {product.story?.title}
                                        </h2>
                                        <h3 className="text-2xl lg:text-3xl mt-1 font-semibold text-[var(--text-primary)]">{product.name}</h3>
                                    </div>
                                    <p className="mt-4 text-lg text-[var(--text-secondary)] max-w-prose mx-auto md:mx-0" style={{ animation: `slideInUp 0.8s 0.6s ease-out forwards`, opacity: 0 }}>
                                        {product.story?.narrative}
                                    </p>
                                    <p className="mt-6 text-4xl font-extrabold text-[var(--primary-accent)]" style={{ animation: `fadeIn 0.8s 0.8s ease-out forwards`, opacity: 0 }}>
                                        ${product.price.toFixed(2)}
                                    </p>
                                </div>
                            </>
                           )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Navigation Arrows */}
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

            {/* Pagination Dots */}
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
