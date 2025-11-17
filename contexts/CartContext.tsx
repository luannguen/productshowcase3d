import React, { createContext, useState, useContext, useCallback, useMemo, useRef, useEffect } from 'react';
import { Product, CartItem } from '../types';
import { useAnimationControls } from 'framer-motion';
import { useAppContext } from './AppContext';

interface CartContextType {
    cart: CartItem[];
    addToCart: (product: Product, quantity: number, event?: React.MouseEvent<HTMLButtonElement>) => void;
    updateCartQuantity: (productId: number, newQuantity: number) => void;
    removeFromCart: (productId: number) => void;
    clearCart: () => void;
    cartItemCount: number;
    cartSubtotal: number;
    flyingImage: { src: string; rect: DOMRect } | null;
    cartIconRef: React.RefObject<HTMLButtonElement>;
    cartIconControls: any;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { reduceMotion, t, addToast } = useAppContext();
    const [cart, setCart] = useState<CartItem[]>([]);
    const [flyingImage, setFlyingImage] = useState<{ src: string; rect: DOMRect } | null>(null);
    const cartIconRef = useRef<HTMLButtonElement>(null);
    const cartIconControls = useAnimationControls();
    
    const addToCart = useCallback((product: Product, quantity: number = 1, event?: React.MouseEvent<HTMLButtonElement>) => {
        if (product.stock.level === 'out-of-stock') {
          addToast(`${product.name} is out of stock.`);
          return;
        }
        if (event && !reduceMotion) {
          const rect = event.currentTarget.getBoundingClientRect();
          setFlyingImage({ src: product.imageUrl, rect });
        }
        setCart(prev => {
          const existing = prev.find(item => item.product.id === product.id);
          if (existing) return prev.map(item => item.product.id === product.id ? { ...item, quantity: item.quantity + quantity } : item);
          return [...prev, { product, quantity }];
        });
        addToast(`${product.name} added to cart.`);
    }, [reduceMotion, addToast]);

    const updateCartQuantity = (id: number, newQty: number) => setCart(p => newQty <= 0 ? p.filter(i => i.product.id !== id) : p.map(i => i.product.id === id ? { ...i, quantity: newQty } : i));
    const removeFromCart = (id: number) => setCart(p => p.filter(i => i.product.id !== id));
    const clearCart = () => setCart([]);

    const cartItemCount = useMemo(() => cart.reduce((total, item) => total + item.quantity, 0), [cart]);
    const cartSubtotal = useMemo(() => cart.reduce((total, item) => total + item.product.price * item.quantity, 0), [cart]);

    useEffect(() => {
        if (flyingImage) {
            const cartRect = cartIconRef.current?.getBoundingClientRect();
            if (cartRect) {
                const flyAnimation = async () => {
                    await new Promise(resolve => setTimeout(resolve, 500));
                    if (!reduceMotion) cartIconControls.start({ scale: [1, 1.3, 1], rotate: [0, -10, 10, 0], transition: { duration: 0.5 } });
                    setFlyingImage(null);
                };
                flyAnimation();
            }
        }
    }, [flyingImage, cartIconControls, reduceMotion]);
    
    const value = { cart, addToCart, updateCartQuantity, removeFromCart, clearCart, cartItemCount, cartSubtotal, flyingImage, cartIconRef, cartIconControls };
    
    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCartContext = () => {
    const context = useContext(CartContext);
    if (!context) throw new Error('useCartContext must be used within a CartProvider');
    return context;
};