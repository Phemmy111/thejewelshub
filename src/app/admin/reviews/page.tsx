import { createAdminClient } from '@/lib/supabase/server'
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import ReviewsManagerClient from './ReviewsManagerClient'

export const dynamic = 'force-dynamic'

export default async function AdminReviewsPage() {
  const { userId } = await auth()
  if (!userId) redirect('/sign-in')

  const supabase = await createAdminClient()
  const { data: reviews } = await supabase
    .from('reviews')
    .select('id, rating, comment, customer_name, customer_email, is_approved, created_at, products(name, slug)')
    .order('created_at', { ascending: false })

  return (
    <div className="p-4 md:p-4 md:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Product Reviews</h1>
        <p className="text-gray-600">Moderate customer reviews submitted after delivery.</p>
      </div>
      <ReviewsManagerClient initialReviews={reviews || []} />
    </div>
  )
}
