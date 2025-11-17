import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import { AppProvider, useAppContext } from './contexts/AppContext';
import { ProductProvider } from './contexts/ProductContext';
import { CartProvider, useCartContext } from './contexts/CartContext';
import { WishlistProvider } from './contexts/WishlistContext';
import { ModalProvider, useModalContext } from './contexts/ModalContext';

import Header from './components/layout/Header';
import MainLayout from './components/layout/MainLayout';
import Footer from './components/layout/Footer';
import ModalManager from './components/layout/ModalManager';
import ToastContainer from './components/Toast';
import AccessibilityAnnouncer from './components/AccessibilityAnnouncer';

const AppContent: React.FC = () => {
    const { toasts, removeToast } = useAppContext();
    const { flyingImage, cartIconRef } = useCartContext();
    const { modal } = useModalContext();

    const isAnyModalOpen = modal.type !== null;
    
    return (
        <>
            <AccessibilityAnnouncer message={""} />
            <div className={`main-content-wrapper ${isAnyModalOpen ? 'modal-open-blur' : ''}`}>
                <Header />
                <MainLayout />
                <Footer />
            </div>
            
            <ModalManager />
            <ToastContainer toasts={toasts} removeToast={removeToast} />

            <AnimatePresence>
                {flyingImage && (
                    <motion.img
                        src={flyingImage.src}
                        className="flying-image"
                        initial={{
                            top: flyingImage.rect.top,
                            left: flyingImage.rect.left,
                            width: flyingImage.rect.width,
                            height: flyingImage.rect.height,
                        }}
                        animate={{
                            top: cartIconRef.current?.getBoundingClientRect().top || 30,
                            left: cartIconRef.current?.getBoundingClientRect().left || window.innerWidth - 50,
                            width: 20,
                            height: 20,
                            opacity: 0,
                            scale: 0.5,
                        }}
                        transition={{ duration: 0.6, ease: 'easeInOut' }}
                    />
                )}
            </AnimatePresence>
        </>
    );
};

const App: React.FC = () => {
    return (
        <AppProvider>
            <ProductProvider>
                <WishlistProvider>
                    <CartProvider>
                        <ModalProvider>
                            <AppContent />
                        </ModalProvider>
                    </CartProvider>
                </WishlistProvider>
            </ProductProvider>
        </AppProvider>
    );
};

export default App;