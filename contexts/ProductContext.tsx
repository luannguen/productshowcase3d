import React, { createContext, useContext, useState, useMemo, useEffect, useCallback } from 'react';
import { Product, ViewMode, SortOption, RecentlyViewedItem, CompareItem, Theme } from '../types';
import { themes } from '../constants';
import useLocalStorage from '../hooks/useLocalStorage';
import { useAppContext } from './AppContext';
import { useTranslation } from '../hooks/useTranslation';

interface ProductContextType {
  products: Product[];
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  debouncedSearchQuery: string;
  selectedCategories: string[];
  setSelectedCategories: (cats: string[]) => void;
  selectedColors: string[];
  setSelectedColors: (colors: string[]) => void;
  sortOption: SortOption;
  setSortOption: (opt: SortOption) => void;
  priceRange: { min: number; max: number };
  setPriceRange: (range: { min: number; max: number }) => void;
  maxPrice: number;
  filteredProducts: Product[];
  paginatedProducts: Product[];
  trendingProducts: Product[];
  visibleProductsCount: number;
  loadMore: () => void;
  resetFilters: () => void;
  recentlyViewed: RecentlyViewedItem[];
  addToRecentlyViewed: (product: Product) => void;
  compareItems: CompareItem[];
  toggleCompare: (product: Product) => void;
  clearCompare: () => void;
  allAvailableCategories: string[];
  allAvailableColors: string[];
  ITEMS_PER_PAGE: number;
  activeTheme: Theme;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

// Debounce Hook (Internal use)
const useDebounce = (value: string, delay: number) => {
    const [debouncedValue, setDebouncedValue] = useState(value);
    useEffect(() => {
        const handler = setTimeout(() => { setDebouncedValue(value); }, delay);
        return () => { clearTimeout(handler); };
    }, [value, delay]);
    return debouncedValue;
};

export const ProductContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { activeTheme, addToast } = useAppContext();
  const { t } = useTranslation();
  const ITEMS_PER_PAGE = 8;

  // View Mode State
  type ViewModeSettings = { [key in Theme]?: ViewMode };
  const [viewModes, setViewModes] = useLocalStorage<ViewModeSettings>('viewModes', {});
  const viewMode = useMemo(() => viewModes[activeTheme] || ViewMode.Grid, [viewModes, activeTheme]);
  const setViewMode = (newView: ViewMode) => setViewModes(prev => ({ ...prev, [activeTheme]: newView }));

  // Product Data
  const products = useMemo(() => themes[activeTheme].products, [activeTheme]);
  
  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [sortOption, setSortOption] = useState<SortOption>('default');
  const maxPrice = useMemo(() => Math.ceil(Math.max(...products.map(p => p.price), 0) / 100) * 100, [products]);
  const [priceRange, setPriceRange] = useState({ min: 0, max: maxPrice });
  const [visibleProductsCount, setVisibleProductsCount] = useState(ITEMS_PER_PAGE);

  // Interactive States
  const [recentlyViewed, setRecentlyViewed] = useLocalStorage<RecentlyViewedItem[]>('recentlyViewed', []);
  const [compareItems, setCompareItems] = useLocalStorage<CompareItem[]>('compareItems', []);

  // Reset Filters on Theme Change
  const resetFilters = useCallback(() => {
    setPriceRange({ min: 0, max: maxPrice });
    setSelectedCategories([]);
    setSelectedColors([]);
    setSortOption('default');
    setSearchQuery('');
    setVisibleProductsCount(ITEMS_PER_PAGE);
  }, [maxPrice]);

  useEffect(() => {
    resetFilters();
  }, [activeTheme, resetFilters]);

  // Filtering Logic
  const filteredProducts = useMemo(() => {
    let processed = [...products].filter(p => {
      const searchLower = debouncedSearchQuery.toLowerCase();
      return (p.name.toLowerCase().includes(searchLower) || p.description.toLowerCase().includes(searchLower)) &&
             (p.price >= priceRange.min && p.price <= priceRange.max) &&
             (selectedCategories.length === 0 || selectedCategories.includes(p.category)) &&
             (selectedColors.length === 0 || p.colors?.some(c => selectedColors.includes(c)));
    });

    switch (sortOption) {
      case 'name-asc': processed.sort((a, b) => a.name.localeCompare(a.name)); break;
      case 'name-desc': processed.sort((a, b) => b.name.localeCompare(a.name)); break;
      case 'price-asc': processed.sort((a, b) => a.price - b.price); break;
      case 'price-desc': processed.sort((a, b) => b.price - a.price); break;
      case 'rating-desc': processed.sort((a, b) => (b.reviews?.reduce((acc, r) => acc + r.rating, 0) / (b.reviews?.length || 1) || 0) - (a.reviews?.reduce((acc, r) => acc + r.rating, 0) / (a.reviews?.length || 1) || 0)); break;
      case 'newest-desc': processed.reverse(); break;
    }
    return processed;
  }, [products, debouncedSearchQuery, priceRange, selectedCategories, selectedColors, sortOption]);

  const paginatedProducts = useMemo(() => filteredProducts.slice(0, visibleProductsCount), [filteredProducts, visibleProductsCount]);
  const trendingProducts = useMemo(() => products.filter(p => p.tags?.includes('Best Seller')), [products]);
  const allAvailableCategories = useMemo(() => [...new Set(products.map(p => p.category))].sort(), [products]);
  const allAvailableColors = useMemo(() => [...new Set(products.flatMap(p => p.colors || []))].sort(), [products]);

  const loadMore = () => setVisibleProductsCount(c => c + ITEMS_PER_PAGE);
  
  const addToRecentlyViewed = (product: Product) => {
    setRecentlyViewed(prev => [product, ...prev.filter(p => p.id !== product.id)].slice(0, 10));
  };

  const toggleCompare = (product: Product) => {
    setCompareItems(prev => {
        const exists = prev.find(p => p.id === product.id);
        if (exists) return prev.filter(p => p.id !== product.id);
        if (prev.length >= 4) {
            addToast("You can compare up to 4 items.");
            return prev;
        }
        return [...prev, product];
    });
  };

  const clearCompare = () => setCompareItems([]);

  return (
    <ProductContext.Provider value={{
      products, viewMode, setViewMode,
      searchQuery, setSearchQuery, debouncedSearchQuery,
      selectedCategories, setSelectedCategories,
      selectedColors, setSelectedColors,
      sortOption, setSortOption,
      priceRange, setPriceRange, maxPrice,
      filteredProducts, paginatedProducts, trendingProducts,
      visibleProductsCount, loadMore, resetFilters,
      recentlyViewed, addToRecentlyViewed,
      compareItems, toggleCompare, clearCompare,
      allAvailableCategories, allAvailableColors, ITEMS_PER_PAGE,
      activeTheme
    }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProductContext = () => {
  const context = useContext(ProductContext);
  if (context === undefined) throw new Error('useProductContext must be used within a ProductContextProvider');
  return context;
};
