import { createAdminClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function uploadHeroSlide(formData: FormData) {
  'use server'

  const file = formData.get('file') as File
  const headline = formData.get('headline') as string
  const eyebrow = formData.get('eyebrow') as string
  const subheadline = formData.get('subheadline') as string
  const cta_label = formData.get('cta_label') as string
  const cta_url = formData.get('cta_url') as string
  const is_video = formData.get('is_video') === 'true'
  
  if (!file || !headline) throw new Error('File and Headline are required')

  const supabase = await createAdminClient()

  // 1. Upload to Storage
  const fileExt = file.name.split('.').pop()
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
  const { data: uploadData, error: uploadError } = await supabase
    .storage
    .from('hero-slides')
    .upload(fileName, file)

  if (uploadError) {
    console.error('Upload Error:', uploadError)
    throw new Error('Failed to upload file')
  }

  // 2. Get Public URL
  const { data: { publicUrl } } = supabase
    .storage
    .from('hero-slides')
    .getPublicUrl(fileName)

  // 3. Insert into DB
  const { error: dbError } = await supabase
    .from('hero_slides')
    .insert({
      media_url: publicUrl,
      is_video,
      headline,
      eyebrow: eyebrow || null,
      subheadline: subheadline || null,
      cta_label: cta_label || null,
      cta_url: cta_url || null,
    })

  if (dbError) {
    console.error('DB Error:', dbError)
    throw new Error('Failed to save slide record')
  }

  revalidatePath('/admin/hero')
  revalidatePath('/')
}

export async function deleteHeroSlide(id: string, mediaUrl: string) {
  'use server'

  const supabase = await createAdminClient()
  
  // Extract filename from URL (very basic split, adjust if needed)
  const fileName = mediaUrl.split('/').pop()

  if (fileName) {
    await supabase.storage.from('hero-slides').remove([fileName])
  }

  await supabase.from('hero_slides').delete().eq('id', id)
  
  revalidatePath('/admin/hero')
  revalidatePath('/')
}
