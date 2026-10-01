'use server'

import { createAdminClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getMediaSliders() {
  const supabase = await createAdminClient()
  const { data } = await supabase.from('settings').select('value').eq('key', 'media_sliders').single()
  return data?.value || []
}

export async function saveMediaSliders(sliders: any) {
  const supabase = await createAdminClient()
  const { error } = await supabase.from('settings').upsert({ 
    key: 'media_sliders', 
    value: sliders, 
    updated_at: new Date().toISOString() 
  })
  
  if (error) {
    console.error('Save sliders error:', error)
    throw new Error('Failed to save sliders')
  }

  revalidatePath('/', 'layout') // Revalidate everything so frontend picks up new sliders
  return true
}

export async function uploadSliderFiles(formData: FormData) {
  const supabase = await createAdminClient()
  const files = formData.getAll('files') as File[]
  const urls: { url: string, isVideo: boolean }[] = []

  for (const file of files) {
    const fileExt = file.name.split('.').pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
    
    const { error } = await supabase.storage.from('hero-slides').upload(fileName, file)
    if (error) throw new Error('Failed to upload file')
    
    const { data: { publicUrl } } = supabase.storage.from('hero-slides').getPublicUrl(fileName)
    urls.push({ 
      url: publicUrl, 
      isVideo: file.type.startsWith('video/') || file.name.endsWith('.mp4') 
    })
  }
  
  return urls
}
