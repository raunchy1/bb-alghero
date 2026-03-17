'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { CalendarDays, Users, Search, ChevronDown } from 'lucide-react'
import clsx from 'clsx'
import { useLanguage } from '@/contexts/LanguageContext'

interface BookingWidgetProps {
  variant?: 'hero' | 'inline' | 'sidebar'
}

export default function BookingWidget({ variant = 'inline' }: BookingWidgetProps) {
  const router = useRouter()
  const { t } = useLanguage()
  const [checkIn, setCheckIn] = useState('')
  const [checkOut, setCheckOut] = useState('')
  const [guests, setGuests] = useState(2)
  const [showGuestPicker, setShowGuestPicker] = useState(false)

  const handleSearch = () => {
    const params = new URLSearchParams()
    if (checkIn) params.set('checkIn', checkIn)
    if (checkOut) params.set('checkOut', checkOut)
    params.set('guests', String(guests))
    router.push(`/availability?${params.toString()}`)
  }

  const guestLabel = guests === 1
    ? `1 ${t({ it: 'ospite', en: 'guest' })}`
    : `${guests} ${t({ it: 'ospiti', en: 'guests' })}`

  const isHero = variant === 'hero'
  const isSidebar = variant === 'sidebar'

  if (isSidebar) {
    return (
      <div className="bg-white border border-sand-dark shadow-luxury p-6 lg:sticky top-24">
        <div className="mb-4">
          <span className="font-serif text-2xl text-ocean">€110</span>
          <span className="text-stone text-sm"> / {t({ it: 'notte', en: 'night' })}</span>
        </div>
        <div className="flex items-center gap-1 text-xs text-stone mb-6">
          <span className="text-sunset">★★★★★</span>
          <span className="font-medium text-ocean">4.92</span>
          <span>· 48 {t({ it: 'recensioni', en: 'reviews' })}</span>
        </div>

        <div className="border border-sand-dark divide-y divide-sand-dark mb-4">
          <div className="grid grid-cols-2 divide-x divide-sand-dark">
            <div className="p-3">
              <label className="text-xs font-medium tracking-widest uppercase text-stone block mb-1">Check-in</label>
              <input type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)}
                className="w-full text-sm text-ocean bg-transparent focus:outline-none"
                min={new Date().toISOString().split('T')[0]} />
            </div>
            <div className="p-3">
              <label className="text-xs font-medium tracking-widest uppercase text-stone block mb-1">Check-out</label>
              <input type="date" value={checkOut} onChange={(e) => setCheckOut(e.target.value)}
                className="w-full text-sm text-ocean bg-transparent focus:outline-none"
                min={checkIn || new Date().toISOString().split('T')[0]} />
            </div>
          </div>
          <div className="p-3 relative">
            <label className="text-xs font-medium tracking-widest uppercase text-stone block mb-1">
              {t({ it: 'Ospiti', en: 'Guests' })}
            </label>
            <button onClick={() => setShowGuestPicker(!showGuestPicker)}
              className="flex items-center justify-between w-full text-sm text-ocean">
              <span>{guestLabel}</span>
              <ChevronDown size={14} className={clsx('transition-transform', showGuestPicker && 'rotate-180')} />
            </button>
            {showGuestPicker && (
              <div className="absolute left-0 right-0 top-full z-20 bg-white border border-sand-dark shadow-luxury-lg p-4 flex items-center justify-between">
                <span className="text-sm text-ocean">{t({ it: 'Ospiti (max 4)', en: 'Guests (max 4)' })}</span>
                <div className="flex items-center gap-3">
                  <button onClick={() => setGuests(Math.max(1, guests - 1))}
                    className="w-7 h-7 border border-sand-dark flex items-center justify-center text-ocean hover:bg-sand-dark transition-colors">−</button>
                  <span className="text-sm font-medium text-ocean w-4 text-center">{guests}</span>
                  <button onClick={() => setGuests(Math.min(4, guests + 1))}
                    className="w-7 h-7 border border-sand-dark flex items-center justify-center text-ocean hover:bg-sand-dark transition-colors">+</button>
                </div>
              </div>
            )}
          </div>
        </div>

        <button onClick={handleSearch} className="btn-primary w-full justify-center">
          {t({ it: 'Verifica disponibilità', en: 'Check availability' })}
        </button>

        <p className="text-xs text-stone text-center mt-3">
          {t({ it: 'Non ti verrà addebitato nulla ora', en: "You won't be charged anything now" })}
        </p>

        {checkIn && checkOut && (
          <div className="mt-4 pt-4 border-t border-sand-dark space-y-2 text-sm">
            <div className="flex justify-between text-stone">
              <span>€110 × {Math.max(1, Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / 86400000))} {t({ it: 'notti', en: 'nights' })}</span>
              <span>€{110 * Math.max(1, Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / 86400000))}</span>
            </div>
            <div className="flex justify-between text-stone">
              <span>{t({ it: 'Pulizie finali', en: 'Cleaning fee' })}</span>
              <span>€60</span>
            </div>
            <div className="flex justify-between text-stone">
              <span>{t({ it: 'Spese di servizio', en: 'Service fee' })}</span>
              <span>€25</span>
            </div>
            <div className="flex justify-between font-medium text-ocean pt-2 border-t border-sand-dark">
              <span>{t({ it: 'Totale', en: 'Total' })}</span>
              <span>€{110 * Math.max(1, Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / 86400000)) + 85}</span>
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className={clsx(
      'bg-white/95 bg-blur shadow-luxury-lg',
      isHero ? 'p-2 sm:p-3' : 'p-4 border border-sand-dark'
    )}>
      <div className={clsx(
        'flex flex-col sm:flex-row',
        isHero ? 'gap-0 sm:divide-x sm:divide-sand-dark' : 'gap-4'
      )}>
        {/* Check-in */}
        <div className={clsx('flex items-center gap-3 px-4 py-3 flex-1',
          isHero && 'hover:bg-sand/50 transition-colors cursor-pointer')}>
          <CalendarDays size={16} className="text-sunset flex-shrink-0" />
          <div className="min-w-0">
            <label className="text-xs font-medium tracking-widest uppercase text-stone block">Check-in</label>
            <input type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)}
              className="w-full text-sm text-ocean bg-transparent focus:outline-none mt-0.5"
              min={new Date().toISOString().split('T')[0]} />
          </div>
        </div>

        {/* Check-out */}
        <div className={clsx('flex items-center gap-3 px-4 py-3 flex-1',
          isHero && 'hover:bg-sand/50 transition-colors cursor-pointer')}>
          <CalendarDays size={16} className="text-sunset flex-shrink-0" />
          <div className="min-w-0">
            <label className="text-xs font-medium tracking-widest uppercase text-stone block">Check-out</label>
            <input type="date" value={checkOut} onChange={(e) => setCheckOut(e.target.value)}
              className="w-full text-sm text-ocean bg-transparent focus:outline-none mt-0.5"
              min={checkIn || new Date().toISOString().split('T')[0]} />
          </div>
        </div>

        {/* Guests */}
        <div className={clsx('relative flex items-center gap-3 px-4 py-3',
          isHero ? 'flex-1 hover:bg-sand/50 transition-colors cursor-pointer' : 'flex-1')}>
          <Users size={16} className="text-sunset flex-shrink-0" />
          <div className="flex-1">
            <label className="text-xs font-medium tracking-widest uppercase text-stone block">
              {t({ it: 'Ospiti', en: 'Guests' })}
            </label>
            <button onClick={() => setShowGuestPicker(!showGuestPicker)}
              className="flex items-center gap-2 text-sm text-ocean mt-0.5">
              <span>{guestLabel}</span>
              <ChevronDown size={12} className={clsx('transition-transform', showGuestPicker && 'rotate-180')} />
            </button>
          </div>
          {showGuestPicker && (
            <div className="absolute left-0 right-0 sm:right-auto sm:min-w-[200px] top-full mt-2 z-20 bg-white border border-sand-dark shadow-luxury-lg p-5">
              <div className="flex items-center justify-between gap-6">
                <div>
                  <p className="text-sm font-medium text-ocean">{t({ it: 'Ospiti', en: 'Guests' })}</p>
                  <p className="text-xs text-stone">Max 4</p>
                </div>
                <div className="flex items-center gap-3">
                  <button onClick={() => setGuests(Math.max(1, guests - 1))}
                    className="w-8 h-8 border border-sand-dark flex items-center justify-center text-ocean hover:bg-sand transition-colors text-lg">−</button>
                  <span className="text-sm font-medium w-4 text-center text-ocean">{guests}</span>
                  <button onClick={() => setGuests(Math.min(4, guests + 1))}
                    className="w-8 h-8 border border-sand-dark flex items-center justify-center text-ocean hover:bg-sand transition-colors text-lg">+</button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Search Button */}
        <div className="px-2 py-2 flex items-center">
          <button onClick={handleSearch}
            className="bg-ocean text-sand hover:bg-ocean-light transition-colors duration-200 flex items-center gap-2 px-4 sm:px-6 py-3 text-xs font-medium tracking-widest uppercase whitespace-nowrap">
            <Search size={14} />
            <span className="hidden sm:inline">{t({ it: 'Verifica disponibilità', en: 'Check availability' })}</span>
          </button>
        </div>
      </div>
    </div>
  )
}
