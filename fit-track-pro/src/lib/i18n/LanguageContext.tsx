'use client';

import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { Language, TranslationDictionary } from './types';
import { en } from './dictionaries/en';
import { bn } from './dictionaries/bn';

const LANGUAGE_STORAGE_KEY = 'muscles_map_lang';

type NestedKeyOf<ObjectType extends object> = {
  [Key in keyof ObjectType & (string | number)]: ObjectType[Key] extends object
    ? `${Key}` | `${Key}.${NestedKeyOf<ObjectType[Key]>}`
    : `${Key}`;
}[keyof ObjectType & (string | number)];

export type TranslationKey = NestedKeyOf<TranslationDictionary>;

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, fallback?: string) => string;
  dict: TranslationDictionary;
}

const dictionaries: Record<Language, TranslationDictionary> = {
  en,
  bn,
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedLang = localStorage.getItem(LANGUAGE_STORAGE_KEY) as Language | null;
        if (savedLang && (savedLang === 'en' || savedLang === 'bn')) {
          return savedLang;
        }
      } catch {
        // localStorage not available
      }
    }
    return 'en';
  });

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
      document.documentElement.lang = lang;
    } catch {
      // ignore
    }
  }, []);

  const dict = useMemo(() => dictionaries[language] || dictionaries.en, [language]);

  const t = useCallback(
    (keyPath: string, fallback?: string): string => {
      const keys = keyPath.split('.');
      let current: unknown = dict;

      for (const k of keys) {
        if (current && typeof current === 'object' && k in current) {
          current = (current as Record<string, unknown>)[k];
        } else {
          // Fallback to English dictionary if key missing in selected language
          let fallbackCurrent: unknown = dictionaries.en;
          for (const fbKey of keys) {
            if (fallbackCurrent && typeof fallbackCurrent === 'object' && fbKey in fallbackCurrent) {
              fallbackCurrent = (fallbackCurrent as Record<string, unknown>)[fbKey];
            } else {
              return fallback || keyPath;
            }
          }
          return typeof fallbackCurrent === 'string' ? fallbackCurrent : (fallback || keyPath);
        }
      }

      return typeof current === 'string' ? current : (fallback || keyPath);
    },
    [dict]
  );

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      t,
      dict,
    }),
    [language, setLanguage, t, dict]
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
