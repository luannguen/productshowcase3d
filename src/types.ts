import React from 'react';

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
    content?: string[];
    tableOfContents?: { title: string; page: number }[];
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
    ReadBook = 'Read Book',
}

export enum Theme {
    Youthful = 'Youthful',
    Electronics = 'Electronics',
    Fashion = 'Fashion',
    Book = 'Book',
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

// Types for BookView enhancements
export interface Highlight {
    page: number;
    text: string;
    id: string;
}

export interface UserBookData {
    [productId: number]: {
        currentPage?: number;
        bookmarks?: number[];
        highlights?: Highlight[];
        timeSpent?: number;
    };
}

// Types for User Profile and Bookshelf
export interface PurchasedItem extends Product {
    purchaseDate: number;
}

// New types for Co-Authoring
export interface MediaBlock {
    id: string;
    type: 'image' | 'video' | 'audio';
    src: string; // URL or base64 data
    caption?: string;
}

export interface TextBlock {
    id: string;
    type: 'text';
    content: string; // Can be HTML string for formatting
}

export type PageBlock = TextBlock | MediaBlock;

export interface PageContent {
    blocks: PageBlock[];
}

export interface UserEdition {
    id: string;
    baseProductId: number;
    name: string; // The user can rename their edition
    coverImageUrl: string;
    baseProduct: Product; // Store the original product for reference
    content: PageContent[]; // The editable content
    status: 'draft' | 'published';
    publishedAt?: number;
}

// Theme Types
export interface ThemeStyles {
    light: React.CSSProperties & { [key: string]: any };
    dark: React.CSSProperties & { [key: string]: any };
    'high-contrast': React.CSSProperties & { [key: string]: any };
}

export interface AppTheme {
    products: Product[];
    styles: ThemeStyles;
}
