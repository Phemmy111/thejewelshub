'use server'

import { createAdminClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getMediaSliders() {
  try {
    const supabase = await createAdminClient()
    const { data } = await supabase.from('settings').select('value').eq('key', 'media_sliders')
    if (data && data.length > 0) {
      return data[0].value
    }
    return []
  } catch (err) {
    console.error('getMediaSliders error:', err)
    return []
  }
}

export async function saveMediaSliders(sliders: any) {
  try {
    const supabase = await createAdminClient()
    const { error } = await supabase.from('settings').upsert({ 
      key: 'media_sliders', 
      value: sliders, 
      updated_at: new Date().toISOString() 
    })
    
    if (error) {
      return { success: false, error: error.message }
    }

    revalidatePath('/', 'layout')
    return { success: true }
  } catch (err: any) {
    return { success: false, error: err.message || 'Unknown error' }
  }
}

export async function uploadSliderFiles(formData: FormData) {
  try {
    const supabase = await createAdminClient()
    const files = formData.getAll('files') as File[]
    const urls: { url: string, isVideo: boolean }[] = []

    for (const file of files) {
      if (!(file instanceof File)) continue
      
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
      
      const arrayBuffer = await file.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)
      
      const { error } = await supabase.storage.from('hero-slides').upload(fileName, buffer, {
        contentType: file.type,
      })
      
      if (error) {
        console.error('Supabase upload error:', error)
        throw new Error(error.message)
      }
      
      const { data: { publicUrl } } = supabase.storage.from('hero-slides').getPublicUrl(fileName)
      urls.push({ 
        url: publicUrl, 
        isVideo: file.type.startsWith('video/') || file.name.endsWith('.mp4') 
      })
    }
    
    return { success: true, urls }
  } catch (err: any) {
    console.error('Upload catch error:', err)
    return { success: false, error: err.message }
  }
}
