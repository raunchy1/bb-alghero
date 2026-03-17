'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

export type Lang = 'it' | 'en'
export type BilingualText = { it: string; en: string }

interface LanguageContextType {
  lang: Lang
  setLang: (lang: Lang) => void
  t: (text: string | BilingualText) => string
}

const LanguageContext = createContext<LanguageContextType>({
  lang: 'it',
  setLang: () => {},
  t: (text) => (typeof text === 'string' ? text : text.it),
})

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>('it')

  const t = (text: string | BilingualText): string => {
    if (typeof text === 'string') return text
    return text[lang] ?? text.it
  }

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export const useLanguage = () => useContext(LanguageContext)
