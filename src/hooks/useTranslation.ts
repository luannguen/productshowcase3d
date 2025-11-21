import React, { createContext, useState, useContext, useCallback } from 'react';
import { Locale, Translations } from '../types';
import { translations } from '../constants';

interface TranslationContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string, replacements?: Record<string, string | number>) => string;
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

export const TranslationProvider = ({ children }: { children: React.ReactNode }): React.ReactElement => {
  const [locale, setLocale] = useState<Locale>('en');

  const t = useCallback((key: string, replacements?: Record<string, string | number>) => {
    let translation = translations[locale][key] || translations['en'][key] || key;
    if (replacements) {
        Object.entries(replacements).forEach(([placeholder, value]) => {
            const regex = new RegExp(`\\{${placeholder}\\}`, 'g');
            translation = translation.replace(regex, String(value));
        });
    }
    return translation;
  }, [locale]);

  return React.createElement(
    TranslationContext.Provider,
    { value: { locale, setLocale, t } },
    children
  );
};

export const useTranslation = () => {
  const context = useContext(TranslationContext);
  if (context === undefined) {
    throw new Error('useTranslation must be used within a TranslationProvider');
  }
  return context;
};