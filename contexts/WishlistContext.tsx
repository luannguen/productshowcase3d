import React, { createContext, useContext } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import { WishlistItem, Product } from '../types';

interface WishlistContextType {
    wishlist: WishlistItem[];
    toggleWishlist: (product: Product) => void;
    isProductInWishlist: (productId: number) => boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [wishlist, setWishlist] = useLocalStorage<WishlistItem[]>('wishlist', []);
    
    const toggleWishlist = (product: Product) => {
        setWishlist(prev => 
            prev.find(p => p.id === product.id) 
            ? prev.filter(p => p.id !== product.id) 
            : [...prev, product]
        );
    };

    const isProductInWishlist = (productId: number) => wishlist.some(p => p.id === productId);

    const value = { wishlist, toggleWishlist, isProductInWishlist };

    return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
};

export const useWishlistContext = () => {
    const context = useContext(WishlistContext);
    if (!context) throw new Error('useWishlistContext must be used within a WishlistProvider');
    return context;
};