import React, { useState, useEffect, useMemo, useCallback, lazy, Suspense, useRef } from 'react';
import { motion, AnimatePresence, useAnimationControls } from 'framer-motion';
import { Product, ViewMode, Theme, CartItem, ToastMessage, SortOption, QuickViewProduct, WishlistItem, RecentlyViewedItem, ChatMessage } from './types';
import { themes } from './constants';
import ThemeSwitcher from './components/ThemeSwitcher';
import { ManageIcon, CartIcon, CommandIcon, SparklesIcon, MenuIcon, HeartIcon, MessageSquareIcon } from './components/icons';
import LoadingSkeleton from './components/LoadingSkeleton';
import SearchBar from './components/SearchBar';
import ProductDetailModal from './components/ProductDetailModal';
import CartModal from './components/CartModal';
import ToastContainer from './components/Toast';
import CommandPalette from './components/CommandPalette';
import ScrollToTopButton from './components/ScrollToTopButton';
import Tooltip from './components/Tooltip';
import AccessibilityAnnouncer from './components/AccessibilityAnnouncer';
import MobileMenu from './components/MobileMenu';
import PurchaseModal from './components/PurchaseModal';
import ProductManagementModal from './components/ProductManagementModal';

// New Component Imports
import FilterSidebar from './components/FilterSidebar';
import RecentlyViewed from './components/RecentlyViewed';
import AIAssistant from './components/AIAssistant';
import WishlistModal from './components/WishlistModal';
import QuickViewModal from './components/QuickViewModal';

// Lazy load views for Code Splitting
const GridView = lazy(() => import('./components/GridView'));
const ListView = lazy(() => import('./components/ListView'));
const TableView = lazy(() => import('./components/TableView'));
const FlipView = lazy(() => import('./components/FlipView'));
const CarouselView = lazy(() => import('./components/CarouselView'));
const ThreeDView = lazy(() => import('./components/ThreeDView'));
const StoryView = lazy(() => import('./components/StoryView'));
const ViewSwitcher = lazy(() => import('./components/ViewSwitcher'));

// Debounce Hook
const useDebounce = (value: string, delay: number) => {
    const [debouncedValue, setDebouncedValue] = useState(value);
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);
        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);
    return debouncedValue;
};

const ITEMS_PER_PAGE = 8;

const App: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>(() => (localStorage.getItem('viewMode') as ViewMode) || ViewMode.Grid);
  const [appThemes, setAppThemes] = useState(themes);
  const [activeTheme, setActiveTheme] = useState<Theme>(() => (localStorage.getItem('theme') as Theme) || Theme.Electronics);
  
  const [isManageModalOpen, setManageModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isPurchaseModalOpen, setPurchaseModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartModalOpen, setCartModalOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [isCommandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [showScrollToTop, setShowScrollToTop] = useState(false);
  const [announcerMessage, setAnnouncerMessage] = useState('');
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  // State for new features
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [isWishlistOpen, setWishlistOpen] = useState(false);
  const [recentlyViewed, setRecentlyViewed] = useState<RecentlyViewedItem[]>([]);
  const [quickViewProduct, setQuickViewProduct] = useState<QuickViewProduct>(null);
  const [isAIAssistantOpen, setAIAssistantOpen] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [visibleProductsCount, setVisibleProductsCount] = useState(ITEMS_PER_PAGE);

  // Filter state
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [sortOption, setSortOption] = useState<SortOption>('default');

  const currentThemeData = appThemes[activeTheme];
  const PRODUCTS = currentThemeData.products;
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  const cartIconControls = useAnimationControls();

  // Persist preferences
  useEffect(() => { localStorage.setItem('viewMode', viewMode); }, [viewMode]);
  useEffect(() => { localStorage.setItem('theme', activeTheme); }, [activeTheme]);

  // Dynamic theme styles
  useEffect(() => {
    document.body.classList.add('gradient-bg');
    const style = document.createElement('style');
    style.innerHTML = `
      body {
        transition: background-color var(--theme-transition-duration), color var(--theme-transition-duration);
      }
      body.gradient-bg {
        --bg-gradient-1: ${currentThemeData.styles['--bg-gradient-1']};
        --bg-gradient-2: ${currentThemeData.styles['--bg-gradient-2']};
        --bg-gradient-3: ${currentThemeData.styles['--bg-gradient-3']};
      }
      ::selection {
        background-color: ${currentThemeData.styles['--primary-accent']};
        color: ${currentThemeData.styles['--background-primary']};
      }
    `;
    document.head.appendChild(style);
    return () => { document.head.removeChild(style); };
  }, [activeTheme, currentThemeData.styles]);

  // Keyboard shortcuts and scroll listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
        if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
            e.preventDefault();
            setCommandPaletteOpen(isOpen => !isOpen);
        }
    };
    const handleScroll = () => setShowScrollToTop(window.scrollY > 300);
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('scroll', handleScroll);
    return () => {
        window.removeEventListener('keydown', handleKeyDown);
        window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  const maxPrice = useMemo(() => Math.ceil(Math.max(...PRODUCTS.map(p => p.price), 0) / 100) * 100, [PRODUCTS]);
  const [priceRange, setPriceRange] = useState({ min: 0, max: maxPrice });

  const resetFilters = useCallback(() => {
    setPriceRange({ min: 0, max: maxPrice });
    setSelectedCategories([]);
    setSortOption('default');
  }, [maxPrice]);
  
  useEffect(() => {
    resetFilters();
    setSearchQuery('');
    setVisibleProductsCount(ITEMS_PER_PAGE);
  }, [activeTheme, maxPrice, resetFilters]);
  
  const allCategories = useMemo(() => [...new Set(PRODUCTS.map(p => p.category))].sort(), [PRODUCTS]);

  const filteredProducts = useMemo(() => {
    let processed = [...PRODUCTS].filter(p => {
      const searchLower = debouncedSearchQuery.toLowerCase();
      return (p.name.toLowerCase().includes(searchLower) || p.description.toLowerCase().includes(searchLower)) &&
             (p.price >= priceRange.min && p.price <= priceRange.max) &&
             (selectedCategories.length === 0 || selectedCategories.includes(p.category));
    });

    switch (sortOption) {
      case 'name-asc': processed.sort((a, b) => a.name.localeCompare(b.name)); break;
      case 'name-desc': processed.sort((a, b) => b.name.localeCompare(a.name)); break;
      case 'price-asc': processed.sort((a, b) => a.price - b.price); break;
      case 'price-desc': processed.sort((a, b) => b.price - a.price); break;
    }
    return processed;
  }, [PRODUCTS, debouncedSearchQuery, priceRange, selectedCategories, sortOption]);

  const paginatedProducts = useMemo(() => filteredProducts.slice(0, visibleProductsCount), [filteredProducts, visibleProductsCount]);

  useEffect(() => {
      setAnnouncerMessage(debouncedSearchQuery ? `Showing ${filteredProducts.length} products.` : '');
  }, [filteredProducts.length, debouncedSearchQuery]);

  const handleSetView = useCallback((newView: ViewMode) => setViewMode(newView), []);
  
  const addToast = (message: string) => setToasts(prev => [...prev, { id: Date.now(), message }]);
  const removeToast = (id: number) => setToasts(prev => prev.filter(t => t.id !== id));

  const handleAddToCart = useCallback((product: Product, quantity: number = 1) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item => item.product.id === product.id ? { ...item, quantity: item.quantity + quantity } : item);
      }
      return [...prev, { product, quantity }];
    });
    addToast(`${product.name} added to cart!`);
    cartIconControls.start({ scale: [1, 1.3, 1], rotate: [0, -10, 10, 0], transition: { duration: 0.5 } });
  }, [cartIconControls]);
  
  const handleUpdateCartQuantity = (id: number, newQty: number) => setCart(p => newQty <= 0 ? p.filter(i => i.product.id !== id) : p.map(i => i.product.id === id ? { ...i, quantity: newQty } : i));
  const handleRemoveFromCart = (id: number) => setCart(p => p.filter(i => i.product.id !== id));
  const handleClearCart = () => setCart([]);
  const handleCheckout = () => { setCartModalOpen(false); setPurchaseModalOpen(true); };
  const handlePurchaseSuccess = () => { addToast("Purchase successful!"); setPurchaseModalOpen(false); handleClearCart(); };

  const handleUpdateProductImage = (id: number, url: string) => setAppThemes(c => ({ ...c, [activeTheme]: { ...c[activeTheme], products: c[activeTheme].products.map(p => p.id === id ? { ...p, imageUrl: url } : p) } }));
  const handleUpdateProductDescription = (id: number, desc: string) => setAppThemes(c => ({ ...c, [activeTheme]: { ...c[activeTheme], products: c[activeTheme].products.map(p => p.id === id ? { ...p, description: desc } : p) } }));

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setRecentlyViewed(prev => [product, ...prev.filter(p => p.id !== product.id)].slice(0, 10));
  };
  
  const handleQuickView = (product: Product) => setQuickViewProduct(product);
  
  const handleBuyNow = (product: Product, quantity: number) => {
    handleAddToCart(product, quantity);
    setSelectedProduct(null);
    setQuickViewProduct(null);
    handleCheckout();
  };
  
  const surpriseMe = () => handleProductClick(PRODUCTS[Math.floor(Math.random() * PRODUCTS.length)]);

  const handleToggleWishlist = (product: Product) => {
    setWishlist(prev => prev.find(p => p.id === product.id) ? prev.filter(p => p.id === product.id) : [...prev, product]);
  };
  const isProductInWishlist = (id: number) => wishlist.some(p => p.id === id);

  const cartItemCount = useMemo(() => cart.reduce((t, i) => t + i.quantity, 0), [cart]);
  
  const isAnyModalOpen = isManageModalOpen || isPurchaseModalOpen || !!selectedProduct || isCartModalOpen || isCommandPaletteOpen || isMobileMenuOpen || !!quickViewProduct || isWishlistOpen;
  
  useEffect(() => {
    document.body.style.overflow = isAnyModalOpen ? 'hidden' : 'auto';
  }, [isAnyModalOpen]);

  const renderView = () => {
    if (paginatedProducts.length === 0 && debouncedSearchQuery) {
        return (
          <div className="text-center py-20 bg-[var(--background-secondary)] rounded-[var(--border-radius)]">
            <h2 className="text-2xl font-bold text-[var(--text-primary)]">No Products Found</h2>
            <p className="mt-2 text-[var(--text-secondary)]">Try adjusting your search or filter criteria.</p>
          </div>
        );
    }
    const baseProps = { onProductClick: handleProductClick, onAddToCart: handleAddToCart, onQuickView: handleQuickView, onToggleWishlist: handleToggleWishlist, isProductInWishlist };
    const viewProps = { ...baseProps, products: paginatedProducts };
    const viewPropsWithSearch = { ...viewProps, searchQuery: debouncedSearchQuery };

    switch (viewMode) {
      case ViewMode.Grid: return <GridView {...viewPropsWithSearch} />;
      case ViewMode.List: return <ListView {...viewPropsWithSearch} />;
      case ViewMode.Table: return <TableView products={paginatedProducts} onProductClick={handleProductClick} />;
      case ViewMode.Flip: return <FlipView {...viewProps} />;
      case ViewMode.Carousel: return <CarouselView {...viewProps} />;
      case ViewMode.ThreeD: return <ThreeDView themeStyles={currentThemeData.styles} />;
      case ViewMode.Story: return <StoryView {...baseProps} products={paginatedProducts.filter(p => p.story)} />;
      default: return <GridView {...viewPropsWithSearch} />;
    }
  };
  
  const filterProps = { priceRange, setPriceRange, maxPrice, categories: allCategories, selectedCategories, setSelectedCategories, sortOption, setSortOption, resetFilters };

  return (
    <div style={currentThemeData.styles} className="min-h-screen bg-transparent text-[var(--text-primary)] font-sans">
      <AccessibilityAnnouncer message={announcerMessage} />
      <div className={`main-content-wrapper ${isAnyModalOpen ? 'modal-open-blur' : ''}`}>
        <header className="glass-header sticky top-0 z-20 shadow-lg border-b border-white/10">
          <div className="container mx-auto px-4 py-4 flex flex-wrap justify-between items-center gap-4">
            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[var(--header-gradient-from)] to-[var(--header-gradient-to)] order-1">Showcase</h1>
            <div className="hidden lg:flex flex-grow items-center justify-center gap-4 order-2">
                <SearchBar value={searchQuery} onChange={setSearchQuery} />
            </div>
            <div className="hidden lg:flex items-center gap-2 order-3">
              <Suspense fallback={<div className="w-48 h-10 bg-gray-700 rounded-md" />}>
                <ThemeSwitcher currentTheme={activeTheme} setTheme={setActiveTheme} />
              </Suspense>
              <Suspense fallback={<div className="w-96 h-10 bg-gray-700 rounded-md" />}>
                <ViewSwitcher currentView={viewMode} setView={handleSetView} />
              </Suspense>
              <div className="flex items-center bg-[var(--background-tertiary)] rounded-[var(--border-radius)] p-1">
                <Tooltip text="Surprise Me!"><motion.button whileHover={{ scale: 1.1, rotate: 5 }} whileTap={{ scale: 0.9 }} onClick={surpriseMe} className="p-2 text-[var(--text-secondary)] hover:text-[var(--primary-accent)]" aria-label="Surprise Me"><SparklesIcon className="w-5 h-5" /></motion.button></Tooltip>
                <Tooltip text="Command Palette (Ctrl+K)"><motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => setCommandPaletteOpen(true)} className="p-2 text-[var(--text-secondary)] hover:text-[var(--primary-accent)]" aria-label="Command Palette"><CommandIcon className="w-5 h-5" /></motion.button></Tooltip>
                <Tooltip text="Manage Products"><motion.button whileHover={{ scale: 1.1, rotate: -5 }} whileTap={{ scale: 0.9 }} onClick={() => setManageModalOpen(true)} className="p-2 text-[var(--text-secondary)] hover:text-[var(--primary-accent)]" aria-label="Manage Products"><ManageIcon className="w-5 h-5" /></motion.button></Tooltip>
              </div>
            </div>
            <div className="flex items-center gap-4 order-2 lg:hidden">
                <Tooltip text={`Wishlist (${wishlist.length})`}><motion.button onClick={() => setWishlistOpen(true)} className="relative p-2 text-[var(--text-secondary)] hover:text-[var(--primary-accent)]"><HeartIcon className="w-6 h-6" /></motion.button></Tooltip>
                <Tooltip text={`Cart (${cartItemCount})`}><motion.button animate={cartIconControls} onClick={() => setCartModalOpen(true)} className="relative p-2 text-[var(--text-secondary)] hover:text-[var(--primary-accent)]"><CartIcon className="w-6 h-6" />{cartItemCount > 0 && (<span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[var(--primary-accent)] text-white text-[10px] font-bold">{cartItemCount}</span>)}</motion.button></Tooltip>
                <button onClick={() => setMobileMenuOpen(true)} className="p-2 text-[var(--text-secondary)] hover:text-[var(--primary-accent)]" aria-label="Open menu"><MenuIcon className="w-6 h-6" /></button>
            </div>
            <div className="hidden lg:flex items-center gap-3 order-4">
                <Tooltip text={`Wishlist (${wishlist.length})`}><motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => setWishlistOpen(true)} className="relative p-2 bg-[var(--background-tertiary)] rounded-[var(--border-radius)] text-[var(--text-secondary)] hover:text-[var(--primary-accent)]"><HeartIcon className="w-5 h-5" />{wishlist.length > 0 && (<span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[var(--primary-accent)] text-white text-[10px] font-bold">{wishlist.length}</span>)}</motion.button></Tooltip>
                <Tooltip text={`Cart (${cartItemCount})`}><motion.button animate={cartIconControls} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => setCartModalOpen(true)} className="relative p-2 bg-[var(--background-tertiary)] rounded-[var(--border-radius)] text-[var(--text-secondary)] hover:text-[var(--primary-accent)]"><CartIcon className="w-5 h-5" />{cartItemCount > 0 && (<span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[var(--primary-accent)] text-white text-[10px] font-bold">{cartItemCount}</span>)}</motion.button></Tooltip>
            </div>
          </div>
        </header>
        
        <main className="container mx-auto px-4 py-8">
            <div className="lg:grid lg:grid-cols-4 lg:gap-8">
                <FilterSidebar {...filterProps} className="hidden lg:block" />
                <div className="lg:col-span-3">
                    <Suspense fallback={<LoadingSkeleton viewMode={viewMode} />}>
                        <AnimatePresence mode="wait">
                            <motion.div key={viewMode} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
                                {renderView()}
                            </motion.div>
                        </AnimatePresence>
                    </Suspense>
                    {visibleProductsCount < filteredProducts.length && (
                        <div className="mt-8 text-center">
                            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setVisibleProductsCount(c => c + ITEMS_PER_PAGE)} className="px-6 py-3 bg-[var(--primary-accent)] text-white font-bold rounded-[var(--border-radius)] hover:bg-[var(--primary-accent-hover)] transition-colors">
                                Load More
                            </motion.button>
                        </div>
                    )}
                </div>
            </div>
        </main>
        
        <RecentlyViewed products={recentlyViewed} onProductClick={handleProductClick} />
        
        <footer className="text-center py-10 mt-10 border-t border-[var(--border-color)]">
            <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
                <div>
                    <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[var(--header-gradient-from)] to-[var(--header-gradient-to)]">Showcase</h3>
                    <p className="mt-2 text-sm text-[var(--text-secondary)]">The ultimate product viewing experience.</p>
                </div>
                <div>
                    <h4 className="font-semibold text-[var(--text-primary)]">Quick Links</h4>
                    <ul className="mt-2 space-y-1 text-sm text-[var(--text-secondary)]">
                        <li><a href="#" className="hover:text-[var(--primary-accent)]">About Us</a></li>
                        <li><a href="#" className="hover:text-[var(--primary-accent)]">Contact</a></li>
                        <li><a href="#" className="hover:text-[var(--primary-accent)]">FAQ</a></li>
                    </ul>
                </div>
                <div>
                    <h4 className="font-semibold text-[var(--text-primary)]">Follow Us</h4>
                     <p className="mt-2 text-sm text-[var(--text-secondary)]">Join our community on social media.</p>
                </div>
            </div>
             <p className="mt-8 text-xs text-[var(--text-secondary)]">&copy; {new Date().getFullYear()} Showcase. All rights reserved.</p>
        </footer>
      </div>

      <ToastContainer toasts={toasts} removeToast={removeToast} />
      
      <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setMobileMenuOpen(false)} searchQuery={searchQuery} setSearchQuery={setSearchQuery} filterPopoverProps={filterProps} themeSwitcherProps={{ currentTheme: activeTheme, setTheme: setActiveTheme }} viewSwitcherProps={{ currentView: viewMode, setView: handleSetView }} surpriseMe={surpriseMe} openCommandPalette={() => setCommandPaletteOpen(true)} openManageModal={() => setManageModalOpen(true)} />
      
      {/* Modals */}
      <ProductManagementModal isOpen={isManageModalOpen} onClose={() => setManageModalOpen(false)} products={PRODUCTS} onUpdateImage={handleUpdateProductImage} onUpdateDescription={handleUpdateProductDescription} />
      <ProductDetailModal isOpen={!!selectedProduct} product={selectedProduct} onClose={() => setSelectedProduct(null)} onAddToCart={handleAddToCart} onBuyNow={handleBuyNow} />
      <CartModal isOpen={isCartModalOpen} onClose={() => setCartModalOpen(false)} cartItems={cart} onUpdateQuantity={handleUpdateCartQuantity} onRemoveItem={handleRemoveFromCart} onClearCart={handleClearCart} onCheckout={handleCheckout} />
      <PurchaseModal isOpen={isPurchaseModalOpen} cart={cart} onClose={() => setPurchaseModalOpen(false)} onPurchaseSuccess={handlePurchaseSuccess} />
      <CommandPalette isOpen={isCommandPaletteOpen} onClose={() => setCommandPaletteOpen(false)} setView={handleSetView} setTheme={setActiveTheme} />
      <WishlistModal isOpen={isWishlistOpen} onClose={() => setWishlistOpen(false)} wishlistItems={wishlist} onRemoveFromWishlist={handleToggleWishlist} onAddToCart={handleAddToCart} />
      <QuickViewModal isOpen={!!quickViewProduct} product={quickViewProduct} onClose={() => setQuickViewProduct(null)} onAddToCart={handleAddToCart} onNavigateToProduct={handleProductClick} />

      <AIAssistant isOpen={isAIAssistantOpen} setIsOpen={setAIAssistantOpen} chatHistory={chatHistory} setChatHistory={setChatHistory} products={PRODUCTS}/>
      <button onClick={() => setAIAssistantOpen(true)} className="fixed bottom-6 right-6 lg:bottom-10 lg:right-10 z-30 p-4 bg-[var(--primary-accent)] text-white rounded-full shadow-lg hover:bg-[var(--primary-accent-hover)] transition-all transform hover:scale-110" aria-label="Open AI Assistant"><MessageSquareIcon className="w-8 h-8" /></button>
      
      <ScrollToTopButton isVisible={showScrollToTop} />
    </div>
  );
};

export default App;