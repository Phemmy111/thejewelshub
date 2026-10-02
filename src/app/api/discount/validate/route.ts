import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  const { code, orderTotal } = await request.json()

  const supabase = await createAdminClient()
  const { data } = await supabase
    .from('discount_codes')
    .select('*')
    .eq('code', code.toUpperCase().trim())
    .eq('is_active', true)
    .single()

  if (!data) return NextResponse.json({ valid: false, error: 'Invalid or expired code' })

  if (data.expires_at && new Date(data.expires_at) < new Date()) {
    return NextResponse.json({ valid: false, error: 'This code has expired' })
  }

  if (data.max_uses && data.uses_count >= data.max_uses) {
    return NextResponse.json({ valid: false, error: 'This code has reached its usage limit' })
  }

  if (data.min_order_kobo > 0 && orderTotal < data.min_order_kobo) {
    return NextResponse.json({
      valid: false,
      error: `Minimum order of ₦${(data.min_order_kobo / 100).toLocaleString()} required`,
    })
  }

  let discountKobo = 0
  if (data.type === 'percentage') {
    discountKobo = Math.floor(orderTotal * (data.value / 100))
  } else {
    discountKobo = Math.min(data.value * 100, orderTotal)
  }

  return NextResponse.json({
    valid: true,
    discountKobo,
    codeId: data.id,
    description: data.type === 'percentage' ? `${data.value}% OFF` : `₦${data.value} OFF`,
  })
}
