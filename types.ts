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
  stock: {
    level: 'in-stock' | 'low' | 'out-of-stock';
    quantity: number;
  };
  colors?: string[]; // hex codes
  priceHistory?: PriceDataPoint[];
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
  ForYou = 'For You',
}

export enum Theme {
    Youthful = 'Youthful',
    Electronics = 'Electronics',
    Fashion = 'Fashion',
}

export type SortOption = 'default' | 'name-asc' | 'name-desc' | 'price-asc' | 'price-desc' | 'rating-desc' | 'newest-desc';

export type QuickViewProduct = Product | null;
export type WishlistItem = Product;
export type RecentlyViewedItem = Product;
export type CompareItem = Product;
export type ChatMessage = { 
  role: 'user' | 'model'; 
  parts: { text: string }[]; 
  id: string; 
};

export enum Appearance {
    Light = 'light',
    Dark = 'dark',
    System = 'system',
    HighContrast = 'high-contrast',
}

export type Locale = 'en' | 'vi';

export type Translations = {
    [key in Locale]: {
        [key: string]: string;
    };
};

export interface OnboardingStep {
  element: string; // CSS selector
  title: string;
  content: string;
}

export interface BreadcrumbItem {
  label: string;
  onClick?: () => void;
}

// New types for 10 more features
export interface Notification {
  id: string;
  type: 'stock' | 'promo' | 'general';
  title: string;
  message: string;
  read: boolean;
  timestamp: number;
  productId?: number;
}

export interface Collection {
  id: string;
  name: string;
  productIds: number[];
}

export interface PriceDataPoint {
  date: string; // YYYY-MM-DD
  price: number;
}

export interface VoiceCommand {
  keyword: string[];
  action: (param?: string) => void;
}
