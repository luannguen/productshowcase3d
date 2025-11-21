export * from './types';
export * from './data/products';
export * from './theme/styles';

import { Translations, Notification } from './types';

export const translations: Translations = {
    en: {
        'showcaseTitle': 'Showcase',
        'searchPlaceholder': 'Search products...',
        'surpriseMeTooltip': 'Surprise Me!',
        'commandPaletteTooltip': 'Command Palette (Ctrl+K)',
        'manageProductsTooltip': 'Manage Products',
        'wishlistTooltip': 'Wishlist ({count})',
        'cartTooltip': 'Cart ({count})',
        'settingsTooltip': 'Settings',
        'notificationsTooltip': 'Notifications',
        'loadMore': 'Load More',
        'noProductsFound': 'No Products Found',
        'noProductsFoundDesc': 'Try adjusting your search or filter criteria.',
        'recentlyViewed': 'Recently Viewed',
        'footerSlogan': 'The ultimate product viewing experience.',
        'quickLinks': 'Quick Links',
        'aboutUs': 'About Us',
        'contact': 'Contact',
        'faq': 'FAQ',
        'followUs': 'Follow Us',
        'followUsDesc': 'Join our community on social media.',
        'copyright': '© {year} Showcase. All rights reserved.',
    },
    vi: {
        'showcaseTitle': 'Trưng bày',
        'searchPlaceholder': 'Tìm kiếm sản phẩm...',
        'surpriseMeTooltip': 'Gây bất ngờ cho tôi!',
        'commandPaletteTooltip': 'Bảng lệnh (Ctrl+K)',
        'manageProductsTooltip': 'Quản lý Sản phẩm',
        'wishlistTooltip': 'Danh sách Yêu thích ({count})',
        'cartTooltip': 'Giỏ hàng ({count})',
        'settingsTooltip': 'Cài đặt',
        'notificationsTooltip': 'Thông báo',
        'loadMore': 'Tải thêm',
        'noProductsFound': 'Không tìm thấy sản phẩm',
        'noProductsFoundDesc': 'Hãy thử điều chỉnh tiêu chí tìm kiếm hoặc bộ lọc của bạn.',
        'recentlyViewed': 'Đã xem gần đây',
        'footerSlogan': 'Trải nghiệm xem sản phẩm đỉnh cao.',
        'quickLinks': 'Liên kết nhanh',
        'aboutUs': 'Về chúng tôi',
        'contact': 'Liên hệ',
        'faq': 'Câu hỏi thường gặp',
        'followUs': 'Theo dõi chúng tôi',
        'followUsDesc': 'Tham gia cộng đồng của chúng tôi trên mạng xã hội.',
        'copyright': '© {year} Showcase. Mọi quyền được bảo lưu.',
    }
};

export const initialNotifications: Notification[] = [
    {
        id: 'welcome-1',
        type: 'general',
        title: 'Welcome to the Showcase!',
        message: 'Explore our new features like AI Stylist and Voice Navigation.',
        read: false,
        timestamp: Date.now() - 1000 * 60 * 5, // 5 minutes ago
    },
    {
        id: 'promo-1',
        type: 'promo',
        title: 'Summer Sale!',
        message: 'Get 20% off on all Fashion items with code SALE20.',
        read: false,
        timestamp: Date.now() - 1000 * 60 * 60 * 2, // 2 hours ago
    }
];
