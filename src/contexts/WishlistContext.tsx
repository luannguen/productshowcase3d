import React, { createContext, useContext } from 'react';
import { WishlistItem, Product } from '../types';
import useLocalStorage from '../hooks/useLocalStorage';

interface WishlistContextType {
  wishlist: WishlistItem[];
  toggleWishlist: (product: Product) => void;
  isInWishlist: (id: number) => boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [wishlist, setWishlist] = useLocalStorage<WishlistItem[]>('wishlist', []);

  const toggleWishlist = (product: Product) => {
    setWishlist(prev => prev.find(p => p.id === product.id) ? prev.filter(p => p.id !== product.id) : [...prev, product]);
  };

  const isInWishlist = (id: number) => wishlist.some(p => p.id === id);

  return (
    <WishlistContext.Provider value={{ wishlist, toggleWishlist, isInWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlistContext = () => {
  const context = useContext(WishlistContext);
  if (context === undefined) throw new Error('useWishlistContext must be used within a WishlistContextProvider');
  return context;
};
