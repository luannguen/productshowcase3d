import React, { createContext, useState, useContext, useEffect, useMemo, useCallback } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import { Product, SortOption, RecentlyViewedItem } from '../types';
import { useAppContext } from './AppContext';
import { themes } from '../constants';

const ITEMS_PER_PAGE = 8;
const useDebounce = (value: string, delay: number) => {
    const [debouncedValue, setDebouncedValue] = useState(value);
    useEffect(() => {
        const handler = setTimeout(() => { setDebouncedValue(value); }, delay);
        return () => { clearTimeout(handler); };
    }, [value, delay]);
    return debouncedValue;
};

interface ProductContextType {
    allProducts: Product[];
    filteredProducts: Product[];
    paginatedProducts: Product[];
    visibleProductsCount: number;
    canLoadMore: boolean;
    loadMore: () => void;
    
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    debouncedSearchQuery: string;
    priceRange: { min: number; max: number };
    setPriceRange: (range: { min: number; max: number }) => void;
    maxPrice: number;
    selectedCategories: string[];
    setSelectedCategories: (categories: string[]) => void;
    allAvailableCategories: string[];
    selectedColors: string[];
    setSelectedColors: (colors: string[]) => void;
    allAvailableColors: string[];
    sortOption: SortOption;
    setSortOption: (option: SortOption) => void;
    resetFilters: () => void;

    recentlyViewed: RecentlyViewedItem[];
    addToRecentlyViewed: (product: Product) => void;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { activeTheme } = useAppContext();
    const allProducts = useMemo(() => themes[activeTheme].products, [activeTheme]);

    const [searchQuery, setSearchQuery] = useState('');
    const [sortOption, setSortOption] = useState<SortOption>('default');
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [selectedColors, setSelectedColors] = useState<string[]>([]);
    const [visibleProductsCount, setVisibleProductsCount] = useState(ITEMS_PER_PAGE);
    
    const maxPrice = useMemo(() => Math.ceil(Math.max(...allProducts.map(p => p.price), 0) / 100) * 100, [allProducts]);
    const [priceRange, setPriceRange] = useState({ min: 0, max: maxPrice });

    const allAvailableCategories = useMemo(() => [...new Set(allProducts.map(p => p.category))].sort(), [allProducts]);
    const allAvailableColors = useMemo(() => [...new Set(allProducts.flatMap(p => p.colors || []))].sort(), [allProducts]);

    const debouncedSearchQuery = useDebounce(searchQuery, 300);

    const resetFilters = useCallback(() => {
        setSearchQuery('');
        setPriceRange({ min: 0, max: maxPrice });
        setSelectedCategories([]);
        setSelectedColors([]);
        setSortOption('default');
        setVisibleProductsCount(ITEMS_PER_PAGE);
    }, [maxPrice]);
    
    useEffect(() => {
        resetFilters();
    }, [activeTheme, resetFilters]);

    const filteredProducts = useMemo(() => {
        let processed = [...allProducts].filter(p => {
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
      }, [allProducts, debouncedSearchQuery, priceRange, selectedCategories, selectedColors, sortOption]);

    const paginatedProducts = useMemo(() => filteredProducts.slice(0, visibleProductsCount), [filteredProducts, visibleProductsCount]);
    const canLoadMore = visibleProductsCount < filteredProducts.length;
    const loadMore = () => setVisibleProductsCount(c => c + ITEMS_PER_PAGE);

    const [recentlyViewed, setRecentlyViewed] = useLocalStorage<RecentlyViewedItem[]>('recentlyViewed', []);
    const addToRecentlyViewed = (product: Product) => {
        setRecentlyViewed(prev => [product, ...prev.filter(p => p.id !== product.id)].slice(0, 10));
    };

    const value = {
        allProducts,
        filteredProducts,
        paginatedProducts,
        visibleProductsCount,
        canLoadMore,
        loadMore,
        searchQuery,
        setSearchQuery,
        debouncedSearchQuery,
        priceRange,
        setPriceRange,
        maxPrice,
        selectedCategories,
        setSelectedCategories,
        allAvailableCategories,
        selectedColors,
        setSelectedColors,
        allAvailableColors,
        sortOption,
        setSortOption,
        resetFilters,
        recentlyViewed,
        addToRecentlyViewed
    };

    return <ProductContext.Provider value={value}>{children}</ProductContext.Provider>;
};

export const useProductContext = () => {
    const context = useContext(ProductContext);
    if (context === undefined) {
        throw new Error('useProductContext must be used within a ProductProvider');
    }
    return context;
};