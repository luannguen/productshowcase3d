import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';
import { CartItem, Product } from '../types';
import useLocalStorage from '../hooks/useLocalStorage';
import { useAppContext } from './AppContext';
import { useAnimationControls } from 'framer-motion';

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number, event?: React.MouseEvent<HTMLButtonElement>) => void;
  removeFromCart: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
  cartItemCount: number;
  flyingImage: { src: string; rect: DOMRect } | null;
  cartIconRef: React.RefObject<HTMLButtonElement>;
  cartIconControls: any;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useLocalStorage<CartItem[]>('cart', []);
  const { addToast, reduceMotion } = useAppContext();
  const [flyingImage, setFlyingImage] = useState<{ src: string; rect: DOMRect } | null>(null);
  const cartIconRef = useRef<HTMLButtonElement>(null);
  const cartIconControls = useAnimationControls();

  const addToCart = useCallback((product: Product, quantity: number = 1, event?: React.MouseEvent<HTMLButtonElement>) => {
    if (product.stock.level === 'out-of-stock') {
      addToast(`${product.name} is out of stock.`);
      return;
    }
    
    if (event && !reduceMotion) {
      const targetEl = event.currentTarget.closest('.group')?.querySelector('img') || event.currentTarget;
      const rect = targetEl.getBoundingClientRect();
      setFlyingImage({ src: product.imageUrl, rect });
    }

    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) return prev.map(item => item.product.id === product.id ? { ...item, quantity: item.quantity + quantity } : item);
      return [...prev, { product, quantity }];
    });
    addToast(`${product.name} added to cart.`);
  }, [addToast, reduceMotion, setCart]);

  useEffect(() => {
    if (flyingImage) {
      // Animation logic handled in MainLayout usually, but state is here. 
      // We simulate the end of animation to clear state.
      const timer = setTimeout(async () => {
        if (!reduceMotion) await cartIconControls.start({ scale: [1, 1.3, 1], rotate: [0, -10, 10, 0], transition: { duration: 0.5 } });
        setFlyingImage(null);
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [flyingImage, cartIconControls, reduceMotion]);

  const removeFromCart = (id: number) => setCart(p => p.filter(i => i.product.id !== id));
  
  const updateQuantity = (id: number, qty: number) => {
    setCart(p => qty <= 0 ? p.filter(i => i.product.id !== id) : p.map(i => i.product.id === id ? { ...i, quantity: qty } : i));
  };

  const clearCart = () => setCart([]);
  const cartItemCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <CartContext.Provider value={{
      cart, addToCart, removeFromCart, updateQuantity, clearCart, cartItemCount,
      flyingImage, cartIconRef, cartIconControls
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCartContext = () => {
  const context = useContext(CartContext);
  if (context === undefined) throw new Error('useCartContext must be used within a CartContextProvider');
  return context;
};
