import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { createAdminClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ wishlisted: false })

  const productId = request.nextUrl.searchParams.get('productId')
  if (!productId) return NextResponse.json({ wishlisted: false })

  const supabase = await createAdminClient()
  const { data } = await supabase
    .from('wishlists')
    .select('id')
    .eq('user_id', userId)
    .eq('product_id', productId)
    .single()

  return NextResponse.json({ wishlisted: !!data })
}
