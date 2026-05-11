'use client'

import { Star, Shield, MessageCircle, Clock } from 'lucide-react'
import Link from 'next/link'
import listingData from '@/data/listingData.json'
import { useLanguage } from '@/contexts/LanguageContext'

export default function HostCard() {
  const { host } = listingData
  const { t } = useLanguage()

  return (
    <div className="bg-white border border-border p-8">
      <div className="flex flex-col sm:flex-row items-start gap-6">
        {/* Avatar */}
        <div className="relative flex-shrink-0">
          <div className="w-20 h-20 rounded-full bg-navy flex items-center justify-center">
            <span className="font-serif text-2xl text-sand">{host.name.charAt(0)}</span>
          </div>
          {host.superhost && (
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-gold rounded-full flex items-center justify-center">
              <Star size={10} className="text-white fill-white" />
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-3 mb-1">
            <h3 className="font-serif text-xl text-navy">{host.name}</h3>
            {host.superhost && (
              <span className="text-xs font-medium tracking-widest uppercase bg-gold/10 text-gold px-2 py-0.5">
                Superhost
              </span>
            )}
          </div>
          <p className="text-sm text-muted mb-4">{host.reviewCount} {t({ it: 'recensioni', en: 'reviews' })}</p>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-6 py-4 border-y border-border">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-navy font-medium">
                <Star size={14} className="text-gold fill-gold" />
                <span className="text-sm">{host.rating}</span>
              </div>
              <p className="text-xs text-muted mt-0.5">{t({ it: 'Valutazione', en: 'Rating' })}</p>
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-navy">{host.responseRate}</p>
              <p className="text-xs text-muted mt-0.5">{t({ it: 'Tasso di risposta', en: 'Response rate' })}</p>
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-navy">{t(host.responseTime)}</p>
              <p className="text-xs text-muted mt-0.5">{t({ it: 'Tempo di risposta', en: 'Response time' })}</p>
            </div>
          </div>

          {/* Languages */}
          <p className="text-xs text-muted mb-4">
            <span className="font-medium text-navy">{t({ it: 'Lingue: ', en: 'Languages: ' })}</span>
            {host.languages.join(', ')}
          </p>

          {/* Trust badges */}
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex items-center gap-2 text-xs text-muted">
              <Shield size={14} className="text-navy" />
              <span>{t({ it: 'Identità verificata', en: 'Verified identity' })}</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted">
              <MessageCircle size={14} className="text-navy" />
              <span>{t({ it: 'Risponde velocemente', en: 'Responds quickly' })}</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted">
              <Clock size={14} className="text-navy" />
              <span>{t({ it: 'Risponde', en: 'Responds' })} {t(host.responseTime)}</span>
            </div>
          </div>

          <Link href="/contact" className="btn-outline text-sm">
            {t({ it: 'Contatta l\'host', en: 'Contact the host' })}
          </Link>
        </div>
      </div>
    </div>
  )
}
