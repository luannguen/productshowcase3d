import React, { createContext, useContext, useState, useCallback } from 'react';
import { PurchasedItem, UserEdition, Product, CartItem } from '../types';
import useLocalStorage from '../hooks/useLocalStorage';
import { themes } from '../constants';

const samplePurchasedItems: PurchasedItem[] = [
    { ...themes['Book'].products[0], purchaseDate: Date.now() - 86400000 * 2 },
    { ...themes['Book'].products[1], purchaseDate: Date.now() - 86400000 * 5 },
    { ...themes['Book'].products[2], purchaseDate: Date.now() - 86400000 * 5 },
];

const sampleUserEditions: UserEdition[] = [{
    id: 'sample-edition-1',
    baseProductId: 25,
    name: "Chronos Remix: The Video Chapter",
    coverImageUrl: 'https://images.unsplash.com/photo-1541963463532-d68292c34b19?q=80&w=800&auto=format&fit=crop',
    baseProduct: themes['Book'].products[0],
    content: [
        { blocks: [
            { id: `block-${Date.now()}-1`, type: 'text', content: '<h1>My Awesome Chapter 1</h1><p>This is my custom version of the first page. I can add <strong>bold text</strong> and whatever I want.</p>' }, 
            { id: `block-${Date.now()}-2`, type: 'image', src: 'https://images.unsplash.com/photo-1550745165-9bc0b252726a?q=80&w=800' }
        ] },
        { blocks: [
            { id: `block-${Date.now()}-3`, type: 'text', content: 'This is the original second page, but with a video!' }, 
            { id: `block-${Date.now()}-4`, type: 'video', src: 'https://www.youtube.com/embed/dQw4w9WgXcQ' }
        ] }
    ],
    status: 'published',
    publishedAt: Date.now() - 86400000,
}];

interface UserContextType {
  purchasedItems: PurchasedItem[];
  addPurchase: (items: CartItem[]) => void;
  userEditions: UserEdition[];
  createEdition: (product: Product) => UserEdition;
  updateEdition: (edition: UserEdition) => void;
  publishEdition: (edition: UserEdition) => void;
  isProfileVisible: boolean;
  setProfileVisible: (visible: boolean) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [purchasedItems, setPurchasedItems] = useLocalStorage<PurchasedItem[]>('purchasedItems', samplePurchasedItems);
  const [userEditions, setUserEditions] = useLocalStorage<UserEdition[]>('userEditions', sampleUserEditions);
  const [isProfileVisible, setProfileVisible] = useState(false);

  const addPurchase = (cartItems: CartItem[]) => {
    const newPurchases: PurchasedItem[] = cartItems.map(item => ({
        ...item.product,
        purchaseDate: Date.now()
    }));
    setPurchasedItems(prev => [...prev, ...newPurchases]);
  };

  const createEdition = (product: Product): UserEdition => {
    const newEdition: UserEdition = {
        id: `edition-${Date.now()}`,
        baseProductId: product.id,
        name: `My Edition of ${product.name}`,
        coverImageUrl: product.imageUrl,
        baseProduct: product,
        content: product.content?.map(pageText => ({ 
            blocks: [{ id: `block-${Date.now()}-${Math.random()}`, type: 'text', content: pageText }] 
        })) || [{ blocks: [{ id: `block-${Date.now()}`, type: 'text', content: 'Start writing here...'}] }],
        status: 'draft',
    };
    setUserEditions(prev => [...prev, newEdition]);
    return newEdition;
  };

  const updateEdition = (updatedEdition: UserEdition) => {
    setUserEditions(prev => prev.map(e => e.id === updatedEdition.id ? updatedEdition : e));
  };

  const publishEdition = (edition: UserEdition) => {
    const published = {
        ...edition,
        status: 'published' as const,
        publishedAt: Date.now(),
    };
    updateEdition(published);
  };

  return (
    <UserContext.Provider value={{
      purchasedItems, addPurchase,
      userEditions, createEdition, updateEdition, publishEdition,
      isProfileVisible, setProfileVisible
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (context === undefined) throw new Error('useUserContext must be used within a UserContextProvider');
  return context;
};
