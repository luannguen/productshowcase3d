
// FIX: Add missing React import for React.CSSProperties
import React from 'react';
import { Product, Theme } from './types';

interface AppTheme {
  products: Product[];
  styles: React.CSSProperties;
}

const electronicsProducts: Product[] = [
  {
    id: 1,
    name: 'Quantum Laptop',
    description: 'A high-performance laptop with a sleek design, perfect for professionals and creatives. Features a 16-inch Retina display.',
    price: 1499.99,
    imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=800&auto=format&fit=crop',
    story: {
        title: "Unleash Your Ambition",
        narrative: "From the first spark of an idea to the final render, the Quantum Laptop is your silent partner. Engineered for the ambitious, its power flows as fast as your thoughts, turning complex code into seamless reality and wild dreams into stunning visuals. This isn't just a machine; it's the canvas for your next masterpiece.",
        imageUrl: "https://images.unsplash.com/photo-1550745165-9bc0b252726a?q=80&w=1200&auto=format&fit=crop"
    }
  },
  {
    id: 2,
    name: 'Nova Smartphone',
    description: 'The latest in mobile technology, with a stunning OLED screen and a powerful triple-camera system.',
    price: 999.0,
    imageUrl: 'https://images.unsplash.com/photo-1587560699343-6d15b28536a6?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 3,
    name: 'Aura Headphones',
    description: 'Immersive noise-cancelling headphones that deliver crystal-clear audio. 30-hour battery life.',
    price: 349.50,
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800&auto=format&fit=crop',
    story: {
        title: "Find Your Focus",
        narrative: "Silence the world and dive into pure sound. The Aura Headphones create a sanctuary for your senses, where every note is crisp and every beat is profound. Whether you're finding your rhythm in a bustling city or seeking tranquility, Aura is your escape to an immersive world of audio.",
        imageUrl: "https://images.unsplash.com/photo-1511303853424-3451876a337e?q=80&w=1200&auto=format&fit=crop"
    }
  },
  {
    id: 4,
    name: 'Ergo-Mouse Pro',
    description: 'Ergonomically designed for comfort and precision. Features customizable buttons and adjustable DPI.',
    price: 89.99,
    imageUrl: 'https://images.unsplash.com/photo-1629429408209-1f9122651d37?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 5,
    name: 'StreamCam HD',
    description: 'Full 1080p HD webcam with smart auto-focus and exposure for professional-quality streaming.',
    price: 169.0,
    imageUrl: 'https://images.unsplash.com/photo-1593106578502-28fa75da9d99?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 6,
    name: 'Mech-Keyboard X',
    description: 'A mechanical keyboard with customizable RGB backlighting and satisfying tactile feedback.',
    price: 199.99,
    imageUrl: 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 7,
    name: 'Smart Watch G2',
    description: 'Track your fitness, notifications, and more with this stylish and feature-packed smartwatch.',
    price: 249.0,
    imageUrl: 'https://images.unsplash.com/photo-1544117519-31a4b719223d?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 8,
    name: 'Titan Gaming PC',
    description: 'A powerhouse gaming desktop with the latest GPU and CPU for an unparalleled gaming experience.',
    price: 2999.0,
    imageUrl: 'https://images.unsplash.com/photo-1598986646512-9213b0ae9387?q=80&w=800&auto=format&fit=crop',
    story: {
        title: "Enter a New Reality",
        narrative: "Beyond the screen lies a universe of infinite possibilities. The Titan Gaming PC is your vessel, a marvel of engineering built to shatter boundaries and redefine immersion. Experience games not as a player, but as a hero living in a world of breathtaking detail and lightning-fast response.",
        imageUrl: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1200&auto=format&fit=crop"
    }
  },
];

const youthfulProducts: Product[] = [
    { 
        id: 9, 
        name: 'Vibe Sneakers', 
        description: 'Ultra-comfortable sneakers with a retro-futuristic design.', 
        price: 129.99, 
        imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ab?q=80&w=800&auto=format&fit=crop',
        story: {
            title: "Walk Your Own Path",
            narrative: "The city is your playground, every street a new adventure. The Vibe Sneakers are more than just footwear; they're a statement. Laced with the energy of the streets and designed for those who dare to be different, they carry you from spontaneous late-night hangouts to sun-drenched festival fields. Where will they take you next?",
            imageUrl: "https://images.unsplash.com/photo-1528701800487-ba01743862a9?q=80&w=1200&auto=format&fit=crop"
        }
    },
    { id: 10, name: 'Neon Beats Headphones', description: 'Wireless headphones with vibrant LED accents and deep bass.', price: 199.00, imageUrl: 'https://images.unsplash.com/photo-1545127398-14699f92334b?q=80&w=800&auto=format&fit=crop' },
    { id: 11, name: 'Pixel Art Display', description: 'A programmable LED display for your desk to show off your pixel art.', price: 249.50, imageUrl: 'https://images.unsplash.com/photo-1604502528143-7a6c533446b3?q=80&w=800&auto=format&fit=crop' },
    { 
        id: 12, 
        name: 'Kickflip Pro Skateboard', 
        description: 'A durable and stylish skateboard for all skill levels.', 
        price: 89.99, 
        imageUrl: 'https://images.unsplash.com/photo-1547466838-8d43d3a53c8c?q=80&w=800&auto=format&fit=crop',
        story: {
            title: "Define Your Ride",
            narrative: "Feel the grip, hear the roll, and own the pavement. The Kickflip Pro isn't just a board; it's an extension of you. Built for the park, the street, and everywhere in between, it’s your trusted companion for landing that trick you've been practicing for weeks. It’s freedom on four wheels.",
            imageUrl: "https://images.unsplash.com/photo-1559497843-55c3c06a374a?q=80&w=1200&auto=format&fit=crop"
        }
    },
    { id: 13, name: 'Creator Ring Light', description: 'Get perfect lighting for your streams and videos with this versatile ring light.', price: 79.00, imageUrl: 'https://images.unsplash.com/photo-1604335293424-73d756c12808?q=80&w=800&auto=format&fit=crop' },
    { id: 14, name: 'Graffiti Art Hoodie', description: 'A comfortable oversized hoodie featuring unique street art designs.', price: 69.99, imageUrl: 'https://images.unsplash.com/photo-1556819842-15a3a0e1a1b3?q=80&w=800&auto=format&fit=crop' },
    { id: 15, name: 'RGB Gaming Mouse', description: 'A high-precision gaming mouse with customizable RGB lighting.', price: 59.00, imageUrl: 'https://images.unsplash.com/photo-1600981335960-a2420938a16c?q=80&w=800&auto=format&fit=crop' },
    { id: 16, name: 'Synthwave Desk Mat', description: 'A large desk mat with a cool, retro synthwave design.', price: 39.00, imageUrl: 'https://images.unsplash.com/photo-1557682250-33bd709cbe85?q=80&w=800&auto=format&fit=crop' },
];

const fashionProducts: Product[] = [
    { 
        id: 17, 
        name: 'Chrono-Elegance Watch', 
        description: 'A timeless timepiece combining classic design with modern mechanics.', 
        price: 1250.00, 
        imageUrl: 'https://images.unsplash.com/photo-1612817159949-195b6eb9e31a?q=80&w=800&auto=format&fit=crop',
        story: {
            title: "A Legacy on Your Wrist",
            narrative: "Time is the ultimate luxury. The Chrono-Elegance isn't just about telling time; it's about owning it. Each tick is a reminder of moments lived and memories made. Forged with precision and designed with soul, it's a testament to timeless style that transcends fleeting trends. It's not just a watch; it's your story.",
            imageUrl: "https://images.unsplash.com/photo-1620625515032-6ed2a1438834?q=80&w=1200&auto=format&fit=crop"
        }
    },
    { id: 18, name: 'The Voyager Leather Bag', description: 'A handcrafted leather satchel perfect for the modern professional.', price: 450.00, imageUrl: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=800&auto=format&fit=crop' },
    { id: 19, name: 'Silk Scarf "Monarch"', description: 'An elegant silk scarf with a vibrant, artistic butterfly print.', price: 120.00, imageUrl: 'https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?q=80&w=800&auto=format&fit=crop' },
    { 
        id: 20, 
        name: 'Trench Coat "London Fog"', 
        description: 'A classic, all-weather trench coat that never goes out of style.', 
        price: 380.00, 
        imageUrl: 'https://images.unsplash.com/photo-1517942491322-1c6ada40a2c0?q=80&w=800&auto=format&fit=crop',
        story: {
            title: "The Signature of Style",
            narrative: "Through misty mornings and rain-slicked city streets, the London Fog trench coat is your shield of sophistication. Its iconic silhouette whispers tales of timeless elegance and quiet confidence. It's more than a coat—it's an armor of grace for the modern romantic.",
            imageUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=1200&auto=format&fit=crop"
        }
    },
    { id: 21, name: 'Velvet Evening Gown', description: 'A stunning, floor-length velvet gown for special occasions.', price: 600.00, imageUrl: 'https://images.unsplash.com/photo-1595509553306-932f91b6c771?q=80&w=800&auto=format&fit=crop' },
    { id: 22, name: 'Suede Ankle Boots', description: 'Stylish and comfortable suede boots that complement any outfit.', price: 180.00, imageUrl: 'https://images.unsplash.com/photo-1519758369395-97995f54032b?q=80&w=800&auto=format&fit=crop' },
    { id: 23, name: 'Designer Sunglasses', description: 'Protect your eyes in style with these chic, oversized sunglasses.', price: 250.00, imageUrl: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=800&auto=format&fit=crop' },
    { id: 24, name: 'Cashmere Sweater', description: 'Experience ultimate comfort and luxury with this 100% cashmere sweater.', price: 300.00, imageUrl: 'https://images.unsplash.com/photo-1620799140159-48301732642a?q=80&w=800&auto=format&fit=crop' },
];


export const themes: Record<Theme, AppTheme> = {
  [Theme.Electronics]: {
    products: electronicsProducts,
    styles: {
      '--font-family': "'Poppins', sans-serif",
      '--background-primary': '#111827',
      '--background-secondary': '#1f2937',
      '--background-tertiary': '#374151',
      '--text-primary': '#f9fafb',
      '--text-secondary': '#d1d5db',
      '--text-tertiary': '#9ca3af',
      '--primary-accent': '#22d3ee',
      '--primary-accent-hover': '#67e8f9',
      '--border-color': '#374151',
      '--border-radius': '0.5rem',
      '--header-gradient-from': '#a78bfa',
      '--header-gradient-to': '#67e8f9',
    } as React.CSSProperties,
  },
  [Theme.Youthful]: {
    products: youthfulProducts,
    styles: {
        '--font-family': "'Poppins', sans-serif",
        '--background-primary': '#1a1a2e',
        '--background-secondary': '#16213e',
        '--background-tertiary': '#0f3460',
        '--text-primary': '#ffffff',
        '--text-secondary': '#a7a9be',
        '--text-tertiary': '#e94560',
        '--primary-accent': '#e94560',
        '--primary-accent-hover': '#f9a8d4',
        '--border-color': '#0f3460',
        '--border-radius': '1rem',
        '--header-gradient-from': '#f9a8d4',
        '--header-gradient-to': '#e94560',
    } as React.CSSProperties,
  },
  [Theme.Fashion]: {
    products: fashionProducts,
    styles: {
      '--font-family': "'Playfair Display', serif",
      '--background-primary': '#2d2d2d',
      '--background-secondary': '#3c3c3c',
      '--background-tertiary': '#4a4a4a',
      '--text-primary': '#f5f5f4',
      '--text-secondary': '#a8a29e',
      '--text-tertiary': '#eab308',
      '--primary-accent': '#eab308',
      '--primary-accent-hover': '#fde047',
      '--border-color': '#4a4a4a',
      '--border-radius': '0.25rem',
      '--header-gradient-from': '#eab308',
      '--header-gradient-to': '#fde047',
    } as React.CSSProperties,
  },
};
