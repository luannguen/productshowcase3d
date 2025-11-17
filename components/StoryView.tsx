import React, { useState, useRef, useEffect, useCallback } from 'react';
// FIX: Import AnimatePresence, useMotionValue, and animate. Remove useAnimation.
import { motion, AnimatePresence, PanInfo, useMotionValue, animate } from 'framer-motion';
import { Product } from '../types';
import { CartIcon } from './icons';

interface StoryViewProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
  onProductClick: (product: Product) => void;
}

const STORY_DURATION = 8000; // 8 seconds per story

const StoryView: React.FC<StoryViewProps> = ({ products, onAddToCart, onProductClick }) => {
    // FIX: Replace useAnimation with useMotionValue and a ref for animation controls.
    const [activeIndex, setActiveIndex] = useState(0);
    const width = useMotionValue("0%");
    const animationRef = useRef<any>(null);
    const timerRef = useRef<number | null>(null);
    const isPaused = useRef(false);
    
    const goToStory = useCallback((index: number) => {
        if (index < 0 || index >= products.length) return;
        setActiveIndex(index);
        width.set("0%");
        if (animationRef.current) {
            animationRef.current.stop();
        }
        animationRef.current = animate(width, "100%", { duration: STORY_DURATION / 1000, ease: "linear" });
    }, [products.length, width]);

    useEffect(() => {
        if (timerRef.current) clearTimeout(timerRef.current);
        if (!isPaused.current) {
            timerRef.current = window.setTimeout(() => {
                goToStory((activeIndex + 1) % products.length);
            }, STORY_DURATION);
        }
        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, [activeIndex, products.length, goToStory]);

    useEffect(() => {
        goToStory(0);
        return () => {
            if (animationRef.current) {
                animationRef.current.stop();
            }
        };
    }, [goToStory]);
    
    const handlePointerDown = () => {
        isPaused.current = true;
        if (timerRef.current) clearTimeout(timerRef.current);
        if (animationRef.current) {
            animationRef.current.stop();
        }
    };

    const handlePointerUp = () => {
        isPaused.current = false;
        // FIX: Use width motion value's get() method to calculate remaining duration.
        const currentWidthPercent = parseFloat(width.get().replace('%', ''));
        const remainingDuration = (1 - (currentWidthPercent / 100)) * STORY_DURATION;

        if (animationRef.current) {
            animationRef.current.stop();
        }
        animationRef.current = animate(width, "100%", { duration: remainingDuration / 1000, ease: "linear" });
        
        timerRef.current = window.setTimeout(() => {
            goToStory((activeIndex + 1) % products.length);
        }, remainingDuration);
    };

    const handleDragEnd = (e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
        if (info.offset.x > 50) {
            goToStory(activeIndex - 1);
        } else if (info.offset.x < -50) {
            goToStory(activeIndex + 1);
        }
    };

    if (products.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] text-center bg-[var(--background-secondary)] rounded-[var(--border-radius)] p-8">
                <h2 className="text-2xl font-bold text-[var(--text-primary)]">No Stories to Tell</h2>
                <p className="mt-2 text-[var(--text-secondary)]">There are no products with stories available for this theme yet.</p>
            </div>
        );
    }
    
    const activeProduct = products[activeIndex];

    return (
        <div className="h-[calc(100vh-200px)] w-full relative flex flex-col items-center justify-center bg-[var(--background-secondary)] rounded-[var(--border-radius)] shadow-2xl overflow-hidden">
            {/* Progress Bars */}
            <div className="absolute top-4 left-4 right-4 z-20 flex gap-2">
                {products.map((_, index) => (
                    <div key={index} className="flex-1 h-1 bg-white/20 rounded-full overflow-hidden">
                        {index < activeIndex && <div className="h-full w-full bg-[var(--primary-accent)]" />}
                        {/* FIX: Use the motion value in the style prop to drive the animation. */}
                        {index === activeIndex && <motion.div className="h-full bg-[var(--primary-accent)]" style={{ width }} />}
                    </div>
                ))}
            </div>

            <AnimatePresence initial={false} custom={activeIndex}>
                <motion.div
                    key={activeIndex}
                    className="w-full h-full flex-shrink-0 flex items-center justify-center p-8 relative overflow-hidden"
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    onPointerDown={handlePointerDown}
                    onPointerUp={handlePointerUp}
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    onDragEnd={handleDragEnd}
                >
                    <div className="absolute inset-0 z-0">
                        {activeProduct.story?.videoUrl ? (
                            <video
                                key={activeProduct.id}
                                src={activeProduct.story.videoUrl}
                                className="w-full h-full object-cover"
                                autoPlay
                                loop
                                muted
                                playsInline
                            />
                        ) : (
                            <img src={activeProduct.story?.imageUrl} alt={`${activeProduct.name} story background`} className="w-full h-full object-cover animate-kenburns" />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-r from-[var(--background-secondary)] via-[var(--background-secondary)]/70 to-transparent"></div>
                    </div>

                    <div className="relative z-10 w-full h-full flex flex-col md:flex-row items-center justify-center gap-8">
                        <div className="w-full md:w-1/2 flex items-center justify-center">
                            <motion.img 
                                layoutId={`product-image-${activeProduct.id}`}
                                src={activeProduct.imageUrl} 
                                alt={activeProduct.name} 
                                className="max-h-[60vh] w-auto object-contain rounded-lg drop-shadow-2xl" 
                            />
                        </div>
                        <div className="w-full md:w-1/2 text-center md:text-left">
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0, transition: { delay: 0.2 } }}>
                                <h2 className="text-4xl lg:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[var(--header-gradient-from)] to-[var(--header-gradient-to)]" style={{ fontFamily: 'var(--font-family)' }}>
                                    {activeProduct.story?.title}
                                </h2>
                                <h3 className="text-2xl lg:text-3xl mt-1 font-semibold text-[var(--text-primary)]">{activeProduct.name}</h3>
                            </motion.div>
                            <motion.p className="mt-4 text-lg text-[var(--text-secondary)] max-w-prose mx-auto md:mx-0" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0, transition: { delay: 0.4 } }}>
                                {activeProduct.story?.narrative}
                            </motion.p>
                            <motion.div className="mt-6 flex items-center justify-center md:justify-start gap-4 flex-wrap" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0, transition: { delay: 0.6 } }}>
                                <p className="text-4xl font-extrabold text-[var(--primary-accent)] tabular-nums">
                                    ${activeProduct.price.toFixed(2)}
                                </p>
                                <button 
                                    onClick={() => onAddToCart(activeProduct)}
                                    className="px-6 py-3 bg-[var(--primary-accent)] text-white font-bold rounded-[var(--border-radius)] hover:bg-[var(--primary-accent-hover)] transition-colors duration-200 flex items-center gap-2 text-lg shadow-lg add-to-cart-animation"
                                    aria-label={`Add ${activeProduct.name} to cart`}
                                >
                                    <CartIcon className="w-6 h-6" />
                                    Add to Cart
                                </button>
                                <button
                                    onClick={() => onProductClick(activeProduct)}
                                    className="px-6 py-3 border-2 border-[var(--primary-accent)] text-[var(--primary-accent)] font-bold rounded-[var(--border-radius)] hover:bg-[var(--primary-accent)] hover:text-white transition-colors duration-200 text-lg"
                                    aria-label={`Learn more about ${activeProduct.name}`}
                                >
                                    Learn More
                                </button>
                            </motion.div>
                        </div>
                    </div>
                </motion.div>
            </AnimatePresence>

             {/* Navigation Buttons */}
            <button onClick={() => goToStory(activeIndex - 1)} className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-[var(--background-tertiary)]/50 backdrop-blur-sm rounded-full p-3 text-[var(--text-primary)] hover:bg-[var(--primary-accent)] transition-all duration-300 disabled:opacity-0" disabled={activeIndex === 0}>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
            </button>
            <button onClick={() => goToStory(activeIndex + 1)} className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-[var(--background-tertiary)]/50 backdrop-blur-sm rounded-full p-3 text-[var(--text-primary)] hover:bg-[var(--primary-accent)] transition-all duration-300 disabled:opacity-0" disabled={activeIndex >= products.length - 1}>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
            </button>
        </div>
    );
};

export default StoryView;