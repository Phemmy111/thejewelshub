'use server'

import { auth } from '@clerk/nextjs/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function fetchUserCart() {
  const { userId } = await auth()
  if (!userId) return null

  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll() },
        setAll() {}
      }
    }
  )

  const { data } = await supabase.from('user_carts').select('items').eq('user_id', userId).single()
  return data?.items || null
}

export async function saveUserCart(items: any[]) {
  const { userId } = await auth()
  if (!userId) return false

  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll() },
        setAll() {}
      }
    }
  )

  await supabase.from('user_carts').upsert({
    user_id: userId,
    items,
    updated_at: new Date().toISOString()
  })

  return true
}
