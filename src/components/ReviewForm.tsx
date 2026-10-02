'use client'
import { useState } from 'react'
import { Star } from 'lucide-react'
import { submitReview } from '@/app/actions/reviews'

interface ReviewFormProps {
  productId: string
  productName: string
  orderId: string
}

export function ReviewForm({ productId, productName, orderId }: ReviewFormProps) {
  const [open, setOpen] = useState(false)
  const [rating, setRating] = useState(0)
  const [hover, setHover] = useState(0)
  const [comment, setComment] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (rating === 0) { setError('Please select a rating.'); return }
    setLoading(true)
    setError('')
    const result = await submitReview({ productId, orderId, rating, comment })
    if (result.success) {
      setSubmitted(true)
    } else {
      setError(result.error || 'Failed to submit review.')
    }
    setLoading(false)
  }

  if (submitted) {
    return (
      <p className="text-xs text-green-600 font-semibold mt-2">
        ✓ Review submitted — pending approval. Thank you!
      </p>
    )
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="mt-2 text-xs font-semibold text-[#B8882C] hover:underline"
      >
        ★ Leave a Review
      </button>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="mt-3 p-4 bg-[#F9F8F6] rounded-lg border border-[#E8E5DF] space-y-3">
      <p className="text-xs font-bold text-[#0D0D0D] uppercase tracking-wider">
        Review: {productName}
      </p>

      {/* Star picker */}
      <div className="flex gap-1">
        {Array.from({ length: 5 }, (_, i) => i + 1).map(star => (
          <button
            key={star}
            type="button"
            onMouseEnter={() => setHover(star)}
            onMouseLeave={() => setHover(0)}
            onClick={() => setRating(star)}
            className="focus:outline-none"
          >
            <Star
              size={20}
              className={
                star <= (hover || rating)
                  ? 'fill-[#B8882C] text-[#B8882C]'
                  : 'text-gray-300'
              }
            />
          </button>
        ))}
        {rating > 0 && (
          <span className="text-xs text-[#7A7069] ml-1 self-center">
            {['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'][rating]}
          </span>
        )}
      </div>

      <textarea
        value={comment}
        onChange={e => setComment(e.target.value)}
        placeholder="Share your thoughts (optional)"
        rows={3}
        className="w-full border border-[#E8E5DF] rounded bg-white px-3 py-2 text-sm text-[#0D0D0D] focus:outline-none resize-none"
      />

      {error && <p className="text-xs text-red-500">{error}</p>}

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={loading}
          className="bg-[#0D0D0D] text-white px-4 py-1.5 rounded text-xs font-semibold hover:bg-[#B8882C] disabled:opacity-50 transition-colors"
        >
          {loading ? 'Submitting...' : 'Submit Review'}
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="text-xs text-[#7A7069] hover:text-[#0D0D0D] transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}
