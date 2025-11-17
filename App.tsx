
import React, { useState, useEffect, useMemo, useCallback, lazy, Suspense, useRef } from 'react';
import { motion, AnimatePresence, useAnimationControls } from 'framer-motion';
import { Product, ViewMode, Theme, CartItem, ToastMessage, SortOption, QuickViewProduct, WishlistItem, RecentlyViewedItem, ChatMessage, Appearance, CompareItem, Locale, BreadcrumbItem, OnboardingStep } from './types';
import { themes } from './constants';
import { ManageIcon, CartIcon, CommandIcon, SparklesIcon, MenuIcon, HeartIcon, MessageSquareIcon, SettingsIcon, SearchIcon, ImageIcon, MaximizeIcon, MinimizeIcon } from './components/icons';
import LoadingSkeleton from './components/LoadingSkeleton';
import SearchBar from './components/SearchBar';
import MobileMenu from './components/MobileMenu';
import Tooltip from './components/Tooltip';
import AccessibilityAnnouncer from './components/AccessibilityAnnouncer';
import { TranslationProvider, useTranslation } from './hooks/useTranslation';
import useLocalStorage from './hooks/useLocalStorage';
import ToastContainer from './components/Toast';

// New Component Imports
import FilterSidebar from './components/FilterSidebar';
import RecentlyViewed from './components/RecentlyViewed';
import CompareTray from './components/CompareTray';
import Breadcrumbs from './components/Breadcrumbs';

// Lazy load Modals for Performance
const ProductDetailModal = lazy(() => import('./components/ProductDetailModal'));
const ProductManagementModal = lazy(() => import('./components/ProductManagementModal'));
const CartModal = lazy(() => import('./components/CartModal'));
const PurchaseModal = lazy(() => import('./components/PurchaseModal'));
const CommandPalette = lazy(() => import('./components/CommandPalette'));
const WishlistModal = lazy(() => import('./components/WishlistModal'));
const QuickViewModal = lazy(() => import('./components/QuickViewModal'));
const AIAssistant = lazy(() => import('./components/AIAssistant'));
const SettingsModal = lazy(() => import('./components/SettingsModal'));
const CompareModal = lazy(() => import('./components/CompareModal'));
const VisualSearchModal = lazy(() => import('./components/VisualSearchModal'));
const OnboardingTour = lazy(() => import('./components/OnboardingTour'));
const ConfirmationModal = lazy(() => import('./components/ConfirmationModal'));


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
        const handler = setTimeout(() => { setDebouncedValue(value); }, delay);
        return () => { clearTimeout(handler); };
    }, [value, delay]);
    return debouncedValue;
};

const ITEMS_PER_PAGE = 8;

const AppContent: React.FC = () => {
  type ViewModeSettings = { [key in Theme]?: ViewMode };
  const [viewModes, setViewModes] = useLocalStorage<ViewModeSettings>('viewModes', {});

  const [appThemes, setAppThemes] = useState(themes);
  const [activeTheme, setActiveTheme] = useLocalStorage<Theme>('theme', Theme.Electronics);
  
  const viewMode = useMemo(() => viewModes[activeTheme] || ViewMode.Grid, [viewModes, activeTheme]);
  const setViewMode = (newView: ViewMode) => setViewModes(prev => ({ ...prev, [activeTheme]: newView }));
  
  const [appearance, setAppearance] = useLocalStorage<Appearance>('appearance', Appearance.System);
  const [reduceMotion, setReduceMotion] = useLocalStorage<boolean>('reduceMotion', false);

  const { t, locale, setLocale } = useTranslation();
  
  const [isManageModalOpen, setManageModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isPurchaseModalOpen, setPurchaseModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useLocalStorage<CartItem[]>('cart', []);
  const [isCartModalOpen, setCartModalOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [isCommandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [announcerMessage, setAnnouncerMessage] = useState('');
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isHeaderScrolled, setIsHeaderScrolled] = useState(false);

  const [wishlist, setWishlist] = useLocalStorage<WishlistItem[]>('wishlist', []);
  const [isWishlistOpen, setWishlistOpen] = useState(false);
  const [recentlyViewed, setRecentlyViewed] = useLocalStorage<RecentlyViewedItem[]>('recentlyViewed', []);
  const [quickViewProduct, setQuickViewProduct] = useState<QuickViewProduct>(null);
  const [isAIAssistantOpen, setAIAssistantOpen] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [visibleProductsCount, setVisibleProductsCount] = useState(ITEMS_PER_PAGE);
  const [compareItems, setCompareItems] = useLocalStorage<CompareItem[]>('compareItems', []);
  const [isCompareModalOpen, setCompareModalOpen] = useState(false);
  const [isSettingsModalOpen, setSettingsModalOpen] = useState(false);
  const [isVisualSearchOpen, setVisualSearchOpen] = useState(false);
  const [hasSeenOnboarding, setHasSeenOnboarding] = useLocalStorage('onboardingSeen', false);
  const [isOnboardingOpen, setOnboardingOpen] = useState(!hasSeenOnboarding);
  const [confirmation, setConfirmation] = useState<{ title: string; message: string; onConfirm: () => void } | null>(null);
  const [flyingImage, setFlyingImage] = useState<{ src: string; rect: DOMRect } | null>(null);
  const [isZenMode, setZenMode] = useState(false);

  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [sortOption, setSortOption] = useState<SortOption>('default');

  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  const cartIconControls = useAnimationControls();
  const cartIconRef = useRef<HTMLButtonElement>(null);

  const isSystemDark = useMemo(() => window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches, []);
  const finalAppearance = useMemo(() => {
    if (appearance === Appearance.System) {
        return isSystemDark ? Appearance.Dark : Appearance.Light;
    }
    return appearance;
  }, [appearance, isSystemDark]);

  const currentThemeStyles = appThemes[activeTheme].styles[finalAppearance];
  const PRODUCTS = appThemes[activeTheme].products;
  
  useEffect(() => {
    document.documentElement.className = finalAppearance === 'high-contrast' ? 'dark' : finalAppearance;
    document.body.classList.toggle('zen-mode', isZenMode);
  }, [finalAppearance, isZenMode]);
  
  useEffect(() => {
    document.body.classList.add('gradient-bg');
    if (selectedProduct) {
        document.title = `Showcase | ${selectedProduct.name}`;
    } else {
        document.title = `Showcase | ${activeTheme}`;
    }
    const style = document.createElement('style');
    style.innerHTML = `
      :root {
        ${Object.entries(currentThemeStyles).map(([key, value]) => `${key}: ${value};`).join('\n')}
      }
    `;
    document.head.appendChild(style);
    return () => { document.head.removeChild(style); };
  }, [activeTheme, finalAppearance, currentThemeStyles, selectedProduct]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
        if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); setCommandPaletteOpen(isOpen => !isOpen); }
    };
    const handleScroll = () => setIsHeaderScrolled(window.scrollY > 10);
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('scroll', handleScroll);
    return () => {
        window.removeEventListener('keydown', handleKeyDown);
        window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  const allAvailableProducts = useMemo(() => [...new Set(PRODUCTS.map(p => p.category))].sort(), [PRODUCTS]);
  const allAvailableColors = useMemo(() => [...new Set(PRODUCTS.flatMap(p => p.colors || []))].sort(), [PRODUCTS]);
  
  const maxPrice = useMemo(() => Math.ceil(Math.max(...PRODUCTS.map(p => p.price), 0) / 100) * 100, [PRODUCTS]);
  const [priceRange, setPriceRange] = useState({ min: 0, max: maxPrice });

  const resetFilters = useCallback(() => {
    setPriceRange({ min: 0, max: maxPrice });
    setSelectedCategories([]);
    setSelectedColors([]);
    setSortOption('default');
  }, [maxPrice]);
  
  useEffect(() => {
    resetFilters();
    setSearchQuery('');
    setVisibleProductsCount(ITEMS_PER_PAGE);
  }, [activeTheme, maxPrice, resetFilters]);

  const filteredProducts = useMemo(() => {
    let processed = [...PRODUCTS].filter(p => {
      const searchLower = debouncedSearchQuery.toLowerCase();
      return (p.name.toLowerCase().includes(searchLower) || p.description.toLowerCase().includes(searchLower)) &&
             (p.price >= priceRange.min && p.price <= priceRange.max) &&
             (selectedCategories.length === 0 || selectedCategories.includes(p.category)) &&
             (selectedColors.length === 0 || p.colors?.some(c => selectedColors.includes(c)));
    });
    switch (sortOption) {
      case 'name-asc': processed.sort((a, b) => a.name.localeCompare(b.name)); break;
      case 'name-desc': processed.sort((a, b) => b.name.localeCompare(a.name)); break;
      case 'price-asc': processed.sort((a, b) => a.price - b.price); break;
      case 'price-desc': processed.sort((a, b) => b.price - a.price); break;
      case 'rating-desc': processed.sort((a, b) => (b.reviews?.reduce((acc, r) => acc + r.rating, 0) / (b.reviews?.length || 1) || 0) - (a.reviews?.reduce((acc, r) => acc + r.rating, 0) / (a.reviews?.length || 1) || 0)); break;
      case 'newest-desc': processed.reverse(); break;
    }
    return processed;
  }, [PRODUCTS, debouncedSearchQuery, priceRange, selectedCategories, selectedColors, sortOption]);

  const paginatedProducts = useMemo(() => filteredProducts.slice(0, visibleProductsCount), [filteredProducts, visibleProductsCount]);

  useEffect(() => { setAnnouncerMessage(debouncedSearchQuery ? `Showing ${filteredProducts.length} products.` : ''); }, [filteredProducts.length, debouncedSearchQuery]);

  const handleSetView = useCallback((newView: ViewMode) => {
    setViewMode(newView);
    setAnnouncerMessage(`Switched to ${newView} view.`);
  }, [setViewMode]);
  const addToast = (message: string) => setToasts(prev => [...prev, { id: Date.now(), message }]);
  const removeToast = (id: number) => setToasts(prev => prev.filter(t => t.id !== id));

  const handleAddToCart = useCallback((product: Product, quantity: number = 1, event?: React.MouseEvent<HTMLButtonElement>) => {
    if (product.stock.level === 'out-of-stock') {
      addToast(`${product.name} is out of stock.`);
      return;
    }
    if (event && !reduceMotion) {
      const rect = event.currentTarget.getBoundingClientRect();
      setFlyingImage({ src: product.imageUrl, rect });
    }
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) return prev.map(item => item.product.id === product.id ? { ...item, quantity: item.quantity + quantity } : item);
      return [...prev, { product, quantity }];
    });
    addToast(`${product.name} added to cart.`);
  }, [reduceMotion, setCart]);

  const handleAddToCollection = useCallback((product: Product) => {
    addToast(`${product.name} has been added to a collection.`);
  }, []);

  const handleNotifyMe = useCallback((product: Product) => {
    addToast(`You'll be notified when ${product.name} is back in stock.`);
  }, []);

  useEffect(() => {
    if (flyingImage) {
      const cartRect = cartIconRef.current?.getBoundingClientRect();
      if (cartRect) {
        const flyAnimation = async () => {
          await new Promise(resolve => setTimeout(resolve, 500)); 
          if (!reduceMotion) cartIconControls.start({ scale: [1, 1.3, 1], rotate: [0, -10, 10, 0], transition: { duration: 0.5 } });
          setFlyingImage(null);
        };
        flyAnimation();
      }
    }
  }, [flyingImage, cartIconControls, reduceMotion]);
  
  const handleUpdateCartQuantity = (id: number, newQty: number) => setCart(p => newQty <= 0 ? p.filter(i => i.product.id !== id) : p.map(i => i.product.id === id ? { ...i, quantity: newQty } : i));
  const handleRemoveFromCart = (id: number) => setCart(p => p.filter(i => i.product.id !== id));
  const handleClearCart = () => setConfirmation({ title: 'Clear Cart', message: 'Are you sure you want to remove all items from your cart?', onConfirm: () => { setCart([]); setConfirmation(null); } });
  const handleCheckout = () => { setCartModalOpen(false); setPurchaseModalOpen(true); };
  const handlePurchaseSuccess = () => { addToast('Purchase successful!'); setPurchaseModalOpen(false); setCart([]); };
  const handleUpdateProductImage = (id: number, url: string) => setAppThemes(c => ({ ...c, [activeTheme]: { ...c[activeTheme], products: c[activeTheme].products.map(p => p.id === id ? { ...p, imageUrl: url } : p) } }));
  const handleUpdateProductDescription = (id: number, desc: string) => setAppThemes(c => ({ ...c, [activeTheme]: { ...c[activeTheme], products: c[activeTheme].products.map(p => p.id === id ? { ...p, description: desc } : p) } }));
  const handleUpdateProductStory = (id: number, story: { title: string; narrative: string; }) => setAppThemes(c => ({ ...c, [activeTheme]: { ...c[activeTheme], products: c[activeTheme].products.map(p => p.id === id ? { ...p, story: { ...p.story!, ...story } } : p) } }));
  const handleProductClick = (product: Product) => { setSelectedProduct(product); setRecentlyViewed(prev => [product, ...prev.filter(p => p.id !== product.id)].slice(0, 10)); };
  const handleQuickView = (product: Product) => setQuickViewProduct(product);
  const handleBuyNow = (product: Product, quantity: number) => { handleAddToCart(product, quantity); setSelectedProduct(null); setQuickViewProduct(null); handleCheckout(); };
  const surpriseMe = () => handleProductClick(PRODUCTS[Math.floor(Math.random() * PRODUCTS.length)]);
  const handleToggleWishlist = (product: Product) => setWishlist(prev => prev.find(p => p.id === product.id) ? prev.filter(p => p.id !== product.id) : [...prev, product]);
  const isProductInWishlist = (id: number) => wishlist.some(p => p.id === id);
  const handleToggleCompare = (product: Product) => {
    setCompareItems(prev => prev.find(p => p.id === product.id) ? prev.filter(p => p.id !== product.id) : (prev.length < 4 ? [...prev, product] : prev));
  };
  const isProductInCompare = (id: number) => compareItems.some(p => p.id === id);

  const cartItemCount = useMemo(() => cart.reduce((t, i) => t + i.quantity, 0), [cart]);
  const isAnyModalOpen = isManageModalOpen || isPurchaseModalOpen || !!selectedProduct || isCartModalOpen || isCommandPaletteOpen || isMobileMenuOpen || !!quickViewProduct || isWishlistOpen || isCompareModalOpen || isSettingsModalOpen || isVisualSearchOpen || !!confirmation;
  
  useEffect(() => { document.body.style.overflow = isAnyModalOpen ? 'hidden' : 'auto'; }, [isAnyModalOpen]);

  const breadcrumbs = useMemo<BreadcrumbItem[]>(() => {
    const crumbs: BreadcrumbItem[] = [{ label: 'Home', onClick: () => { setSelectedProduct(null); resetFilters(); } }];
    if(selectedProduct) {
      crumbs.push({ label: selectedProduct.category, onClick: () => { setSelectedProduct(null); setSelectedCategories([selectedProduct.category]); } });
      crumbs.push({ label: selectedProduct.name });
    } else if(selectedCategories.length === 1) {
      crumbs.push({ label: selectedCategories[0] });
    }
    return crumbs;
  }, [selectedProduct, selectedCategories, resetFilters]);

  const renderView = () => {
    if (paginatedProducts.length === 0 && (debouncedSearchQuery || selectedCategories.length > 0 || selectedColors.length > 0 || priceRange.min > 0 || priceRange.max < maxPrice)) {
      return (
        <div className="text-center py-20 bg-[var(--background-secondary)] rounded-[var(--border-radius)] flex flex-col items-center">
          <div className="w-24 h-24 flex items-center justify-center rounded-full bg-[var(--background-tertiary)] mb-6">
            <SearchIcon className="w-12 h-12 text-[var(--primary-accent)]" />
          </div>
          <h2 className="text-2xl font-bold text-[var(--text-primary)]">{t('noProductsFound')}</h2>
          <p className="mt-2 text-[var(--text-secondary)]">{t('noProductsFoundDesc')}</p>
        </div>
      );
    }
    const baseProps = { onProductClick: handleProductClick, onAddToCart: handleAddToCart, onQuickView: handleQuickView, onToggleWishlist: handleToggleWishlist, isProductInWishlist, onToggleCompare: handleToggleCompare, isProductInCompare, onAddToCollection: handleAddToCollection, onNotifyMe: handleNotifyMe };
    const viewProps = { ...baseProps, products: paginatedProducts, reduceMotion };
    const viewPropsWithSearch = { ...viewProps, searchQuery: debouncedSearchQuery };

    switch (viewMode) {
      case ViewMode.Grid: return <GridView {...viewPropsWithSearch} />;
      case ViewMode.List: return <ListView {...viewPropsWithSearch} />;
      case ViewMode.Table: return <TableView products={paginatedProducts} onProductClick={handleProductClick} />;
      case ViewMode.Flip: return <FlipView {...viewProps} />;
      case ViewMode.Carousel: return <CarouselView products={paginatedProducts} onProductClick={handleProductClick} onAddToCart={handleAddToCart} />;
      case ViewMode.ThreeD: return <ThreeDView themeStyles={currentThemeStyles} />;
      case ViewMode.Story: return <StoryView {...baseProps} products={paginatedProducts.filter(p => p.story)} reduceMotion={reduceMotion} />;
      default: return <GridView {...viewPropsWithSearch} />;
    }
  };
  
  const filterProps = { priceRange, setPriceRange, maxPrice, categories: allAvailableProducts, selectedCategories, setSelectedCategories, colors: allAvailableColors, selectedColors, setSelectedColors, sortOption, setSortOption, resetFilters };
  const settingsProps = { activeTheme, setActiveTheme, appearance, setAppearance, reduceMotion, setReduceMotion, locale, setLocale };
  
  return (
    <>
      <AccessibilityAnnouncer message={announcerMessage} />
      <div className={`main-content-wrapper ${isAnyModalOpen ? 'modal-open-blur' : ''}`}>
        <header id="main-header" className={`glass-header sticky top-0 z-20 ${isHeaderScrolled ? 'scrolled-header' : ''}`}>
          <div className="container mx-auto px-4 py-4 flex flex-wrap justify-between items-center gap-4">
            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[var(--header-gradient-from)] to-[var(--header-gradient-to)] order-1">{t('showcaseTitle')}</h1>
            <div className="hidden lg:flex flex-grow items-center justify-center gap-4 order-2">
            </div>
            <div className="hidden lg:flex items-center gap-2 order-3">
              <Suspense fallback={<div className="w-96 h-10 bg-[var(--background-tertiary)] rounded-md" />}><ViewSwitcher currentView={viewMode} setView={handleSetView} /></Suspense>
              <div className="flex items-center bg-[var(--background-tertiary)] rounded-[var(--border-radius)] p-1">
                <Tooltip text="Zen Mode"><motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => setZenMode(z => !z)} className="p-2 text-[var(--text-secondary)] hover:text-[var(--primary-accent)]" aria-label="Zen Mode">{isZenMode ? <MinimizeIcon/> : <MaximizeIcon />}</motion.button></Tooltip>
                <Tooltip text="Visual Search"><motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => setVisualSearchOpen(true)} className="p-2 text-[var(--text-secondary)] hover:text-[var(--primary-accent)]" aria-label="Visual Search"><ImageIcon className="w-5 h-5" /></motion.button></Tooltip>
                <Tooltip text={t('surpriseMeTooltip')}><motion.button whileHover={{ scale: 1.1, rotate: 5 }} whileTap={{ scale: 0.9 }} onClick={surpriseMe} className="p-2 text-[var(--text-secondary)] hover:text-[var(--primary-accent)]" aria-label="Surprise Me"><SparklesIcon className="w-5 h-5" /></motion.button></Tooltip>
                <Tooltip text={t('commandPaletteTooltip')}><motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => setCommandPaletteOpen(true)} className="p-2 text-[var(--text-secondary)] hover:text-[var(--primary-accent)]" aria-label="Command Palette"><CommandIcon className="w-5 h-5" /></motion.button></Tooltip>
                <Tooltip text={t('manageProductsTooltip')}><motion.button whileHover={{ scale: 1.1, rotate: -5 }} whileTap={{ scale: 0.9 }} onClick={() => setManageModalOpen(true)} className="p-2 text-[var(--text-secondary)] hover:text-[var(--primary-accent)]" aria-label="Manage Products"><ManageIcon className="w-5 h-5" /></motion.button></Tooltip>
              </div>
            </div>
            <div className="flex items-center gap-4 order-2 lg:hidden">
                <Tooltip text={t('settingsTooltip')}><motion.button onClick={() => setSettingsModalOpen(true)} className="relative p-2 text-[var(--text-secondary)] hover:text-[var(--primary-accent)]"><SettingsIcon className="w-6 h-6" /></motion.button></Tooltip>
                <Tooltip text={t('wishlistTooltip', {count: wishlist.length})}><motion.button onClick={() => setWishlistOpen(true)} className="relative p-2 text-[var(--text-secondary)] hover:text-[var(--primary-accent)]"><HeartIcon className="w-6 h-6" /></motion.button></Tooltip>
                <Tooltip text={t('cartTooltip', {count: cartItemCount})}><motion.button ref={cartIconRef} animate={cartIconControls} onClick={() => setCartModalOpen(true)} className="relative p-2 text-[var(--text-secondary)] hover:text-[var(--primary-accent)]"><CartIcon className="w-6 h-6" />{cartItemCount > 0 && (<span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[var(--primary-accent)] text-white text-[10px] font-bold">{cartItemCount}</span>)}</motion.button></Tooltip>
                <button onClick={() => setMobileMenuOpen(true)} className="p-2 text-[var(--text-secondary)] hover:text-[var(--primary-accent)]" aria-label="Open menu"><MenuIcon className="w-6 h-6" /></button>
            </div>
            <div className="hidden lg:flex items-center gap-3 order-4">
                <Tooltip text={t('settingsTooltip')}><motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => setSettingsModalOpen(true)} className="p-2 bg-[var(--background-tertiary)] rounded-[var(--border-radius)] text-[var(--text-secondary)] hover:text-[var(--primary-accent)]"><SettingsIcon className="w-5 h-5" /></motion.button></Tooltip>
                <Tooltip text={t('wishlistTooltip', {count: wishlist.length})}><motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => setWishlistOpen(true)} className="relative p-2 bg-[var(--background-tertiary)] rounded-[var(--border-radius)] text-[var(--text-secondary)] hover:text-[var(--primary-accent)]"><HeartIcon className="w-5 h-5" />{wishlist.length > 0 && (<span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[var(--primary-accent)] text-white text-[10px] font-bold">{wishlist.length}</span>)}</motion.button></Tooltip>
                <Tooltip text={t('cartTooltip', {count: cartItemCount})}><motion.button ref={cartIconRef} animate={cartIconControls} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => setCartModalOpen(true)} className="relative p-2 bg-[var(--background-tertiary)] rounded-[var(--border-radius)] text-[var(--text-secondary)] hover:text-[var(--primary-accent)]"><CartIcon className="w-5 h-5" />{cartItemCount > 0 && (<span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[var(--primary-accent)] text-white text-[10px] font-bold">{cartItemCount}</span>)}</motion.button></Tooltip>
            </div>
          </div>
        </header>
        
        <main className="container mx-auto px-4 py-8">
            <Breadcrumbs items={breadcrumbs} />
            <div className="lg:grid lg:grid-cols-4 lg:gap-8">
                <FilterSidebar
                    {...filterProps}
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    className="hidden lg:block"
                    id="filter-sidebar"
                />
                <div className="lg:col-span-3">
                    <Suspense fallback={<LoadingSkeleton viewMode={viewMode} />}>
                        <AnimatePresence mode="wait">{!reduceMotion ? (<motion.div key={viewMode} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>{renderView()}</motion.div>) : renderView()}</AnimatePresence>
                    </Suspense>
                    {visibleProductsCount < filteredProducts.length && (<div className="mt-8 text-center"><motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setVisibleProductsCount(c => c + ITEMS_PER_PAGE)} className="px-6 py-3 bg-[var(--primary-accent)] text-white font-bold rounded-[var(--border-radius)] hover:bg-[var(--primary-accent-hover)] transition-colors">{t('loadMore')}</motion.button></div>)}
                </div>
            </div>
        </main>
        
        <RecentlyViewed products={recentlyViewed} onProductClick={handleProductClick} />
        
        <footer id="app-footer" className="text-center py-10 mt-10 border-t border-[var(--border-color)]">
            <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
                <div><h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[var(--header-gradient-from)] to-[var(--header-gradient-to)]">{t('showcaseTitle')}</h3><p className="mt-2 text-sm text-[var(--text-secondary)]">{t('footerSlogan')}</p></div>
                <div><h4 className="font-semibold text-[var(--text-primary)]">{t('quickLinks')}</h4><ul className="mt-2 space-y-1 text-sm text-[var(--text-secondary)]"><li><a href="#" className="hover:text-[var(--primary-accent)]">{t('aboutUs')}</a></li><li><a href="#" className="hover:text-[var(--primary-accent)]">{t('contact')}</a></li><li><a href="#" className="hover:text-[var(--primary-accent)]">{t('faq')}</a></li></ul></div>
                <div><h4 className="font-semibold text-[var(--text-primary)]">{t('followUs')}</h4><p className="mt-2 text-sm text-[var(--text-secondary)]">{t('followUsDesc')}</p></div>
            </div>
             <p className="mt-8 text-xs text-[var(--text-secondary)]">{t('copyright', { year: new Date().getFullYear() })}</p>
        </footer>
      </div>

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

      <ToastContainer toasts={toasts} removeToast={removeToast} />
      <CompareTray items={compareItems} onRemove={handleToggleCompare} onCompare={() => setCompareModalOpen(true)} onClear={() => setCompareItems([])} />
      
      <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setMobileMenuOpen(false)} searchQuery={searchQuery} setSearchQuery={setSearchQuery} filterPopoverProps={filterProps} themeSwitcherProps={{ currentTheme: activeTheme, setTheme: setActiveTheme }} viewSwitcherProps={{ currentView: viewMode, setView: handleSetView }} surpriseMe={surpriseMe} openCommandPalette={() => setCommandPaletteOpen(true)} openManageModal={() => setManageModalOpen(true)} openSettingsModal={() => setSettingsModalOpen(true)} />
      
      <Suspense>{isAIAssistantOpen && <AIAssistant isOpen={isAIAssistantOpen} setIsOpen={setAIAssistantOpen} chatHistory={chatHistory} setChatHistory={setChatHistory} products={PRODUCTS}/>}</Suspense>
      <button onClick={() => setAIAssistantOpen(true)} className="ai-assistant-button fixed bottom-6 right-6 lg:bottom-10 lg:right-10 z-30 p-4 bg-[var(--primary-accent)] text-white rounded-full shadow-lg hover:bg-[var(--primary-accent-hover)] transition-all transform hover:scale-110" aria-label="Open AI Assistant"><MessageSquareIcon className="w-8 h-8" /></button>
      
      <Suspense>
          {isManageModalOpen && <ProductManagementModal isOpen={isManageModalOpen} onClose={() => setManageModalOpen(false)} products={PRODUCTS} onUpdateImage={handleUpdateProductImage} onUpdateDescription={handleUpdateProductDescription} onUpdateStory={handleUpdateProductStory} />}
          {selectedProduct && <ProductDetailModal allProducts={PRODUCTS} isOpen={!!selectedProduct} product={selectedProduct} onClose={() => setSelectedProduct(null)} onAddToCart={handleAddToCart} onBuyNow={handleBuyNow} onProductClick={handleProductClick} />}
          {isCartModalOpen && <CartModal isOpen={isCartModalOpen} onClose={() => setCartModalOpen(false)} cartItems={cart} onUpdateQuantity={handleUpdateCartQuantity} onRemoveItem={handleRemoveFromCart} onClearCart={handleClearCart} onCheckout={handleCheckout} />}
          {isPurchaseModalOpen && <PurchaseModal isOpen={isPurchaseModalOpen} cart={cart} onClose={() => setPurchaseModalOpen(false)} onPurchaseSuccess={handlePurchaseSuccess} />}
          {isCommandPaletteOpen && <CommandPalette isOpen={isCommandPaletteOpen} onClose={() => setCommandPaletteOpen(false)} setView={handleSetView} setTheme={setActiveTheme} />}
          {isWishlistOpen && <WishlistModal isOpen={isWishlistOpen} onClose={() => setWishlistOpen(false)} wishlistItems={wishlist} onRemoveFromWishlist={handleToggleWishlist} onAddToCart={handleAddToCart} />}
          {quickViewProduct && <QuickViewModal isOpen={!!quickViewProduct} product={quickViewProduct} onClose={() => setQuickViewProduct(null)} onAddToCart={handleAddToCart} onNavigateToProduct={handleProductClick} />}
          {isSettingsModalOpen && <SettingsModal isOpen={isSettingsModalOpen} onClose={() => setSettingsModalOpen(false)} {...settingsProps} />}
          {isCompareModalOpen && <CompareModal isOpen={isCompareModalOpen} onClose={() => setCompareModalOpen(false)} items={compareItems} allProducts={PRODUCTS} />}
          {isVisualSearchOpen && <VisualSearchModal isOpen={isVisualSearchOpen} onClose={() => setVisualSearchOpen(false)} allProducts={PRODUCTS} onProductClick={handleProductClick} />}
          {isOnboardingOpen && <OnboardingTour isOpen={isOnboardingOpen} onClose={() => { setOnboardingOpen(false); setHasSeenOnboarding(true); }} />}
          {confirmation && <ConfirmationModal isOpen={!!confirmation} onClose={() => setConfirmation(null)} title={confirmation.title} message={confirmation.message} onConfirm={confirmation.onConfirm} />}
      </Suspense>
    </>
  );
};

const App = () => (
    <TranslationProvider>
        <AppContent />
    </TranslationProvider>
);

export default App;
