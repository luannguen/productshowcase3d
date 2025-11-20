import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { Theme, Appearance, Locale, ToastMessage, Notification } from '../types';
import useLocalStorage from '../hooks/useLocalStorage';
import { initialNotifications, themes } from '../constants';

interface AppContextType {
  activeTheme: Theme;
  setActiveTheme: (theme: Theme) => void;
  appearance: Appearance;
  setAppearance: (appearance: Appearance) => void;
  reduceMotion: boolean;
  setReduceMotion: (reduce: boolean) => void;
  locale: Locale;
  setLocale: (locale: Locale) => void;
  toasts: ToastMessage[];
  addToast: (message: string) => void;
  removeToast: (id: number) => void;
  notifications: Notification[];
  setNotifications: React.Dispatch<React.SetStateAction<Notification[]>>;
  isZenMode: boolean;
  setZenMode: React.Dispatch<React.SetStateAction<boolean>>;
  isHeaderScrolled: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTheme, setActiveTheme] = useLocalStorage<Theme>('theme', Theme.Electronics);
  const [appearance, setAppearance] = useLocalStorage<Appearance>('appearance', Appearance.System);
  const [reduceMotion, setReduceMotion] = useLocalStorage<boolean>('reduceMotion', false);
  const [locale, setLocale] = useState<Locale>('en');
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [notifications, setNotifications] = useLocalStorage<Notification[]>('notifications', initialNotifications);
  const [isZenMode, setZenMode] = useState(false);
  const [isHeaderScrolled, setIsHeaderScrolled] = useState(false);

  // Theme Injection Logic
  const isSystemDark = useMemo(() => window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches, []);
  
  const finalAppearance = useMemo(() => {
    if (appearance === Appearance.System) {
        return isSystemDark ? Appearance.Dark : Appearance.Light;
    }
    return appearance;
  }, [appearance, isSystemDark]);

  useEffect(() => {
    document.documentElement.className = finalAppearance === 'high-contrast' ? 'dark' : finalAppearance;
    document.body.classList.toggle('zen-mode', isZenMode);
    document.body.classList.toggle('custom-cursor-enabled', !reduceMotion);
  }, [finalAppearance, isZenMode, reduceMotion]);

  useEffect(() => {
    document.body.classList.add('gradient-bg');
    document.title = `Showcase | ${activeTheme}`;

    const currentThemeStyles = themes[activeTheme].styles[finalAppearance];
    const style = document.createElement('style');
    style.innerHTML = `
      :root {
        ${Object.entries(currentThemeStyles).map(([key, value]) => `${key}: ${value};`).join('\n')}
      }
    `;
    document.head.appendChild(style);
    return () => { document.head.removeChild(style); };
  }, [activeTheme, finalAppearance]);

  useEffect(() => {
    const handleScroll = () => setIsHeaderScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const addToast = useCallback((message: string) => {
    setToasts(prev => [...prev, { id: Date.now(), message }]);
  }, []);

  const removeToast = useCallback((id: number) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return (
    <AppContext.Provider value={{
      activeTheme, setActiveTheme,
      appearance, setAppearance,
      reduceMotion, setReduceMotion,
      locale, setLocale,
      toasts, addToast, removeToast,
      notifications, setNotifications,
      isZenMode, setZenMode,
      isHeaderScrolled
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) throw new Error('useAppContext must be used within an AppContextProvider');
  return context;
};
