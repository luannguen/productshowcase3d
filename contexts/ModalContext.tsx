import React, { createContext, useContext, useState, useCallback } from 'react';

export type ModalKey = 
  | 'PRODUCT_DETAIL' 
  | 'CART' 
  | 'MANAGE_PRODUCTS' 
  | 'PURCHASE' 
  | 'COMMAND_PALETTE' 
  | 'WISHLIST' 
  | 'QUICK_VIEW' 
  | 'AI_ASSISTANT' 
  | 'SETTINGS' 
  | 'COMPARE' 
  | 'VISUAL_SEARCH' 
  | 'ONBOARDING' 
  | 'CONFIRMATION'
  | 'BOOK_EDITOR'
  | 'EDITION_VIEW'
  | 'BOOK_READER';

interface ModalContextType {
  activeModal: ModalKey | null;
  modalProps: any;
  openModal: <T>(key: ModalKey, props?: T) => void;
  closeModal: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeModal, setActiveModal] = useState<ModalKey | null>(null);
  const [modalProps, setModalProps] = useState<any>({});

  const openModal = useCallback(<T,>(key: ModalKey, props?: T) => {
    setModalProps(props || {});
    setActiveModal(key);
    document.body.style.overflow = 'hidden';
  }, []);

  const closeModal = useCallback(() => {
    setActiveModal(null);
    setModalProps({});
    document.body.style.overflow = 'auto';
  }, []);

  return (
    <ModalContext.Provider value={{ activeModal, modalProps, openModal, closeModal }}>
      {children}
    </ModalContext.Provider>
  );
};

export const useModalContext = () => {
  const context = useContext(ModalContext);
  if (context === undefined) throw new Error('useModalContext must be used within a ModalContextProvider');
  return context;
};
