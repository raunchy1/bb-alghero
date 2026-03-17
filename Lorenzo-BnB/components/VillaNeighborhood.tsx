'use client'
import { useLanguage } from '@/contexts/LanguageContext'
import listingData from '@/data/listingData.json'

export default function VillaNeighborhood() {
  const { t } = useLanguage()
  return <p className="text-stone text-sm leading-relaxed mb-6">{t(listingData.description.neighborhood)}</p>
}
