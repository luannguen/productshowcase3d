import React, { createContext, useState, useContext, useCallback } from 'react';

type ModalType = 
    | 'productDetail' 
    | 'cart' 
    | 'wishlist' 
    | 'purchase' 
    | 'productManagement' 
    | 'commandPalette' 
    | 'quickView' 
    | 'aiAssistant' 
    | 'settings' 
    | 'compare' 
    | 'visualSearch' 
    | 'onboarding' 
    | 'confirmation'
    | 'mobileMenu';

interface ModalState {
    type: ModalType | null;
    props: any;
}

interface ModalContextType {
    modal: ModalState;
    openModal: (type: ModalType, props?: any) => void;
    closeModal: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [modal, setModal] = useState<ModalState>({ type: null, props: {} });
    
    const openModal = useCallback((type: ModalType, props: any = {}) => {
        setModal({ type, props });
    }, []);

    const closeModal = useCallback(() => {
        setModal({ type: null, props: {} });
    }, []);

    const value = { modal, openModal, closeModal };

    return <ModalContext.Provider value={value}>{children}</ModalContext.Provider>;
};

export const useModalContext = () => {
    const context = useContext(ModalContext);
    if (!context) throw new Error('useModalContext must be used within a ModalProvider');
    return context;
};