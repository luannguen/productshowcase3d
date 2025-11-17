import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAppContext } from '../../contexts/AppContext';
import { useCartContext } from '../../contexts/CartContext';
import { useWishlistContext } from '../../contexts/WishlistContext';
import { useModalContext } from '../../contexts/ModalContext';
import { useProductContext } from '../../contexts/ProductContext';
import { ManageIcon, CartIcon, CommandIcon, SparklesIcon, HeartIcon, SettingsIcon, ImageIcon, MaximizeIcon, MinimizeIcon, MenuIcon } from '../icons';
import ViewSwitcher from '../ViewSwitcher';
import Tooltip from '../Tooltip';

const Header: React.FC = () => {
    const { t, viewMode, setViewMode } = useAppContext();
    const { cartItemCount, cartIconRef, cartIconControls } = useCartContext();
    const { wishlist } = useWishlistContext();
    const { openModal } = useModalContext();
    const { allProducts } = useProductContext();

    const [isHeaderScrolled, setIsHeaderScrolled] = useState(false);
    const [isZenMode, setZenMode] = useState(false);

    useEffect(() => {
        const handleScroll = () => setIsHeaderScrolled(window.scrollY > 10);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        document.body.classList.toggle('zen-mode', isZenMode);
    }, [isZenMode]);

    const surpriseMe = () => {
        const randomProduct = allProducts[Math.floor(Math.random() * allProducts.length)];
        openModal('productDetail', { product: randomProduct });
    };

    return (
        <header id="main-header" className={`glass-header sticky top-0 z-20 ${isHeaderScrolled ? 'scrolled-header' : ''}`}>
            <div className="container mx-auto px-4 py-4 flex flex-wrap justify-between items-center gap-4">
                <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[var(--header-gradient-from)] to-[var(--header-gradient-to)] order-1">{t('showcaseTitle')}</h1>
                
                <div className="hidden lg:flex items-center gap-2 order-3">
                    <ViewSwitcher currentView={viewMode} setView={setViewMode} />
                    <div className="flex items-center bg-[var(--background-tertiary)] rounded-[var(--border-radius)] p-1">
                        <Tooltip text="Zen Mode"><motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => setZenMode(z => !z)} className="p-2 text-[var(--text-secondary)] hover:text-[var(--primary-accent)]" aria-label="Zen Mode">{isZenMode ? <MinimizeIcon/> : <MaximizeIcon />}</motion.button></Tooltip>
                        <Tooltip text="Visual Search"><motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => openModal('visualSearch')} className="p-2 text-[var(--text-secondary)] hover:text-[var(--primary-accent)]" aria-label="Visual Search"><ImageIcon className="w-5 h-5" /></motion.button></Tooltip>
                        <Tooltip text={t('surpriseMeTooltip')}><motion.button whileHover={{ scale: 1.1, rotate: 5 }} whileTap={{ scale: 0.9 }} onClick={surpriseMe} className="p-2 text-[var(--text-secondary)] hover:text-[var(--primary-accent)]" aria-label="Surprise Me"><SparklesIcon className="w-5 h-5" /></motion.button></Tooltip>
                        <Tooltip text={t('commandPaletteTooltip')}><motion.button id="command-palette-button" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => openModal('commandPalette')} className="p-2 text-[var(--text-secondary)] hover:text-[var(--primary-accent)]" aria-label="Command Palette"><CommandIcon className="w-5 h-5" /></motion.button></Tooltip>
                        <Tooltip text={t('manageProductsTooltip')}><motion.button whileHover={{ scale: 1.1, rotate: -5 }} whileTap={{ scale: 0.9 }} onClick={() => openModal('productManagement')} className="p-2 text-[var(--text-secondary)] hover:text-[var(--primary-accent)]" aria-label="Manage Products"><ManageIcon className="w-5 h-5" /></motion.button></Tooltip>
                    </div>
                </div>

                <div className="flex items-center gap-4 order-2 lg:hidden">
                    <Tooltip text={t('settingsTooltip')}><motion.button onClick={() => openModal('settings')} className="relative p-2 text-[var(--text-secondary)] hover:text-[var(--primary-accent)]"><SettingsIcon className="w-6 h-6" /></motion.button></Tooltip>
                    <Tooltip text={t('wishlistTooltip', {count: wishlist.length})}><motion.button onClick={() => openModal('wishlist')} className="relative p-2 text-[var(--text-secondary)] hover:text-[var(--primary-accent)]"><HeartIcon className="w-6 h-6" /></motion.button></Tooltip>
                    <Tooltip text={t('cartTooltip', {count: cartItemCount})}><motion.button ref={cartIconRef} animate={cartIconControls} onClick={() => openModal('cart')} className="relative p-2 text-[var(--text-secondary)] hover:text-[var(--primary-accent)]"><CartIcon className="w-6 h-6" />{cartItemCount > 0 && (<span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[var(--primary-accent)] text-white text-[10px] font-bold">{cartItemCount}</span>)}</motion.button></Tooltip>
                    <button onClick={() => openModal('mobileMenu')} className="p-2 text-[var(--text-secondary)] hover:text-[var(--primary-accent)]" aria-label="Open menu"><MenuIcon className="w-6 h-6" /></button>
                </div>

                <div className="hidden lg:flex items-center gap-3 order-4">
                    <Tooltip text={t('settingsTooltip')}><motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => openModal('settings')} className="p-2 bg-[var(--background-tertiary)] rounded-[var(--border-radius)] text-[var(--text-secondary)] hover:text-[var(--primary-accent)]"><SettingsIcon className="w-5 h-5" /></motion.button></Tooltip>
                    <Tooltip text={t('wishlistTooltip', {count: wishlist.length})}><motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => openModal('wishlist')} className="relative p-2 bg-[var(--background-tertiary)] rounded-[var(--border-radius)] text-[var(--text-secondary)] hover:text-[var(--primary-accent)]"><HeartIcon className="w-5 h-5" />{wishlist.length > 0 && (<span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[var(--primary-accent)] text-white text-[10px] font-bold">{wishlist.length}</span>)}</motion.button></Tooltip>
                    <Tooltip text={t('cartTooltip', {count: cartItemCount})}><motion.button ref={cartIconRef} animate={cartIconControls} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => openModal('cart')} className="relative p-2 bg-[var(--background-tertiary)] rounded-[var(--border-radius)] text-[var(--text-secondary)] hover:text-[var(--primary-accent)]"><CartIcon className="w-5 h-5" />{cartItemCount > 0 && (<span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[var(--primary-accent)] text-white text-[10px] font-bold">{cartItemCount}</span>)}</motion.button></Tooltip>
                </div>
            </div>
        </header>
    );
};

export default Header;