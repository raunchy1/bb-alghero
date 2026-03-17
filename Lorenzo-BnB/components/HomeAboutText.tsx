'use client'
import { useLanguage } from '@/contexts/LanguageContext'
import listingData from '@/data/listingData.json'

export default function HomeAboutText() {
  const { t } = useLanguage()
  return (
    <>
      <p className="text-sand/70 leading-relaxed mb-6 text-sm">
        {t(listingData.description.house)}
      </p>
      <p className="text-sand/70 leading-relaxed mb-10 text-sm">
        {t(listingData.description.neighborhood)}
      </p>
    </>
  )
}
