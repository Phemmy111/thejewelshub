'use client'

import { useState } from 'react'
import { Star, ThumbsUp } from 'lucide-react'

interface Review {
  id: string
  rating: number
  comment: string | null
  customer_name: string
  created_at: string
}

function StarRating({ rating, size = 16 }: { rating: number; size?: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          size={size}
          className={i < rating ? 'fill-[#B8882C] text-[#B8882C]' : 'fill-gray-200 text-gray-200'}
        />
      ))}
    </div>
  )
}

function getInitials(name: string) {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

function getAvatarColor(name: string) {
  const colors = [
    '#B8882C', '#7C3AED', '#0891B2', '#059669', '#DC2626',
    '#D97706', '#7C3AED', '#DB2777', '#2563EB', '#16A34A',
  ]
  let hash = 0
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash)
  return colors[Math.abs(hash) % colors.length]
}

export default function ProductReviews({ reviews, productId }: { reviews: Review[]; productId: string }) {
  const [showAll, setShowAll] = useState(false)

  if (reviews.length === 0) {
    return (
      <section style={{ backgroundColor: '#fff', borderTop: '1px solid #E8E5DF', padding: '60px 0' }}>
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="flex items-center gap-3 mb-2">
            <h2 className="font-display font-bold text-2xl text-[#0D0D0D]">Customer Reviews</h2>
          </div>
          <p className="text-[#7A7069] text-sm">No reviews yet. Be the first to review this product after receiving your order!</p>
        </div>
      </section>
    )
  }

  const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
  const roundedAvg = Math.round(avgRating * 10) / 10

  // Count per star
  const starCounts = [5, 4, 3, 2, 1].map(star => ({
    star,
    count: reviews.filter(r => r.rating === star).length,
    pct: Math.round((reviews.filter(r => r.rating === star).length / reviews.length) * 100),
  }))

  const displayed = showAll ? reviews : reviews.slice(0, 4)

  return (
    <section style={{ backgroundColor: '#fff', borderTop: '1px solid #E8E5DF', padding: '60px 0' }}>
      <div className="max-w-7xl mx-auto px-5 sm:px-8">

        {/* Header */}
        <div className="mb-8">
          <p style={{ fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.28em', textTransform: 'uppercase', color: '#B8882C', marginBottom: '0.5rem' }}>
            What buyers say
          </p>
          <h2 className="font-display font-bold text-2xl md:text-3xl text-[#0D0D0D] mb-6">
            Customer Reviews
          </h2>
        </div>

        {/* Summary + Rating Bars */}
        <div className="flex flex-col md:flex-row gap-8 mb-10 pb-10 border-b border-[#E8E5DF]">
          {/* Big score */}
          <div className="flex flex-col items-center justify-center bg-[#F9F8F6] rounded-2xl px-10 py-8 min-w-[180px]">
            <span className="text-6xl font-bold text-[#0D0D0D] leading-none mb-2">{roundedAvg}</span>
            <StarRating rating={Math.round(avgRating)} size={20} />
            <span className="text-sm text-[#7A7069] mt-2">{reviews.length} review{reviews.length !== 1 ? 's' : ''}</span>
          </div>

          {/* Bars */}
          <div className="flex-1 flex flex-col justify-center gap-2">
            {starCounts.map(({ star, count, pct }) => (
              <div key={star} className="flex items-center gap-3">
                <span className="text-sm text-[#7A7069] w-8 shrink-0 text-right">{star}</span>
                <Star size={12} className="fill-[#B8882C] text-[#B8882C] shrink-0" />
                <div className="flex-1 bg-[#E8E5DF] rounded-full h-2">
                  <div
                    className="bg-[#B8882C] rounded-full h-2 transition-all duration-500"
                    style={{ width: pct + '%' }}
                  />
                </div>
                <span className="text-sm text-[#7A7069] w-8 shrink-0">{count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Review Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {displayed.map(review => {
            const avatarColor = getAvatarColor(review.customer_name)
            const initials = getInitials(review.customer_name)
            const date = new Date(review.created_at).toLocaleDateString('en-US', {
              month: 'short', day: 'numeric', year: 'numeric'
            })

            return (
              <div key={review.id} className="bg-[#F9F8F6] rounded-2xl p-5">
                {/* Top row: avatar + name + date */}
                <div className="flex items-center gap-3 mb-3">
                  {/* Avatar circle with initials */}
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0"
                    style={{ backgroundColor: avatarColor }}
                  >
                    {initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-[#0D0D0D] text-sm truncate">{review.customer_name}</div>
                    <div className="text-[#7A7069] text-xs">{date}</div>
                  </div>
                  {/* Verified badge */}
                  <div className="flex items-center gap-1 bg-green-50 text-green-600 text-xs font-semibold px-2 py-0.5 rounded-full shrink-0">
                    <ThumbsUp size={10} />
                    Verified
                  </div>
                </div>

                {/* Stars */}
                <StarRating rating={review.rating} size={14} />

                {/* Comment */}
                {review.comment && (
                  <p className="text-[#0D0D0D] text-sm mt-3 leading-relaxed">{review.comment}</p>
                )}
              </div>
            )
          })}
        </div>

        {/* Show more button */}
        {reviews.length > 4 && (
          <div className="mt-8 text-center">
            <button
              onClick={() => setShowAll(prev => !prev)}
              className="border border-[#B8882C] text-[#B8882C] px-8 py-3 rounded-full text-sm font-semibold hover:bg-[#B8882C] hover:text-white transition-colors"
            >
              {showAll ? 'Show Less' : `See all ${reviews.length} reviews`}
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
