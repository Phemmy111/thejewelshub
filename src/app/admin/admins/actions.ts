'use server'

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { auth, currentUser } from '@clerk/nextjs/server'
import { revalidatePath } from 'next/cache'

const SUPER_ADMINS = ['thejewellershub@gmail.com', 'femiadeleke2020@gmail.com']

async function verifySuperAdmin() {
  const { userId } = await auth()
  if (!userId) throw new Error('Unauthorized')
  const user = await currentUser()
  const email = user?.emailAddresses?.[0]?.emailAddress?.toLowerCase()
  if (!email || !SUPER_ADMINS.includes(email)) throw new Error('Only super admins can manage other admins.')
}

async function getAdminClient() {
  await verifySuperAdmin()
  const cookieStore = await cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll() },
        setAll() {}
      }
    }
  )
}

export async function getAdmins() {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { cookies: { getAll() { return cookieStore.getAll() }, setAll() {} } }
  )
  const { data } = await supabase.from('admins').select('*').order('created_at', { ascending: false })
  return data || []
}

export async function addAdmin(email: string) {
  try {
    const supabase = await getAdminClient()
    const { error } = await supabase.from('admins').insert({ email: email.toLowerCase() })
    if (error) throw error
    revalidatePath('/admin/admins')
    return { success: true }
  } catch (err: any) {
    return { success: false, error: err.message }
  }
}

export async function removeAdmin(email: string) {
  try {
    const supabase = await getAdminClient()
    const { error } = await supabase.from('admins').delete().eq('email', email.toLowerCase())
    if (error) throw error
    revalidatePath('/admin/admins')
    return { success: true }
  } catch (err: any) {
    return { success: false, error: err.message }
  }
}
