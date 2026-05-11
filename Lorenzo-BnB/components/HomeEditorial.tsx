'use client'
import Link from 'next/link'
import { useLanguage } from '@/contexts/LanguageContext'
import listingData from '@/data/listingData.json'

export default function HomeEditorial() {
  const { t } = useLanguage()
  return (
    <>
      <p className="text-muted leading-relaxed mb-6">
        {t(listingData.description.short)}
      </p>
      <p className="text-muted leading-relaxed mb-10 text-sm">
        {t(listingData.description.house)}
      </p>
    </>
  )
}
