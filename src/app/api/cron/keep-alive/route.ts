import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'

// Public keep-alive endpoint — called by an external cron service (e.g. cron-job.org)
// every 3 days to prevent Supabase from pausing the project due to inactivity.
// This endpoint is safe to be public — it only reads a product count.
export async function GET() {
  try {
    const supabase = await createAdminClient()

    const { count, error } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true })

    if (error) throw error

    const now = new Date().toISOString()
    console.log(`[Keep-Alive] Supabase pinged at ${now}. Products: ${count}`)

    return NextResponse.json({
      success: true,
      pingedAt: now,
      productCount: count,
    })
  } catch (err: any) {
    console.error('[Keep-Alive] Error:', err)
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}
