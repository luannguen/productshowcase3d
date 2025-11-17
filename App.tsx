import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Product, ViewMode, Theme, CartItem, ToastMessage, SortOption } from './types';
import { themes } from './constants';
import ViewSwitcher from './components/ViewSwitcher';
import GridView from './components/GridView';
import ListView from './components/ListView';
import TableView from './components/TableView';
import FlipView from './components/FlipView';
import CarouselView from './components/CarouselView';
import ThreeDView from './components/ThreeDView';
import ThemeSwitcher from './components/ThemeSwitcher';
import StoryView from './components/StoryView';
import ProductManagementModal from './components/ProductManagementModal';
import PurchaseModal from './components/PurchaseModal';
import { ManageIcon, CartIcon, CommandIcon, SparklesIcon } from './components/icons';
import LoadingSkeleton from './components/LoadingSkeleton';
import SearchBar from './components/SearchBar';
import FilterPopover from './components/FilterPopover';
import ProductDetailModal from './components/ProductDetailModal';
import CartModal from './components/CartModal';
import ToastContainer from './components/Toast';
import CommandPalette from './components/CommandPalette';
import ScrollToTopButton from './components/ScrollToTopButton';
import Tooltip from './components/Tooltip';
import AccessibilityAnnouncer from './components/AccessibilityAnnouncer';
import CustomCursor from './components/CustomCursor';

const App: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>(() => {
    return (localStorage.getItem('viewMode') as ViewMode) || ViewMode.Flip;
  });
  const [appThemes, setAppThemes] = useState(themes);
  const [activeTheme, setActiveTheme] = useState<Theme>(() => {
      return (localStorage.getItem('theme') as Theme) || Theme.Electronics;
  });
  
  const [isManageModalOpen, setManageModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isPurchaseModalOpen, setPurchaseModalOpen] = useState(false);
  const [isLoadingView, setIsLoadingView] = useState(true); // Start true for initial load
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartModalOpen, setCartModalOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [isCommandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [showScrollToTop, setShowScrollToTop] = useState(false);
  const [announcerMessage, setAnnouncerMessage] = useState('');

  // New state for filters
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [sortOption, setSortOption] = useState<SortOption>('default');

  const currentThemeData = appThemes[activeTheme];
  const PRODUCTS = currentThemeData.products;

  // Persist user preferences to localStorage
  useEffect(() => {
    localStorage.setItem('viewMode', viewMode);
  }, [viewMode]);

  useEffect(() => {
    localStorage.setItem('theme', activeTheme);
  }, [activeTheme]);

  // Handle dynamic background class
  useEffect(() => {
    document.body.classList.add('gradient-bg');
    const style = document.createElement('style');
    style.innerHTML = `
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
    return () => {
        document.head.removeChild(style);
    };
  }, [activeTheme, currentThemeData.styles]);

  // Keyboard shortcuts and scroll listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
        if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
            e.preventDefault();
            setCommandPaletteOpen(isOpen => !isOpen);
        }
    };

    const handleScroll = () => {
        if (window.scrollY > 300) {
            setShowScrollToTop(true);
        } else {
            setShowScrollToTop(false);
        }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('scroll', handleScroll);
    return () => {
        window.removeEventListener('keydown', handleKeyDown);
        window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  // Initial load effect
  useEffect(() => {
      setTimeout(() => setIsLoadingView(false), 500);
  }, []);

  const maxPrice = useMemo(() => 
    Math.ceil(Math.max(...PRODUCTS.map(p => p.price), 0) / 100) * 100
  , [PRODUCTS]);
  
  const [priceRange, setPriceRange] = useState({ min: 0, max: maxPrice });

  // Reset filters on theme change
  useEffect(() => {
    setPriceRange({ min: 0, max: maxPrice });
    setSearchQuery('');
    setSelectedCategories([]);
    setSortOption('default');
  }, [activeTheme, maxPrice]);
  
  const allCategories = useMemo(() => 
    [...new Set(PRODUCTS.map(p => p.category))].sort()
  , [PRODUCTS]);

  const filteredProducts = useMemo(() => {
    let processedProducts = [...PRODUCTS];

    // 1. Filter
    processedProducts = processedProducts.filter(product => {
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch =
        product.name.toLowerCase().includes(searchLower) ||
        product.description.toLowerCase().includes(searchLower);
      
      const matchesPrice =
        product.price >= priceRange.min && product.price <= priceRange.max;
        
      const matchesCategory =
        selectedCategories.length === 0 || selectedCategories.includes(product.category);

      return matchesSearch && matchesPrice && matchesCategory;
    });

    // 2. Sort
    switch (sortOption) {
        case 'name-asc':
            processedProducts.sort((a, b) => a.name.localeCompare(b.name));
            break;
        case 'name-desc':
            processedProducts.sort((a, b) => b.name.localeCompare(a.name));
            break;
        case 'price-asc':
            processedProducts.sort((a, b) => a.price - b.price);
            break;
        case 'price-desc':
            processedProducts.sort((a, b) => b.price - a.price);
            break;
        default:
            // No sort or sort by ID
            break;
    }

    return processedProducts;
  }, [PRODUCTS, searchQuery, priceRange, selectedCategories, sortOption]);

  // Accessibility Announcer Effect
  useEffect(() => {
    if (filteredProducts.length > 0) {
        setAnnouncerMessage(`Showing ${filteredProducts.length} products.`);
    } else {
        setAnnouncerMessage('No products found.');
    }
  }, [filteredProducts]);
  
  const handleSetView = useCallback((newView: ViewMode) => {
    if (newView !== viewMode) {
      setIsLoadingView(true);
      setViewMode(newView);
      setTimeout(() => setIsLoadingView(false), 500);
    }
  }, [viewMode]);
  
  const addToast = (message: string) => {
    const newToast: ToastMessage = { id: Date.now(), message };
    setToasts(prevToasts => [...prevToasts, newToast]);
  };

  const removeToast = (id: number) => {
      setToasts(prev => prev.filter(t => t.id !== id));
  };

  const handleAddToCart = useCallback((product: Product, quantity: number = 1) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.product.id === product.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prevCart, { product, quantity }];
    });
    addToast(`${product.name} added to cart!`);
  }, []);
  
  const handleUpdateCartQuantity = (productId: number, newQuantity: number) => {
    setCart(prevCart => {
        if (newQuantity <= 0) {
            return prevCart.filter(item => item.product.id !== productId);
        }
        return prevCart.map(item =>
            item.product.id === productId ? { ...item, quantity: newQuantity } : item
        );
    });
  };

  const handleRemoveFromCart = (productId: number) => {
    setCart(prevCart => prevCart.filter(item => item.product.id !== productId));
  };
  
  const handleClearCart = () => setCart([]);
  
  const handleCheckout = () => {
    setCartModalOpen(false);
    setPurchaseModalOpen(true);
  };

  const handlePurchaseSuccess = () => {
    addToast("Purchase successful! Thank you.");
    setPurchaseModalOpen(false);
    handleClearCart();
  };

  const handleUpdateProductImage = (productId: number, newImageUrl: string) => {
    setAppThemes(currentThemes => {
        const updatedProducts = currentThemes[activeTheme].products.map(p =>
            p.id === productId ? { ...p, imageUrl: newImageUrl } : p
        );
        return {
            ...currentThemes,
            [activeTheme]: { ...currentThemes[activeTheme], products: updatedProducts }
        };
    });
  };
  
  const handleUpdateProductDescription = (productId: number, newDescription: string) => {
    setAppThemes(currentThemes => {
        const updatedProducts = currentThemes[activeTheme].products.map(p =>
            p.id === productId ? { ...p, description: newDescription } : p
        );
        return {
            ...currentThemes,
            [activeTheme]: { ...currentThemes[activeTheme], products: updatedProducts }
        };
    });
  };

  const handleProductClick = (product: Product) => setSelectedProduct(product);
  const handleCloseDetailModal = () => setSelectedProduct(null);
  
  const surpriseMe = () => {
      const randomIndex = Math.floor(Math.random() * PRODUCTS.length);
      handleProductClick(PRODUCTS[randomIndex]);
  };

  const cartItemCount = useMemo(() => cart.reduce((total, item) => total + item.quantity, 0), [cart]);
  
  const isModalOpen = isManageModalOpen || isPurchaseModalOpen || selectedProduct !== null || isCartModalOpen || isCommandPaletteOpen;
  
  useEffect(() => {
    const body = document.body;
    if (isModalOpen) { body.style.overflow = 'hidden'; }
    else { body.style.overflow = 'auto'; }
  }, [isModalOpen]);

  const renderView = () => {
    if (isLoadingView) return <LoadingSkeleton viewMode={viewMode} />;
    if (filteredProducts.length === 0) {
        return (
          <div className="text-center py-20 bg-[var(--background-secondary)] rounded-[var(--border-radius)]">
            <h2 className="text-2xl font-bold text-[var(--text-primary)]">No Products Found</h2>
            <p className="mt-2 text-[var(--text-secondary)]">Try adjusting your search or filter criteria.</p>
          </div>
        );
    }
    const baseProps = { products: filteredProducts, onProductClick: handleProductClick, onAddToCart: handleAddToCart };
    const viewPropsWithSearch = { ...baseProps, searchQuery };

    switch (viewMode) {
      case ViewMode.Grid: return <GridView {...viewPropsWithSearch} />;
      case ViewMode.List: return <ListView {...viewPropsWithSearch} />;
      case ViewMode.Table: return <TableView products={filteredProducts} onProductClick={handleProductClick} />;
      case ViewMode.Flip: return <FlipView {...baseProps} />;
      case ViewMode.Carousel: return <CarouselView {...baseProps} />;
      case ViewMode.ThreeD: return <ThreeDView themeStyles={currentThemeData.styles} />;
      case ViewMode.Story: return <StoryView products={filteredProducts.filter(p => p.story)} onAddToCart={handleAddToCart} onProductClick={handleProductClick} />;
      default: return <GridView {...viewPropsWithSearch} />;
    }
  };

  return (
    <div 
        style={currentThemeData.styles}
        className={`min-h-screen bg-transparent text-[var(--text-primary)] font-sans transition-colors duration-500`}
    >
      <CustomCursor />
      <AccessibilityAnnouncer message={announcerMessage} />
      <div className={`main-content-wrapper ${isModalOpen ? 'modal-open-blur' : ''}`}>
        <header className="glass-header sticky top-0 z-20 shadow-lg border-b border-white/10">
          <div className="container mx-auto px-4 py-4 flex flex-wrap justify-between items-center gap-4">
            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[var(--header-gradient-from)] to-[var(--header-gradient-to)] order-1">
              Showcase
            </h1>
            
            <div className="flex-grow flex items-center justify-center gap-4 order-3 lg:order-2 w-full lg:w-auto">
                <SearchBar value={searchQuery} onChange={setSearchQuery} />
                <FilterPopover 
                    priceRange={priceRange}
                    setPriceRange={setPriceRange}
                    maxPrice={maxPrice}
                    categories={allCategories}
                    selectedCategories={selectedCategories}
                    setSelectedCategories={setSelectedCategories}
                    sortOption={sortOption}
                    setSortOption={setSortOption}
                />
            </div>

            <div className="flex items-center gap-2 sm:gap-2 order-2 lg:order-3">
              <ThemeSwitcher currentTheme={activeTheme} setTheme={setActiveTheme} />
              <ViewSwitcher currentView={viewMode} setView={handleSetView} />
              <div className="flex items-center bg-[var(--background-tertiary)] rounded-[var(--border-radius)] p-1">
                <Tooltip text="Surprise Me!">
                  <motion.button whileHover={{ scale: 1.1, rotate: 5 }} whileTap={{ scale: 0.9 }} onClick={surpriseMe} className="p-2 text-[var(--text-secondary)] hover:text-[var(--primary-accent)] transition-colors" aria-label="Select a random product"><SparklesIcon className="w-5 h-5" /></motion.button>
                </Tooltip>
                <Tooltip text="Command Palette (Ctrl+K)">
                  <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => setCommandPaletteOpen(true)} className="p-2 text-[var(--text-secondary)] hover:text-[var(--primary-accent)] transition-colors" aria-label="Open command palette"><CommandIcon className="w-5 h-5" /></motion.button>
                </Tooltip>
                 <Tooltip text={`Shopping Cart (${cartItemCount} items)`}>
                   <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => setCartModalOpen(true)} className="relative p-2 text-[var(--text-secondary)] hover:text-[var(--primary-accent)] transition-colors" aria-label={`Open shopping cart`}>
                     <CartIcon className="w-5 h-5" />
                     {cartItemCount > 0 && (<span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[var(--primary-accent)] text-white text-[10px] font-bold ring-2 ring-[var(--background-primary)]">{cartItemCount}</span>)}
                   </motion.button>
                 </Tooltip>
                 <Tooltip text="Manage Products">
                   <motion.button whileHover={{ scale: 1.1, rotate: -5 }} whileTap={{ scale: 0.9 }} onClick={() => setManageModalOpen(true)} className="p-2 text-[var(--text-secondary)] hover:text-[var(--primary-accent)] transition-colors" aria-label="Manage Products"><ManageIcon className="w-5 h-5" /></motion.button>
                 </Tooltip>
              </div>
            </div>
          </div>
        </header>
        <main className="container mx-auto px-4 py-8">
           <AnimatePresence mode="wait">
              <motion.div
                key={viewMode}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                {renderView()}
              </motion.div>
            </AnimatePresence>
        </main>
        <footer className="text-center py-6 text-[var(--text-secondary)] text-sm">
          <p>Built with React, TypeScript, and Framer Motion. Themed for your delight.</p>
        </footer>
      </div>

      <ToastContainer toasts={toasts} removeToast={removeToast}/>
      
      <ProductManagementModal isOpen={isManageModalOpen} onClose={() => setManageModalOpen(false)} products={PRODUCTS} onUpdateImage={handleUpdateProductImage} onUpdateDescription={handleUpdateProductDescription} />
      <ProductDetailModal isOpen={selectedProduct !== null} product={selectedProduct} onClose={handleCloseDetailModal} onAddToCart={handleAddToCart} />
      <CartModal isOpen={isCartModalOpen} onClose={() => setCartModalOpen(false)} cartItems={cart} onUpdateQuantity={handleUpdateCartQuantity} onRemoveItem={handleRemoveFromCart} onClearCart={handleClearCart} onCheckout={handleCheckout} />
      <PurchaseModal isOpen={isPurchaseModalOpen} cart={cart} onClose={() => setPurchaseModalOpen(false)} onPurchaseSuccess={handlePurchaseSuccess} />
      <CommandPalette isOpen={isCommandPaletteOpen} onClose={() => setCommandPaletteOpen(false)} setView={handleSetView} setTheme={setActiveTheme} />
      <ScrollToTopButton isVisible={showScrollToTop} />
    </div>
  );
};

export default App;