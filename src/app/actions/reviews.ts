'use server'
import { createAdminClient } from '@/lib/supabase/server'
import { auth, currentUser } from '@clerk/nextjs/server'
import { revalidatePath } from 'next/cache'

export async function submitReview(formData: {
  productId: string
  orderId: string
  rating: number
  comment: string
}) {
  const { userId } = await auth()
  if (!userId) return { success: false, error: 'Not logged in' }

  const user = await currentUser()
  const name =
    `${user?.firstName || ''} ${user?.lastName || ''}`.trim() || 'Anonymous'
  const email = user?.emailAddresses?.[0]?.emailAddress || ''

  const supabase = await createAdminClient()

  // Check the order belongs to this user and is delivered
  const { data: order } = await supabase
    .from('orders')
    .select('id, status, customer_email')
    .eq('id', formData.orderId)
    .eq('customer_email', email)
    .single()

  if (!order) return { success: false, error: 'Order not found' }
  if (order.status !== 'delivered')
    return { success: false, error: 'You can only review delivered orders' }

  // Check if already reviewed this product in this order
  const { data: existing } = await supabase
    .from('reviews')
    .select('id')
    .eq('user_id', userId)
    .eq('product_id', formData.productId)
    .eq('order_id', formData.orderId)
    .single()

  if (existing) return { success: false, error: 'You have already reviewed this product' }

  await supabase.from('reviews').insert({
    product_id: formData.productId,
    order_id: formData.orderId,
    user_id: userId,
    customer_name: name,
    customer_email: email,
    rating: formData.rating,
    comment: formData.comment,
    is_approved: false,
  })

  revalidatePath(`/shop/${formData.productId}`)
  return { success: true }
}

export async function getProductReviews(productId: string) {
  const supabase = await createAdminClient()
  const { data } = await supabase
    .from('reviews')
    .select('id, rating, comment, customer_name, created_at')
    .eq('product_id', productId)
    .eq('is_approved', true)
    .order('created_at', { ascending: false })
  return data || []
}
