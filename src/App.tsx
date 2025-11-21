import React from 'react';
import { AppContextProvider } from './contexts/AppContext';
import { ProductContextProvider } from './contexts/ProductContext';
import { CartContextProvider } from './contexts/CartContext';
import { WishlistContextProvider } from './contexts/WishlistContext';
import { UserContextProvider } from './contexts/UserContext';
import { ModalContextProvider } from './contexts/ModalContext';
import { TranslationProvider } from './hooks/useTranslation';
import MainLayout from './components/layout/MainLayout';
import ModalManager from './components/layout/ModalManager';

const App: React.FC = () => {
  return (
    <TranslationProvider>
      <AppContextProvider>
        <UserContextProvider>
          <ProductContextProvider>
            <CartContextProvider>
               <WishlistContextProvider>
                  <ModalContextProvider>
                     <MainLayout />
                     <ModalManager />
                  </ModalContextProvider>
               </WishlistContextProvider>
            </CartContextProvider>
          </ProductContextProvider>
        </UserContextProvider>
      </AppContextProvider>
    </TranslationProvider>
  );
};

export default App;
