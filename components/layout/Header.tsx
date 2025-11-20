import React, { useState, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppContext } from '../../contexts/AppContext';
import { useProductContext } from '../../contexts/ProductContext';
import { useCartContext } from '../../contexts/CartContext';
import { useWishlistContext } from '../../contexts/WishlistContext';
import { useModalContext } from '../../contexts/ModalContext';
import { useUserContext } from '../../contexts/UserContext';
import { useTranslation } from '../../hooks/useTranslation';
import useVoiceNavigation from '../../hooks/useVoiceNavigation';
import { ViewMode, Theme } from '../../types';
import SearchBar from '../SearchBar';
import ViewSwitcher from '../ViewSwitcher';
import Tooltip from '../Tooltip';
import MobileMenu from '../MobileMenu';
import NotificationCenter from '../NotificationCenter';
import { 
    ManageIcon, CartIcon, CommandIcon, SparklesIcon, MenuIcon, HeartIcon, 
    SettingsIcon, BellIcon, UserIcon, MaximizeIcon, MinimizeIcon, ImageIcon 
} from '../icons';

const Header: React.FC = () => {
    const { 
        activeTheme, setActiveTheme, isZenMode, setZenMode, isHeaderScrolled, 
        notifications, setNotifications 
    } = useAppContext();
    const { 
        searchQuery, setSearchQuery, viewMode, setViewMode, products, 
        priceRange, setPriceRange, maxPrice, selectedCategories, setSelectedCategories,
        selectedColors, setSelectedColors, sortOption, setSortOption, resetFilters, 
        allAvailableCategories, allAvailableColors
    } = useProductContext();
    const { cartItemCount, cartIconRef, cartIconControls } = useCartContext();
    const { wishlist } = useWishlistContext();
    const { openModal } = useModalContext();
    const { setProfileVisible } = useUserContext();
    const { t } = useTranslation();

    const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isNotificationCenterOpen, setNotificationCenterOpen] = useState(false);

    const unreadNotifications = notifications.filter(n => !n.read).length;

    // Voice Command Config
    const voiceCommands = [
        { keyword: ['search for', 'find'], action: (param: string) => setSearchQuery(param || '') },
        { keyword: ['clear search'], action: () => setSearchQuery('') },
        { keyword: ['open cart'], action: () => openModal('CART') },
        { keyword: ['open wishlist'], action: () => openModal('WISHLIST') },
        { keyword: ['change theme to'], action: (param: string) => {
            const themeKey = Object.keys(Theme).find(k => k.toLowerCase() === (param || '').toLowerCase());
            if(themeKey) setActiveTheme(Theme[themeKey as keyof typeof Theme]);
        } },
        { keyword: ['change view to'], action: (param: string) => {
            const viewKey = Object.keys(ViewMode).find(k => k.toLowerCase() === (param || '').toLowerCase());
            if(viewKey) setViewMode(ViewMode[viewKey as keyof typeof ViewMode]);
        } },
    ];
    
    const { isListening, toggleListening } = useVoiceNavigation(voiceCommands);

    const surpriseMe = () => {
        const randomProduct = products[Math.floor(Math.random() * products.length)];
        openModal('PRODUCT_DETAIL', { product: randomProduct });
    };

    // Props for Mobile Menu (Passing down hooks data)
    const filterProps = { priceRange, setPriceRange, maxPrice, categories: allAvailableCategories, selectedCategories, setSelectedCategories, colors: allAvailableColors, selectedColors, setSelectedColors, sortOption, setSortOption, resetFilters };
    const themeSwitcherProps = { currentTheme: activeTheme, setTheme: setActiveTheme };
    const viewSwitcherProps = { currentView: viewMode, setView: setViewMode };

    return (
        <header id="main-header" className={`glass-header sticky top-0 z-20 ${isHeaderScrolled ? 'scrolled-header' : ''}`}>
          <div className="container mx-auto px-4 py-4 flex flex-wrap justify-between items-center gap-4">
            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[var(--header-gradient-from)] to-[var(--header-gradient-to)] order-1">{t('showcaseTitle')}</h1>
            
            <div className="hidden lg:flex flex-grow items-center justify-center gap-4 order-2">
                <SearchBar value={searchQuery} onChange={setSearchQuery} onVoiceSearch={toggleListening} isListening={isListening} />
            </div>

            <div className="hidden lg:flex items-center gap-2 order-3">
              <ViewSwitcher currentView={viewMode} setView={setViewMode} />
              <div className="flex items-center bg-[var(--background-tertiary)] rounded-[var(--border-radius)] p-1">
                <Tooltip text="Zen Mode"><motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => setZenMode(z => !z)} className="p-2 text-[var(--text-secondary)] hover:text-[var(--primary-accent)]" aria-label="Zen Mode">{isZenMode ? <MinimizeIcon/> : <MaximizeIcon />}</motion.button></Tooltip>
                <Tooltip text="Visual Search"><motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => openModal('VISUAL_SEARCH')} className="p-2 text-[var(--text-secondary)] hover:text-[var(--primary-accent)]" aria-label="Visual Search"><ImageIcon className="w-5 h-5" /></motion.button></Tooltip>
                <Tooltip text={t('surpriseMeTooltip')}><motion.button whileHover={{ scale: 1.1, rotate: 5 }} whileTap={{ scale: 0.9 }} onClick={surpriseMe} className="p-2 text-[var(--text-secondary)] hover:text-[var(--primary-accent)]" aria-label="Surprise Me"><SparklesIcon className="w-5 h-5" /></motion.button></Tooltip>
                <Tooltip text={t('commandPaletteTooltip')}><motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => openModal('COMMAND_PALETTE')} className="p-2 text-[var(--text-secondary)] hover:text-[var(--primary-accent)]" aria-label="Command Palette"><CommandIcon className="w-5 h-5" /></motion.button></Tooltip>
                <Tooltip text={t('manageProductsTooltip')}><motion.button whileHover={{ scale: 1.1, rotate: -5 }} whileTap={{ scale: 0.9 }} onClick={() => openModal('MANAGE_PRODUCTS')} className="p-2 text-[var(--text-secondary)] hover:text-[var(--primary-accent)]" aria-label="Manage Products"><ManageIcon className="w-5 h-5" /></motion.button></Tooltip>
              </div>
            </div>

            <div className="flex items-center gap-4 order-2 lg:hidden">
                <SearchBar value={searchQuery} onChange={setSearchQuery} onVoiceSearch={toggleListening} isListening={isListening} />
                <button onClick={() => setMobileMenuOpen(true)} className="p-2 text-[var(--text-secondary)] hover:text-[var(--primary-accent)]" aria-label="Open menu"><MenuIcon className="w-6 h-6" /></button>
            </div>

            <div className="hidden lg:flex items-center gap-3 order-4">
                <div className="relative">
                    <Tooltip text={t('notificationsTooltip')}>
                        <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => setNotificationCenterOpen(o => !o)} className="relative p-2 bg-[var(--background-tertiary)] rounded-[var(--border-radius)] text-[var(--text-secondary)] hover:text-[var(--primary-accent)]">
                            <BellIcon className="w-5 h-5" />
                            {unreadNotifications > 0 && (<span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[var(--primary-accent)] text-white text-[10px] font-bold">{unreadNotifications}</span>)}
                        </motion.button>
                    </Tooltip>
                    <AnimatePresence>{isNotificationCenterOpen && <NotificationCenter notifications={notifications} onClear={() => {}} onClearAll={() => setNotifications([])} />}</AnimatePresence>
                </div>
                <Tooltip text="Profile"><motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => setProfileVisible(true)} className="p-2 bg-[var(--background-tertiary)] rounded-[var(--border-radius)] text-[var(--text-secondary)] hover:text-[var(--primary-accent)]"><UserIcon className="w-5 h-5" /></motion.button></Tooltip>
                <Tooltip text={t('settingsTooltip')}><motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => openModal('SETTINGS')} className="p-2 bg-[var(--background-tertiary)] rounded-[var(--border-radius)] text-[var(--text-secondary)] hover:text-[var(--primary-accent)]"><SettingsIcon className="w-5 h-5" /></motion.button></Tooltip>
                <Tooltip text={t('wishlistTooltip', {count: wishlist.length})}><motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => openModal('WISHLIST')} className="relative p-2 bg-[var(--background-tertiary)] rounded-[var(--border-radius)] text-[var(--text-secondary)] hover:text-[var(--primary-accent)]"><HeartIcon className="w-5 h-5" />{wishlist.length > 0 && (<span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[var(--primary-accent)] text-white text-[10px] font-bold">{wishlist.length}</span>)}</motion.button></Tooltip>
                <Tooltip text={t('cartTooltip', {count: cartItemCount})}><motion.button ref={cartIconRef} animate={cartIconControls} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => openModal('CART')} className="relative p-2 bg-[var(--background-tertiary)] rounded-[var(--border-radius)] text-[var(--text-secondary)] hover:text-[var(--primary-accent)]"><CartIcon className="w-5 h-5" />{cartItemCount > 0 && (<span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[var(--primary-accent)] text-white text-[10px] font-bold">{cartItemCount}</span>)}</motion.button></Tooltip>
            </div>
          </div>
          
          <MobileMenu 
            isOpen={isMobileMenuOpen} onClose={() => setMobileMenuOpen(false)} 
            searchQuery={searchQuery} setSearchQuery={setSearchQuery} 
            filterPopoverProps={filterProps} themeSwitcherProps={themeSwitcherProps} viewSwitcherProps={viewSwitcherProps} 
            surpriseMe={surpriseMe} openCommandPalette={() => openModal('COMMAND_PALETTE')} openManageModal={() => openModal('MANAGE_PRODUCTS')} openSettingsModal={() => openModal('SETTINGS')} 
          />
        </header>
    );
};

export default Header;
