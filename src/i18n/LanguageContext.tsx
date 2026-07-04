/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { translations, Lang } from './translations';

interface LanguageContextValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: typeof translations.en;
}

const LanguageContext = createContext<LanguageContextValue>({
  lang: 'en',
  setLang: () => {},
  t: translations.en,
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    try {
      const saved = localStorage.getItem('nashglam_lang');
      return saved === 'fr' ? 'fr' : 'en';
    } catch {
      return 'en';
    }
  });

  const setLang = (l: Lang) => {
    setLangState(l);
    try { localStorage.setItem('nashglam_lang', l); } catch {}
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t: translations[lang] }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
