import React, { lazy, Suspense, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useProductContext } from '../../contexts/ProductContext';
import { useCartContext } from '../../contexts/CartContext';
import { useWishlistContext } from '../../contexts/WishlistContext';
import { useModalContext } from '../../contexts/ModalContext';
import { useAppContext } from '../../contexts/AppContext';
import { SearchIcon } from '../icons';
import FilterSidebar from '../FilterSidebar';
import RecentlyViewed from '../RecentlyViewed';
import LoadingSkeleton from '../LoadingSkeleton';
import Breadcrumbs from '../Breadcrumbs';
// FIX: Import ViewMode to be used in the switch statement.
import { BreadcrumbItem, CompareItem, ViewMode } from '../../types';
import CompareTray from '../CompareTray';
import { MessageSquareIcon } from '../icons';

const GridView = lazy(() => import('../GridView'));
const ListView = lazy(() => import('../ListView'));
const TableView = lazy(() => import('../TableView'));
const FlipView = lazy(() => import('../FlipView'));
const CarouselView = lazy(() => import('../CarouselView'));
const ThreeDView = lazy(() => import('../ThreeDView'));
const StoryView = lazy(() => import('../StoryView'));

const MainLayout: React.FC = () => {
    const { t, viewMode, reduceMotion, currentThemeStyles } = useAppContext();
    const { 
        paginatedProducts, filteredProducts, canLoadMore, loadMore, 
        debouncedSearchQuery, searchQuery, setSearchQuery, priceRange, maxPrice, selectedCategories, selectedColors,
        recentlyViewed, addToRecentlyViewed,
        allAvailableCategories,
        allAvailableColors,
        ...filterProps 
    } = useProductContext();
    const { addToCart } = useCartContext();
    const { toggleWishlist, isProductInWishlist } = useWishlistContext();
    const { openModal, modal } = useModalContext();

    const [compareItems, setCompareItems] = React.useState<CompareItem[]>([]);
    const toggleCompare = (product: any) => {
        setCompareItems(prev => prev.find(p => p.id === product.id) ? prev.filter(p => p.id !== product.id) : (prev.length < 4 ? [...prev, product] : prev));
    };
    const isProductInCompare = (id: number) => compareItems.some(p => p.id === id);

    const handleProductClick = (product: any) => {
        addToRecentlyViewed(product);
        openModal('productDetail', { product });
    };

    const handleQuickView = (product: any) => {
        openModal('quickView', { product });
    };

    const selectedProduct = modal.type === 'productDetail' ? modal.props.product : null;
    
    const breadcrumbs = useMemo<BreadcrumbItem[]>(() => {
        const crumbs: BreadcrumbItem[] = [{ label: 'Home', onClick: () => { filterProps.resetFilters(); } }];
        if(selectedProduct) {
          crumbs.push({ label: selectedProduct.category, onClick: () => { openModal(null); filterProps.setSelectedCategories([selectedProduct.category]); } });
          crumbs.push({ label: selectedProduct.name });
        } else if(selectedCategories.length === 1) {
          crumbs.push({ label: selectedCategories[0] });
        }
        return crumbs;
      }, [selectedProduct, selectedCategories, filterProps]);


    const renderView = () => {
        if (paginatedProducts.length === 0 && (debouncedSearchQuery || selectedCategories.length > 0 || selectedColors.length > 0 || priceRange.min > 0 || priceRange.max < maxPrice)) {
            return (
                <div className="text-center py-20 bg-[var(--background-secondary)] rounded-[var(--border-radius)] flex flex-col items-center">
                    <div className="w-24 h-24 flex items-center justify-center rounded-full bg-[var(--background-tertiary)] mb-6"><SearchIcon className="w-12 h-12 text-[var(--primary-accent)]" /></div>
                    <h2 className="text-2xl font-bold text-[var(--text-primary)]">{t('noProductsFound')}</h2>
                    <p className="mt-2 text-[var(--text-secondary)]">{t('noProductsFoundDesc')}</p>
                </div>
            );
        }

        const baseProps = { onProductClick: handleProductClick, onAddToCart: addToCart, onQuickView: handleQuickView, onToggleWishlist: toggleWishlist, isProductInWishlist, onToggleCompare: toggleCompare, isProductInCompare };
        const viewProps = { ...baseProps, products: paginatedProducts, reduceMotion };
        
        switch (viewMode) {
            case ViewMode.Grid: return <GridView {...viewProps} searchQuery={debouncedSearchQuery} />;
            case ViewMode.List: return <ListView {...viewProps} searchQuery={debouncedSearchQuery} />;
            case ViewMode.Table: return <TableView products={paginatedProducts} onProductClick={handleProductClick} />;
            case ViewMode.Flip: return <FlipView {...viewProps} />;
            case ViewMode.Carousel: return <CarouselView {...viewProps} onAddToCart={(p) => addToCart(p, 1)} />;
            case ViewMode.ThreeD: return <ThreeDView themeStyles={currentThemeStyles} />;
            case ViewMode.Story: return <StoryView {...baseProps} onAddToCart={(p) => addToCart(p, 1)} products={paginatedProducts.filter(p => p.story)} reduceMotion={reduceMotion} />;
            default: return <GridView {...viewProps} searchQuery={debouncedSearchQuery} />;
        }
    };

    return (
        <>
            <main className="container mx-auto px-4 py-8">
                <Breadcrumbs items={breadcrumbs} />
                <div className="lg:grid lg:grid-cols-4 lg:gap-8">
                    <FilterSidebar
                        {...filterProps}
                        searchQuery={searchQuery}
                        setSearchQuery={setSearchQuery}
                        priceRange={priceRange}
                        maxPrice={maxPrice}
                        // FIX: Pass allAvailableCategories and allAvailableColors to satisfy FilterSidebarProps.
                        categories={allAvailableCategories}
                        selectedCategories={selectedCategories}
                        colors={allAvailableColors}
                        selectedColors={selectedColors}
                        className="hidden lg:block"
                        id="filter-sidebar"
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
                        {canLoadMore && (
                            <div className="mt-8 text-center">
                                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={loadMore} className="px-6 py-3 bg-[var(--primary-accent)] text-white font-bold rounded-[var(--border-radius)] hover:bg-[var(--primary-accent-hover)] transition-colors">
                                    {t('loadMore')}
                                </motion.button>
                            </div>
                        )}
                    </div>
                </div>
                <RecentlyViewed products={recentlyViewed} onProductClick={handleProductClick} />
            </main>
            <CompareTray items={compareItems} onRemove={toggleCompare} onCompare={() => openModal('compare', { items: compareItems })} onClear={() => setCompareItems([])} />
            <button onClick={() => openModal('aiAssistant')} className="ai-assistant-button fixed bottom-6 right-6 lg:bottom-10 lg:right-10 z-30 p-4 bg-[var(--primary-accent)] text-white rounded-full shadow-lg hover:bg-[var(--primary-accent-hover)] transition-all transform hover:scale-110" aria-label="Open AI Assistant"><MessageSquareIcon className="w-8 h-8" /></button>
        </>
    );
};

export default MainLayout;