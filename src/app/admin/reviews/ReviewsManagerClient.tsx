'use client'
import { useState, useTransition } from 'react'
import { Star, Check, Trash2 } from 'lucide-react'
import { approveReviewAdmin, deleteReviewAdmin } from '@/app/actions/reviews'

export default function ReviewsManagerClient({ initialReviews }: { initialReviews: any[] }) {
  const [reviews, setReviews] = useState(initialReviews)
  const [isPending, startTransition] = useTransition()

  const approveReview = async (id: string, productId: string) => {
    startTransition(async () => {
      const res = await approveReviewAdmin(id, productId)
      if (res.success) {
        setReviews(prev => prev.map(r => (r.id === id ? { ...r, is_approved: true } : r)))
      } else {
        alert('Failed to approve review')
      }
    })
  }

  const deleteReview = async (id: string, productId: string) => {
    if (!confirm('Delete this review?')) return
    startTransition(async () => {
      const res = await deleteReviewAdmin(id, productId)
      if (res.success) {
        setReviews(prev => prev.filter(r => r.id !== id))
      } else {
        alert('Failed to delete review')
      }
    })
  }

  const renderStars = (n: number) =>
    Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={12}
        className={i < n ? 'fill-[#B8882C] text-[#B8882C]' : 'text-gray-300'}
      />
    ))

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-100">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 text-xs md:text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-2 py-3 md:px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Customer
              </th>
              <th className="px-2 py-3 md:px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Product
              </th>
              <th className="px-2 py-3 md:px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Rating
              </th>
              <th className="px-2 py-3 md:px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Comment
              </th>
              <th className="px-2 py-3 md:px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-2 py-3 md:px-6 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200 text-xs md:text-sm">
            {reviews.map(r => (
              <tr key={r.id} className="hover:bg-gray-50">
                <td className="px-2 py-3 md:px-6 md:py-4">
                  <div className="text-sm font-medium text-gray-900">{r.customer_name}</div>
                  <div className="text-xs text-gray-500">{r.customer_email}</div>
                </td>
                <td className="hidden sm:table-cell px-2 py-3 md:px-6 md:py-4 text-sm text-gray-700">{r.products?.name}</td>
                <td className="px-2 py-3 md:px-6 md:py-4">
                  <div className="flex gap-0.5">{renderStars(r.rating)}</div>
                </td>
                <td className="hidden sm:table-cell px-2 py-3 md:px-6 md:py-4 text-sm text-gray-600 max-w-xs truncate">
                  {r.comment || '—'}
                </td>
                <td className="px-2 py-3 md:px-6 md:py-4">
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                      r.is_approved
                        ? 'bg-green-100 text-green-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}
                  >
                    {r.is_approved ? 'Approved' : 'Pending'}
                  </span>
                </td>
                <td className="px-2 py-3 md:px-6 md:py-4 text-right">
                  {!r.is_approved && (
                    <button
                      onClick={() => approveReview(r.id, r.product_id)}
                      disabled={isPending}
                      className="p-1.5 rounded hover:bg-green-50 text-green-600 mr-2 disabled:opacity-50"
                      title="Approve"
                    >
                      <Check size={16} />
                    </button>
                  )}
                  <button
                    onClick={() => deleteReview(r.id, r.product_id)}
                    disabled={isPending}
                    className="p-1.5 rounded hover:bg-red-50 text-red-500 disabled:opacity-50"
                    title="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
            {reviews.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-gray-500 text-sm">
                  No reviews yet. Reviews appear here after customers submit them from their
                  delivered orders.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
