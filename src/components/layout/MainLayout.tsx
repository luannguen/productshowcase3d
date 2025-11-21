import React, { Suspense, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppContext } from '../../contexts/AppContext';
import { useProductContext } from '../../contexts/ProductContext';
import { useCartContext } from '../../contexts/CartContext';
import { useWishlistContext } from '../../contexts/WishlistContext';
import { useUserContext } from '../../contexts/UserContext';
import { useModalContext } from '../../contexts/ModalContext';
import { ViewMode, Product, BreadcrumbItem } from '../../types';

import Header from './Header';
import Footer from './Footer';
import FilterSidebar from '../features/FilterSidebar';
import RecentlyViewed from '../features/RecentlyViewed';
import TrendingProducts from '../features/TrendingProducts';
import Breadcrumbs from '../ui/Breadcrumbs';
import CustomCursor from '../ui/CustomCursor';
import ScrollToTopButton from '../ui/ScrollToTopButton';
import MiniMapScroll from '../ui/MiniMapScroll';
import CompareTray from '../features/CompareTray';
import LoadingSkeleton from '../ui/LoadingSkeleton';
import AccessibilityAnnouncer from '../ui/AccessibilityAnnouncer';
import ToastContainer from '../ui/Toast';
import { MessageSquareIcon, SearchIcon, MinimizeIcon } from '../ui/icons';

// Lazy load views
const GridView = React.lazy(() => import('../views/GridView'));
const ListView = React.lazy(() => import('../views/ListView'));
const TableView = React.lazy(() => import('../views/TableView'));
const FlipView = React.lazy(() => import('../views/FlipView'));
const CarouselView = React.lazy(() => import('../views/CarouselView'));
const ThreeDView = React.lazy(() => import('../views/ThreeDView'));
const StoryView = React.lazy(() => import('../views/StoryView'));
const ForYouView = React.lazy(() => import('../views/ForYouView'));

const MainLayout: React.FC = () => {
    const { reduceMotion, toasts, addToast, removeToast, isZenMode, setZenMode } = useAppContext();
    const { 
        viewMode, setViewMode, products, filteredProducts, paginatedProducts, trendingProducts, 
        searchQuery, setSearchQuery, selectedCategories, setSelectedCategories,
        visibleProductsCount, loadMore, resetFilters, recentlyViewed, addToRecentlyViewed,
        compareItems, toggleCompare, clearCompare,
        priceRange, setPriceRange, maxPrice, allAvailableCategories, allAvailableColors,
        selectedColors, setSelectedColors, sortOption, setSortOption, activeTheme
    } = useProductContext();
    const { addToCart, flyingImage, cartIconRef, cart } = useCartContext();
    const { toggleWishlist, isInWishlist, wishlist } = useWishlistContext();
    const { openModal } = useModalContext();
    const { isProfileVisible, createEdition, setProfileVisible } = useUserContext();

    // Derived State for Breadcrumbs
    const breadcrumbs = React.useMemo(() => {
        const crumbs: BreadcrumbItem[] = [{ label: 'Home', onClick: () => { resetFilters(); } }];
        if(selectedCategories.length === 1) {
          crumbs.push({ label: selectedCategories[0] });
        }
        return crumbs;
    }, [selectedCategories, resetFilters]);

    // Handlers
    const handleProductClick = (product: Product) => {
        addToRecentlyViewed(product);
        openModal('PRODUCT_DETAIL', { product });
    };

    const handleReadBook = (product: Product) => {
        setProfileVisible(false);
        openModal('BOOK_READER', { product });
    };

    const handleQuickView = (product: Product) => openModal('QUICK_VIEW', { product });
    const handleAddToCollection = () => openModal('WISHLIST'); // Or a dedicated collection modal
    const handleNotifyMe = (product: Product) => addToast(`You'll be notified when ${product.name} is available.`);

    // View Rendering Logic
    const renderView = () => {
        if (paginatedProducts.length === 0 && (searchQuery || selectedCategories.length > 0)) {
          return (
            <div className="text-center py-20 bg-[var(--background-secondary)] rounded-[var(--border-radius)] flex flex-col items-center">
              <div className="w-24 h-24 flex items-center justify-center rounded-full bg-[var(--background-tertiary)] mb-6">
                <SearchIcon className="w-12 h-12 text-[var(--primary-accent)]" />
              </div>
              <h2 className="text-2xl font-bold text-[var(--text-primary)]">No Products Found</h2>
              <p className="mt-2 text-[var(--text-secondary)]">Try adjusting your search or filter criteria.</p>
            </div>
          );
        }

        const baseProps = { 
            products: paginatedProducts,
            onProductClick: handleProductClick, 
            onAddToCart: addToCart, 
            onQuickView: handleQuickView, 
            onToggleWishlist: toggleWishlist, 
            isProductInWishlist: isInWishlist, 
            onToggleCompare: toggleCompare, 
            isProductInCompare: (id: number) => compareItems.some(p => p.id === id), 
            onAddToCollection: handleAddToCollection, 
            onNotifyMe: handleNotifyMe, 
            reduceMotion, 
            onReadBook: handleReadBook,
            searchQuery
        };

        switch (viewMode) {
            case ViewMode.Grid: return <GridView {...baseProps} />;
            case ViewMode.List: return <ListView {...baseProps} />;
            case ViewMode.Table: return <TableView products={paginatedProducts} onProductClick={handleProductClick} />;
            case ViewMode.Flip: return <FlipView {...baseProps} />;
            case ViewMode.Carousel: return <CarouselView products={paginatedProducts} onProductClick={handleProductClick} onAddToCart={addToCart} />;
            case ViewMode.ThreeD: return <ThreeDView themeStyles={{}} />; // Needs theme styles, but CSS vars handle it mostly
            case ViewMode.Story: return <StoryView {...baseProps} products={products.filter(p => p.story)} />;
            case ViewMode.ForYou: return <ForYouView {...baseProps} allProducts={products} cart={cart} wishlist={wishlist} recentlyViewed={recentlyViewed} />;
            case ViewMode.ReadBook: return <GridView {...baseProps} />;
            default: return <GridView {...baseProps} />;
        }
    };

    return (
        <>
            <CustomCursor />
            <AccessibilityAnnouncer message={searchQuery ? `Showing ${paginatedProducts.length} products` : ''} />
            
            <AnimatePresence>
                {isZenMode && (
                <motion.button
                    initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                    onClick={() => setZenMode(false)}
                    className="zen-mode-exit-btn p-2 bg-[var(--background-secondary)]/50 text-[var(--text-primary)] rounded-full shadow-lg hover:bg-[var(--primary-accent)] backdrop-blur-sm"
                >
                    <MinimizeIcon className="w-6 h-6" />
                </motion.button>
                )}
            </AnimatePresence>

            <div className={`main-content-wrapper ${isProfileVisible ? 'modal-open-blur' : ''}`}>
                <Header />
                <main className="container mx-auto px-4 py-8">
                    <Breadcrumbs items={breadcrumbs} />
                    {viewMode !== ViewMode.ForYou && <TrendingProducts products={trendingProducts} onProductClick={handleProductClick} />}
                    <div className="lg:grid lg:grid-cols-4 lg:gap-8">
                        <FilterSidebar
                            priceRange={priceRange} setPriceRange={setPriceRange} maxPrice={maxPrice}
                            categories={allAvailableCategories} selectedCategories={selectedCategories} setSelectedCategories={setSelectedCategories}
                            colors={allAvailableColors} selectedColors={selectedColors} setSelectedColors={setSelectedColors}
                            sortOption={sortOption} setSortOption={setSortOption} resetFilters={resetFilters}
                            searchQuery={searchQuery} setSearchQuery={setSearchQuery}
                            className="hidden lg:block" id="filter-sidebar"
                        />
                        <div className="lg:col-span-3">
                            <Suspense fallback={<LoadingSkeleton viewMode={viewMode} />}>
                                <AnimatePresence mode="wait">
                                    {!reduceMotion ? (
                                        <motion.div key={viewMode} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
                                            {renderView()}
                                        </motion.div>
                                    ) : renderView()}
                                </AnimatePresence>
                            </Suspense>
                            {visibleProductsCount < filteredProducts.length && (
                                <div className="mt-8 text-center">
                                    <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={loadMore} className="px-6 py-3 bg-[var(--primary-accent)] text-white font-bold rounded-[var(--border-radius)] hover:bg-[var(--primary-accent-hover)] transition-colors">
                                        Load More
                                    </motion.button>
                                </div>
                            )}
                        </div>
                    </div>
                </main>
                <RecentlyViewed products={recentlyViewed} onProductClick={handleProductClick} />
                <Footer />
            </div>

            {/* Overlays */}
            <AnimatePresence>
                {flyingImage && (
                    <motion.img
                    src={flyingImage.src}
                    className="flying-image"
                    initial={{ top: flyingImage.rect.top, left: flyingImage.rect.left, width: flyingImage.rect.width, height: flyingImage.rect.height }}
                    animate={{ top: cartIconRef.current?.getBoundingClientRect().top || 30, left: cartIconRef.current?.getBoundingClientRect().left || window.innerWidth - 50, width: 20, height: 20, opacity: 0, scale: 0.5 }}
                    transition={{ duration: 0.6, ease: 'easeInOut' }}
                    />
                )}
            </AnimatePresence>
            
            <ToastContainer toasts={toasts} removeToast={removeToast} />
            <CompareTray items={compareItems} onRemove={toggleCompare} onCompare={() => openModal('COMPARE')} onClear={clearCompare} />
            <ScrollToTopButton />
            <MiniMapScroll />
            
            <button onClick={() => openModal('AI_ASSISTANT')} className="ai-assistant-button fixed bottom-6 right-6 lg:bottom-10 lg:right-10 z-30 p-4 bg-[var(--primary-accent)] text-white rounded-full shadow-lg hover:bg-[var(--primary-accent-hover)] transition-all transform hover:scale-110" aria-label="Open AI Assistant">
                <MessageSquareIcon className="w-8 h-8" />
            </button>
        </>
    );
};

export default MainLayout;