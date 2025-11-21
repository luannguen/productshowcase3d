import { Notification } from '../types';

export const initialNotifications: Notification[] = [
    {
        id: 'welcome-1',
        type: 'general',
        title: 'Welcome to the Showcase!',
        message: 'Explore our new features like AI Stylist and Voice Navigation.',
        read: false,
        timestamp: Date.now() - 1000 * 60 * 5,
    },
    {
        id: 'promo-1',
        type: 'promo',
        title: 'Summer Sale!',
        message: 'Get 20% off on all Fashion items with code SALE20.',
        read: false,
        timestamp: Date.now() - 1000 * 60 * 60 * 2,
    }
];
