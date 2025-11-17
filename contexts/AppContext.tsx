import React, { createContext, useState, useContext, useEffect, useMemo, useCallback } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import { Theme, Appearance, Locale, ViewMode, ToastMessage } from '../types';
import { themes, translations } from '../constants';

interface AppContextType {
  activeTheme: Theme;
  setActiveTheme: (theme: Theme) => void;
  currentThemeStyles: React.CSSProperties;
  
  appearance: Appearance;
  setAppearance: (appearance: Appearance) => void;
  finalAppearance: 'light' | 'dark';

  reduceMotion: boolean;
  setReduceMotion: (reduce: boolean) => void;
  
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string, replacements?: Record<string, string | number>) => string;

  viewMode: ViewMode;
  setViewMode: (view: ViewMode) => void;

  toasts: ToastMessage[];
  addToast: (message: string) => void;
  removeToast: (id: number) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTheme, setActiveTheme] = useLocalStorage<Theme>('theme', Theme.Electronics);
  const [appearance, setAppearance] = useLocalStorage<Appearance>('appearance', Appearance.System);
  const [reduceMotion, setReduceMotion] = useLocalStorage<boolean>('reduceMotion', false);
  const [locale, setLocale] = useLocalStorage<Locale>('locale', 'en');
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const isSystemDark = useMemo(() => window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches, []);
  
  const finalAppearance = useMemo(() => (
    appearance === Appearance.System ? (isSystemDark ? 'dark' : 'light') : appearance
  ), [appearance, isSystemDark]);
  
  const currentThemeStyles = themes[activeTheme].styles[finalAppearance as 'light' | 'dark'];

  type ViewModeSettings = { [key in Theme]?: ViewMode };
  const [viewModes, setViewModes] = useLocalStorage<ViewModeSettings>('viewModes', {});
  const viewMode = useMemo(() => viewModes[activeTheme] || ViewMode.Grid, [viewModes, activeTheme]);
  const setViewMode = (newView: ViewMode) => setViewModes(prev => ({ ...prev, [activeTheme]: newView }));

  useEffect(() => {
    document.documentElement.className = finalAppearance;
    document.body.classList.add('gradient-bg');
    
    const style = document.createElement('style');
    style.innerHTML = `
      :root {
        ${Object.entries(currentThemeStyles).map(([key, value]) => `${key}: ${value};`).join('\n')}
      }
    `;
    document.head.appendChild(style);
    return () => { document.head.removeChild(style); };
  }, [finalAppearance, currentThemeStyles]);

  const t = useCallback((key: string, replacements?: Record<string, string | number>) => {
    let translation = translations[locale]?.[key] || translations['en'][key] || key;
    if (replacements) {
        Object.entries(replacements).forEach(([placeholder, value]) => {
            const regex = new RegExp(`\\{${placeholder}\\}`, 'g');
            translation = translation.replace(regex, String(value));
        });
    }
    return translation;
  }, [locale]);
  
  const addToast = (message: string) => setToasts(prev => [...prev, { id: Date.now(), message }]);
  const removeToast = (id: number) => setToasts(prev => prev.filter(t => t.id !== id));
  
  const value = {
    activeTheme,
    setActiveTheme,
    currentThemeStyles,
    appearance,
    setAppearance,
    // FIX: Explicitly cast finalAppearance to 'light' | 'dark' to satisfy the AppContextType.
    finalAppearance: finalAppearance as 'light' | 'dark',
    reduceMotion,
    setReduceMotion,
    locale,
    setLocale,
    t,
    viewMode,
    setViewMode,
    toasts,
    addToast,
    removeToast
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};