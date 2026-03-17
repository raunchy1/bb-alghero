'use client'

import { Star } from 'lucide-react'
import clsx from 'clsx'
import { useLanguage } from '@/contexts/LanguageContext'
import type { BilingualText } from '@/contexts/LanguageContext'

interface Review {
  id: number
  author: string
  rating: number
  date: string
  text: BilingualText
  location: string
}

interface ReviewCardsProps {
  reviews: Review[]
  limit?: number
  variant?: 'grid' | 'carousel'
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={12}
          className={clsx(
            i < rating ? 'text-sunset fill-sunset' : 'text-sand-dark'
          )}
        />
      ))}
    </div>
  )
}

export default function ReviewCards({ reviews, limit = 6, variant = 'grid' }: ReviewCardsProps) {
  const { t } = useLanguage()
  const displayed = reviews.slice(0, limit)

  return (
    <div className={clsx(
      variant === 'grid'
        ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
        : 'flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory'
    )}>
      {displayed.map((review) => (
        <div
          key={review.id}
          className={clsx(
            'bg-white border border-sand-dark p-6 flex flex-col',
            'transition-all duration-300 hover:shadow-luxury',
            variant === 'carousel' && 'flex-shrink-0 w-80 snap-start'
          )}
        >
          {/* Header */}
          <div className="flex items-center gap-4 mb-4">
            <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 bg-sand-dark flex items-center justify-center">
              <span className="font-serif text-ocean text-sm">{review.author.charAt(0)}</span>
            </div>
            <div>
              <p className="text-sm font-medium text-ocean">{review.author}</p>
              <p className="text-xs text-stone">{review.location}</p>
            </div>
          </div>

          {/* Rating + Date */}
          <div className="flex items-center justify-between mb-4">
            <StarRating rating={review.rating} />
            <span className="text-xs text-stone">{review.date}</span>
          </div>

          {/* Text */}
          <p className="text-sm text-stone leading-relaxed flex-1 line-clamp-4">
            &ldquo;{t(review.text)}&rdquo;
          </p>
        </div>
      ))}
    </div>
  )
}
