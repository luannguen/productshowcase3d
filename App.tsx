import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Product, ViewMode, Theme, CartItem, ToastMessage } from './types';
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
import { ManageIcon, CartIcon } from './components/icons';
import LoadingSkeleton from './components/LoadingSkeleton';
import SearchBar from './components/SearchBar';
import FilterPopover from './components/FilterPopover';
import ProductDetailModal from './components/ProductDetailModal';
import CartModal from './components/CartModal';
import ToastContainer from './components/Toast';


const App: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.Flip);
  const [appThemes, setAppThemes] = useState(themes);
  const [activeTheme, setActiveTheme] = useState<Theme>(Theme.Electronics);
  const [isManageModalOpen, setManageModalOpen] = useState(false);
  
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isPurchaseModalOpen, setPurchaseModalOpen] = useState(false);
  
  const [isLoadingView, setIsLoadingView] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartModalOpen, setCartModalOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const currentThemeData = appThemes[activeTheme];
  const PRODUCTS = currentThemeData.products;

  const maxPrice = useMemo(() => 
    Math.ceil(Math.max(...PRODUCTS.map(p => p.price), 0) / 100) * 100
  , [PRODUCTS]);
  
  const [priceRange, setPriceRange] = useState({ min: 0, max: maxPrice });

  useEffect(() => {
    setPriceRange({ min: 0, max: maxPrice });
    setSearchQuery('');
  }, [activeTheme, maxPrice]);

  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter(product => {
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch =
        product.name.toLowerCase().includes(searchLower) ||
        product.description.toLowerCase().includes(searchLower);
      
      const matchesPrice =
        product.price >= priceRange.min && product.price <= priceRange.max;
        
      return matchesSearch && matchesPrice;
    });
  }, [PRODUCTS, searchQuery, priceRange]);
  
  const handleSetView = (newView: ViewMode) => {
    if (newView !== viewMode) {
      setIsLoadingView(true);
      setViewMode(newView);
      setTimeout(() => setIsLoadingView(false), 500);
    }
  };
  
  const addToast = (message: string) => {
    const newToast: ToastMessage = {
        id: Date.now(),
        message,
    };
    setToasts(prevToasts => [...prevToasts, newToast]);
    setTimeout(() => {
        setToasts(prevToasts => prevToasts.filter(toast => toast.id !== newToast.id));
    }, 3000);
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
  
  const handleClearCart = () => {
    setCart([]);
  };
  
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
            [activeTheme]: {
                ...currentThemes[activeTheme],
                products: updatedProducts
            }
        };
    });
  };

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
  };
  
  const handleCloseDetailModal = () => {
    setSelectedProduct(null);
  };
  
  const cartItemCount = useMemo(() => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  }, [cart]);
  
  const isModalOpen = isManageModalOpen || isPurchaseModalOpen || selectedProduct !== null || isCartModalOpen;
  
  useEffect(() => {
    const body = document.body;
    if (isModalOpen) {
      body.style.overflow = 'hidden';
    } else {
      body.style.overflow = 'auto';
    }
  }, [isModalOpen]);


  const renderView = () => {
    if (isLoadingView) {
      return <LoadingSkeleton viewMode={viewMode} />;
    }
    if (filteredProducts.length === 0) {
        return (
          <div className="text-center py-20 bg-[var(--background-secondary)] rounded-[var(--border-radius)]">
            <h2 className="text-2xl font-bold text-[var(--text-primary)]">No Products Found</h2>
            <p className="mt-2 text-[var(--text-secondary)]">Try adjusting your search or filter criteria.</p>
          </div>
        );
    }
    switch (viewMode) {
      case ViewMode.Grid:
        return <GridView products={filteredProducts} onProductClick={handleProductClick} onAddToCart={handleAddToCart} />;
      case ViewMode.List:
        return <ListView products={filteredProducts} onProductClick={handleProductClick} onAddToCart={handleAddToCart} />;
      case ViewMode.Table:
        return <TableView products={filteredProducts} onProductClick={handleProductClick} />;
      case ViewMode.Flip:
        return <FlipView products={filteredProducts} onProductClick={handleProductClick} onAddToCart={handleAddToCart} />;
      case ViewMode.Carousel:
        return <CarouselView products={filteredProducts} onProductClick={handleProductClick} onAddToCart={handleAddToCart} />;
      case ViewMode.ThreeD:
        return <ThreeDView />;
      case ViewMode.Story:
        return <StoryView products={filteredProducts.filter(p => p.story)} onAddToCart={handleAddToCart} />;
      default:
        return <GridView products={filteredProducts} onProductClick={handleProductClick} onAddToCart={handleAddToCart} />;
    }
  };

  return (
    <div 
        style={currentThemeData.styles}
        className={`min-h-screen bg-[var(--background-primary)] text-[var(--text-primary)] font-sans transition-colors duration-500`}
    >
      <div className={`${isModalOpen ? 'modal-open-blur' : ''}`}>
        <header className="glass-header sticky top-0 z-20 shadow-lg border-b border-white/10">
          <div className="container mx-auto px-4 py-4 flex flex-wrap justify-between items-center gap-4">
            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[var(--header-gradient-from)] to-[var(--header-gradient-to)] order-1">
              Product Showcase
            </h1>
            
            <div className="flex-grow flex items-center justify-center gap-4 order-3 lg:order-2 w-full lg:w-auto">
                <SearchBar value={searchQuery} onChange={setSearchQuery} />
                <FilterPopover 
                    priceRange={priceRange}
                    setPriceRange={setPriceRange}
                    maxPrice={maxPrice}
                />
            </div>

            <div className="flex items-center gap-2 sm:gap-4 order-2 lg:order-3">
              <ThemeSwitcher currentTheme={activeTheme} setTheme={setActiveTheme} />
              <ViewSwitcher currentView={viewMode} setView={handleSetView} />
               <button
                onClick={() => setCartModalOpen(true)}
                className="relative p-2 rounded-[var(--border-radius)] bg-[var(--background-tertiary)] text-[var(--text-secondary)] hover:bg-[var(--primary-accent)] hover:text-white transition-all duration-300"
                aria-label={`Open shopping cart with ${cartItemCount} items`}
              >
                <CartIcon className="w-5 h-5" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-[var(--primary-accent)] text-white text-xs font-bold ring-2 ring-[var(--background-primary)]">
                    {cartItemCount}
                  </span>
                )}
              </button>
              <button
                onClick={() => setManageModalOpen(true)}
                className="p-2 rounded-[var(--border-radius)] bg-[var(--background-tertiary)] text-[var(--text-secondary)] hover:bg-[var(--primary-accent)] hover:text-white transition-all duration-300"
                aria-label="Manage Products"
              >
                <ManageIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
        </header>
        <main className="container mx-auto px-4 py-8">
          <div className="transition-opacity duration-500 ease-in-out">
            {renderView()}
          </div>
        </main>
        <footer className="text-center py-6 text-[var(--text-secondary)] text-sm">
          <p>Built with React, TypeScript, and Tailwind CSS. Themed for your delight.</p>
        </footer>
      </div>

      <ToastContainer toasts={toasts} />
      
      <ProductManagementModal 
        isOpen={isManageModalOpen}
        onClose={() => setManageModalOpen(false)}
        products={PRODUCTS}
        onUpdateImage={handleUpdateProductImage}
      />
      
      <ProductDetailModal
        isOpen={selectedProduct !== null}
        product={selectedProduct}
        onClose={handleCloseDetailModal}
        onAddToCart={handleAddToCart}
      />
      
      <CartModal
        isOpen={isCartModalOpen}
        onClose={() => setCartModalOpen(false)}
        cartItems={cart}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveFromCart}
        onClearCart={handleClearCart}
        onCheckout={handleCheckout}
      />

       <PurchaseModal
        isOpen={isPurchaseModalOpen}
        cart={cart}
        onClose={() => setPurchaseModalOpen(false)}
        onPurchaseSuccess={handlePurchaseSuccess}
      />
    </div>
  );
};

export default App;