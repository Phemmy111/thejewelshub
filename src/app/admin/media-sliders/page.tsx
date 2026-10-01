import { getMediaSliders } from './actions'
import { getCategories } from '@/lib/supabase/storefront'
import { SliderManagerClient } from '@/components/admin/SliderManagerClient'

export default async function MediaSlidersPage() {
  const [initialSliders, categories] = await Promise.all([
    getMediaSliders(),
    getCategories()
  ])

  // Ensure initialSliders is an array (JSONB might return null or empty object if unset)
  const safeSliders = Array.isArray(initialSliders) ? initialSliders : []

  return <SliderManagerClient initialSliders={safeSliders} categories={categories} />
}
