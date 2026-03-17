'use client'
import { useLanguage } from '@/contexts/LanguageContext'
import listingData from '@/data/listingData.json'

export default function VillaDescription() {
  const { t } = useLanguage()
  return (
    <div className="prose prose-sm text-stone space-y-4">
      {t(listingData.description.full).split('\n\n').map((para, i) => (
        <p key={i} className="leading-relaxed">{para}</p>
      ))}
    </div>
  )
}
