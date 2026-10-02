import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'

// This route is called by Vercel Cron every 3 days to prevent
// Supabase from pausing the project due to inactivity.
export async function GET(request: Request) {
  // Verify the request is from Vercel Cron (not a random public request)
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const supabase = await createAdminClient()

    // Do a lightweight query — just counts products
    const { count, error } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true })

    if (error) throw error

    const now = new Date().toISOString()
    console.log(`[Keep-Alive] Supabase pinged at ${now}. Products count: ${count}`)

    return NextResponse.json({
      success: true,
      pingedAt: now,
      productCount: count,
    })
  } catch (err: any) {
    console.error('[Keep-Alive] Error pinging Supabase:', err)
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}
