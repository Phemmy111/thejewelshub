import { createAdminClient } from '@/lib/supabase/server'
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import DiscountsManagerClient from './DiscountsManagerClient'

export const dynamic = 'force-dynamic'

export default async function AdminDiscountsPage() {
  const { userId } = await auth()
  if (!userId) redirect('/sign-in')

  const supabase = await createAdminClient()
  const { data: codes } = await supabase
    .from('discount_codes')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Discount Codes</h1>
        <p className="text-gray-600">Create and manage promotional discount codes.</p>
      </div>
      <DiscountsManagerClient initialCodes={codes || []} />
    </div>
  )
}
