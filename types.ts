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

export type SortOption = 'default' | 'name-asc' | 'name-desc' | 'price-asc' | 'price-desc';

// New types for 20 enhancements
export type QuickViewProduct = Product | null;
export type WishlistItem = Product;
export type RecentlyViewedItem = Product;
export type ChatMessage = { 
  role: 'user' | 'model'; 
  parts: { text: string }[]; 
  id: string; 
};