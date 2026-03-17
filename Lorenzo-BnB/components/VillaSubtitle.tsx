'use client'
import { useLanguage } from '@/contexts/LanguageContext'
import listingData from '@/data/listingData.json'

export default function VillaSubtitle() {
  const { t } = useLanguage()
  return <p className="text-white/80 text-sm sm:text-lg mt-2">{t(listingData.subtitle)}</p>
}
