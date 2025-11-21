import React, { Suspense, lazy, useEffect } from 'react';
import { useModalContext } from '../../contexts/ModalContext';
import { useProductContext } from '../../contexts/ProductContext';
import { useCartContext } from '../../contexts/CartContext';
import { useWishlistContext } from '../../contexts/WishlistContext';
import { useUserContext } from '../../contexts/UserContext';
import { useAppContext } from '../../contexts/AppContext';
import { AnimatePresence } from 'framer-motion';

// Lazy Components
const ProductDetailModal = lazy(() => import('../modals/ProductDetailModal'));
const ProductManagementModal = lazy(() => import('../modals/ProductManagementModal'));
const CartModal = lazy(() => import('../modals/CartModal'));
const PurchaseModal = lazy(() => import('../modals/PurchaseModal'));
const CommandPalette = lazy(() => import('../layout/CommandPalette'));
const WishlistModal = lazy(() => import('../modals/WishlistModal'));
const QuickViewModal = lazy(() => import('../modals/QuickViewModal'));
const AIAssistant = lazy(() => import('../features/AIAssistant'));
const SettingsModal = lazy(() => import('../modals/SettingsModal'));
const CompareModal = lazy(() => import('../modals/CompareModal'));
const VisualSearchModal = lazy(() => import('../modals/VisualSearchModal'));
const OnboardingTour = lazy(() => import('../features/OnboardingTour'));
const ConfirmationModal = lazy(() => import('../modals/ConfirmationModal'));
const UserProfile = lazy(() => import('../features/UserProfile'));
const BookEditor = lazy(() => import('../features/BookEditor'));
const EditionView = lazy(() => import('../views/EditionView'));
const BookView = lazy(() => import('../views/BookView'));

const ModalManager: React.FC = () => {
  const { activeModal, modalProps, closeModal, openModal } = useModalContext();
  const { products, activeTheme, viewMode, setViewMode, compareItems, toggleCompare, addToRecentlyViewed } = useProductContext();
  const { cart, addToCart, updateQuantity, removeFromCart, clearCart } = useCartContext();
  const { wishlist, toggleWishlist } = useWishlistContext();
  const { activeTheme: appTheme, setActiveTheme: setAppTheme, appearance, setAppearance, reduceMotion, setReduceMotion, locale, setLocale } = useAppContext();
  const { purchasedItems, userEditions, isProfileVisible, setProfileVisible, createEdition, updateEdition, publishEdition, addPurchase } = useUserContext();

  // Onboarding Logic (Moved from App.tsx logic to here or a dedicated hook, 
  // but simplistic check here to trigger Onboarding modal if needed)
  // Since we moved logic, we should trigger onboarding via useEffect in MainLayout or here
  // For now, we rely on user triggering it via Menu or initial state in MainLayout.

  // Product Management Callbacks
  const handleUpdateImage = (id: number, url: string) => { console.log('Update Image', id, url); /* logic needs to be in ProductContext to persist? */ };
  const handleUpdateDescription = (id: number, desc: string) => { console.log('Update Desc', id, desc); };
  const handleUpdateStory = (id: number, story: any) => { console.log('Update Story', id, story); };

  const handlePurchaseSuccess = (items: any) => {
      addPurchase(items);
      clearCart();
      closeModal(); // or show success message inside PurchaseModal
  };

  // Helper to render specific modal
  const renderModal = () => {
    switch (activeModal) {
      case 'PRODUCT_DETAIL':
        return <ProductDetailModal isOpen={true} onClose={closeModal} allProducts={products} onAddToCart={addToCart} onBuyNow={(p, q) => { addToCart(p, q); openModal('CART'); }} onProductClick={(p) => { addToRecentlyViewed(p); openModal('PRODUCT_DETAIL', { product: p }); }} {...modalProps} />;
      case 'MANAGE_PRODUCTS':
        return <ProductManagementModal isOpen={true} onClose={closeModal} products={products} onUpdateImage={handleUpdateImage} onUpdateDescription={handleUpdateDescription} onUpdateStory={handleUpdateStory} />;
      case 'CART':
        return <CartModal isOpen={true} onClose={closeModal} cartItems={cart} onUpdateQuantity={updateQuantity} onRemoveItem={removeFromCart} onClearCart={clearCart} onCheckout={() => openModal('PURCHASE')} />;
      case 'PURCHASE':
        return <PurchaseModal isOpen={true} onClose={closeModal} cart={cart} onPurchaseSuccess={handlePurchaseSuccess} />;
      case 'COMMAND_PALETTE':
        return <CommandPalette isOpen={true} onClose={closeModal} setView={setViewMode} setTheme={setAppTheme} />;
      case 'WISHLIST':
        return <WishlistModal isOpen={true} onClose={closeModal} wishlistItems={wishlist} onRemoveFromWishlist={toggleWishlist} onAddToCart={(p) => addToCart(p)} />;
      case 'QUICK_VIEW':
        return <QuickViewModal isOpen={true} onClose={closeModal} onAddToCart={addToCart} onNavigateToProduct={(p) => openModal('PRODUCT_DETAIL', { product: p })} {...modalProps} />;
      case 'AI_ASSISTANT':
        // AI Assistant maintains its own chat history state internally or in AppContext? 
        // For this refactor, let's assume it manages history internally or we pass a simple state.
        // To strictly follow "Logic in Context", chat history should be in AppContext, but for simplicity let's keep it local to component or pass simplistic props.
        return <AIAssistant isOpen={true} setIsOpen={(open) => !open && closeModal()} chatHistory={[]} setChatHistory={() => {}} products={products} />;
      case 'SETTINGS':
        return <SettingsModal isOpen={true} onClose={closeModal} activeTheme={appTheme} setActiveTheme={setAppTheme} appearance={appearance} setAppearance={setAppearance} reduceMotion={reduceMotion} setReduceMotion={setReduceMotion} locale={locale} setLocale={setLocale} />;
      case 'COMPARE':
        return <CompareModal isOpen={true} onClose={closeModal} items={compareItems} allProducts={products} />;
      case 'VISUAL_SEARCH':
        return <VisualSearchModal isOpen={true} onClose={closeModal} allProducts={products} onProductClick={(p) => openModal('PRODUCT_DETAIL', { product: p })} />;
      case 'ONBOARDING':
        return <OnboardingTour isOpen={true} onClose={closeModal} />;
      case 'CONFIRMATION':
        return <ConfirmationModal isOpen={true} onClose={closeModal} {...modalProps} />;
      case 'BOOK_EDITOR':
        return <BookEditor edition={modalProps.edition} onSave={(e) => { updateEdition(e); closeModal(); }} onPublish={(e) => { publishEdition(e); closeModal(); }} onClose={closeModal} />;
      case 'EDITION_VIEW':
        return <EditionView edition={modalProps.edition} onExit={closeModal} />;
      case 'BOOK_READER':
        return <BookView product={modalProps.product} onClose={closeModal} />;
      default:
        return null;
    }
  };

  return (
    <>
      <Suspense fallback={<div className="fixed inset-0 flex items-center justify-center z-[9999] pointer-events-none"><div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div></div>}>
        {activeModal && renderModal()}
        
        {/* Profile is a special case as it acts like a full-screen overlay/modal */}
        <AnimatePresence>
            {isProfileVisible && (
                <UserProfile 
                    purchasedItems={purchasedItems} 
                    userEditions={userEditions} 
                    onClose={() => setProfileVisible(false)} 
                    onReadBook={(p) => { setProfileVisible(false); openModal('BOOK_READER', { product: p }); }} 
                    onCreateEdition={(p) => { setProfileVisible(false); const e = createEdition(p); openModal('BOOK_EDITOR', { edition: e }); }} 
                    onEditEdition={(e) => { setProfileVisible(false); openModal('BOOK_EDITOR', { edition: e }); }} 
                />
            )}
        </AnimatePresence>
      </Suspense>
    </>
  );
};

export default ModalManager;