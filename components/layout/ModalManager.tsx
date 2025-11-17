import React, { lazy, Suspense, useState } from 'react';
import { useModalContext } from '../../contexts/ModalContext';
import { useProductContext } from '../../contexts/ProductContext';
import { useCartContext } from '../../contexts/CartContext';
import { useWishlistContext } from '../../contexts/WishlistContext';
import { useAppContext } from '../../contexts/AppContext';
import { ChatMessage, Product } from '../../types';

const ProductDetailModal = lazy(() => import('../ProductDetailModal'));
const ProductManagementModal = lazy(() => import('../ProductManagementModal'));
const CartModal = lazy(() => import('../CartModal'));
const PurchaseModal = lazy(() => import('../PurchaseModal'));
const CommandPalette = lazy(() => import('../CommandPalette'));
const WishlistModal = lazy(() => import('../WishlistModal'));
const QuickViewModal = lazy(() => import('../QuickViewModal'));
const AIAssistant = lazy(() => import('../AIAssistant'));
const SettingsModal = lazy(() => import('../SettingsModal'));
const CompareModal = lazy(() => import('../CompareModal'));
const VisualSearchModal = lazy(() => import('../VisualSearchModal'));
const OnboardingTour = lazy(() => import('../OnboardingTour'));
const ConfirmationModal = lazy(() => import('../ConfirmationModal'));
const MobileMenu = lazy(() => import('../MobileMenu'));

const ModalManager: React.FC = () => {
    const { modal, closeModal, openModal } = useModalContext();
    const { type, props } = modal;

    const app = useAppContext();
    const productContext = useProductContext();
    const cart = useCartContext();
    const wishlist = useWishlistContext();
    
    const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);

    if (!type) {
        return null;
    }
    
    const handleProductClick = (p: Product) => {
        productContext.addToRecentlyViewed(p);
        closeModal();
        setTimeout(() => openModal('productDetail', { product: p }), 150);
    };
    
    const handleBuyNow = (p: Product, q: number) => {
        cart.addToCart(p, q);
        closeModal();
        openModal('purchase');
    };

    const handleUpdateProduct = (id: number, key: 'imageUrl' | 'description', value: string) => {
        // This would ideally call a function in ProductContext to update state
        console.log(`Updating product ${id}: ${key} = ${value}`);
    };
    const handleUpdateStory = (id: number, story: { title: string; narrative: string; }) => {
        console.log(`Updating story for product ${id}`, story);
    };

    return (
        <Suspense fallback={null}>
            {type === 'productDetail' && <ProductDetailModal isOpen={true} onClose={closeModal} product={props.product} allProducts={productContext.allProducts} onAddToCart={cart.addToCart} onBuyNow={handleBuyNow} onProductClick={handleProductClick} />}
            {type === 'cart' && <CartModal isOpen={true} onClose={closeModal} cartItems={cart.cart} onUpdateQuantity={cart.updateCartQuantity} onRemoveItem={cart.removeFromCart} onClearCart={() => openModal('confirmation', { title: 'Clear Cart', message: 'Are you sure you want to remove all items from your cart?', onConfirm: () => { cart.clearCart(); closeModal(); } })} onCheckout={() => { closeModal(); openModal('purchase'); }} />}
            {type === 'wishlist' && <WishlistModal isOpen={true} onClose={closeModal} wishlistItems={wishlist.wishlist} onRemoveFromWishlist={wishlist.toggleWishlist} onAddToCart={(p) => cart.addToCart(p, 1)} />}
            {type === 'purchase' && <PurchaseModal isOpen={true} onClose={closeModal} cart={cart.cart} onPurchaseSuccess={() => { cart.clearCart(); app.addToast('Purchase successful!'); closeModal();}} />}
            {type === 'productManagement' && <ProductManagementModal isOpen={true} onClose={closeModal} products={productContext.allProducts} onUpdateImage={(id, url) => handleUpdateProduct(id, 'imageUrl', url)} onUpdateDescription={(id, desc) => handleUpdateProduct(id, 'description', desc)} onUpdateStory={handleUpdateStory} />}
            {type === 'commandPalette' && <CommandPalette isOpen={true} onClose={closeModal} setView={app.setViewMode} setTheme={app.setActiveTheme} />}
            {type === 'quickView' && <QuickViewModal isOpen={true} onClose={closeModal} product={props.product} onAddToCart={(p,q) => cart.addToCart(p,q)} onNavigateToProduct={handleProductClick} />}
            {type === 'settings' && <SettingsModal isOpen={true} onClose={closeModal} {...app} />}
            {type === 'compare' && <CompareModal isOpen={true} onClose={closeModal} items={props.items} allProducts={productContext.allProducts} />}
            {type === 'visualSearch' && <VisualSearchModal isOpen={true} onClose={closeModal} allProducts={productContext.allProducts} onProductClick={handleProductClick} />}
            {type === 'onboarding' && <OnboardingTour isOpen={true} onClose={closeModal} />}
            {type === 'confirmation' && <ConfirmationModal isOpen={true} onClose={closeModal} {...props} />}
            {type === 'aiAssistant' && <AIAssistant isOpen={true} setIsOpen={closeModal} chatHistory={chatHistory} setChatHistory={setChatHistory} products={productContext.allProducts}/>}
            {/* FIX: Pass 'categories' prop to filterPopoverProps to satisfy its type requirements. */}
            {type === 'mobileMenu' && <MobileMenu isOpen={true} onClose={closeModal} searchQuery={productContext.searchQuery} setSearchQuery={productContext.setSearchQuery} filterPopoverProps={{...productContext, categories: productContext.allAvailableCategories}} themeSwitcherProps={{currentTheme: app.activeTheme, setTheme: app.setActiveTheme}} viewSwitcherProps={{currentView: app.viewMode, setView: app.setViewMode}} surpriseMe={() => {}} openCommandPalette={() => openModal('commandPalette')} openManageModal={() => openModal('productManagement')} openSettingsModal={() => openModal('settings')} />}
        </Suspense>
    );
};

export default ModalManager;