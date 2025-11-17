export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
  tags?: ('New' | 'Best Seller')[];
  videoUrl?: string;
  specifications?: Record<string, string>;
  reviews?: {
    id: number;
    author: string;
    rating: number;
    comment: string;
  }[];
  story?: {
    title: string;
    narrative: string;
    imageUrl: string;
    videoUrl?: string;
  };
  // New properties for advanced features
  stock: {
    level: 'in-stock' | 'low' | 'out-of-stock';
    quantity: number;
  };
  colors?: string[]; // hex codes
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface ToastMessage {
  id: number;
  message: string;
}

export enum ViewMode {
  Grid = 'Grid',
  List = 'List',
  Table = 'Table',
  Flip = '3D Flip',
  Carousel = '3D Carousel',
  ThreeD = '3D View',
  Story = 'Story',
}

export enum Theme {
    Youthful = 'Youthful',
    Electronics = 'Electronics',
    Fashion = 'Fashion',
}

export type SortOption = 'default' | 'name-asc' | 'name-desc' | 'price-asc' | 'price-desc' | 'rating-desc' | 'newest-desc';

// New types for enhancements
export type QuickViewProduct = Product | null;
export type WishlistItem = Product;
export type RecentlyViewedItem = Product;
export type CompareItem = Product;
export type ChatMessage = { 
  role: 'user' | 'model'; 
  parts: { text: string }[]; 
  id: string; 
};

// Dark Mode & i18n
export enum Appearance {
    Light = 'light',
    Dark = 'dark',
    System = 'system',
}

export type Locale = 'en' | 'vi';

export type Translations = {
    [key in Locale]: {
        [key: string]: string;
    };
};

// New types for 20 more features
export interface OnboardingStep {
  element: string; // CSS selector
  title: string;
  content: string;
}

export interface BreadcrumbItem {
  label: string;
  onClick?: () => void;
}