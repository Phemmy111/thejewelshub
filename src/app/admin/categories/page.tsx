import { createAdminClient } from '@/lib/supabase/server'
import CategoryManagerClient from '@/components/admin/CategoryManagerClient'
import { redirect } from 'next/navigation'
import { auth } from '@clerk/nextjs/server'

export default async function AdminCategoriesPage() {
  const { userId } = await auth()
  if (!userId) redirect('/sign-in')

  const supabase = await createAdminClient()
  
  const { data: categories, error } = await supabase
    .from('categories')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching categories:', error)
  }

  return (
    <div className="p-4 md:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Category Management</h1>
        <p className="text-gray-600">Create, update, and manage your product categories.</p>
      </div>

      <CategoryManagerClient initialCategories={categories || []} />
    </div>
  )
}
