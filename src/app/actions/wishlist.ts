'use server'
import { createAdminClient } from '@/lib/supabase/server'
import { auth } from '@clerk/nextjs/server'
import { revalidatePath } from 'next/cache'

export async function getWishlist() {
  const { userId } = await auth()
  if (!userId) return []
  const supabase = await createAdminClient()
  const { data } = await supabase
    .from('wishlists')
    .select('product_id, products(id, name, slug, price_kobo, product_images(url, is_primary))')
    .eq('user_id', userId)
  return data || []
}

export async function toggleWishlist(productId: string) {
  const { userId } = await auth()
  if (!userId) return { success: false, error: 'Not logged in' }
  const supabase = await createAdminClient()
  const { data: existing } = await supabase
    .from('wishlists')
    .select('id')
    .eq('user_id', userId)
    .eq('product_id', productId)
    .single()
  if (existing) {
    await supabase.from('wishlists').delete().eq('user_id', userId).eq('product_id', productId)
    revalidatePath('/wishlist')
    return { success: true, action: 'removed' }
  } else {
    await supabase.from('wishlists').insert({ user_id: userId, product_id: productId })
    revalidatePath('/wishlist')
    return { success: true, action: 'added' }
  }
}

export async function isWishlisted(productId: string) {
  const { userId } = await auth()
  if (!userId) return false
  const supabase = await createAdminClient()
  const { data } = await supabase
    .from('wishlists')
    .select('id')
    .eq('user_id', userId)
    .eq('product_id', productId)
    .single()
  return !!data
}
