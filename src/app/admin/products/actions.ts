'use server'

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'

async function createAdminClient() {
  const cookieStore = await cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll() },
        setAll(cookiesToSet: { name: string; value: string; options?: any }[]) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch { }
        },
      },
    }
  )
}

export async function getAdminProducts() {
  const supabase = await createAdminClient()
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      categories ( id, name ),
      product_images ( id, url, is_primary, display_order )
    `)
    .order('created_at', { ascending: false })
  
  if (error) {
    console.error('Error fetching admin products:', error)
    return []
  }
  return data
}

export async function getAdminCategories() {
  const supabase = await createAdminClient()
  const { data, error } = await supabase.from('categories').select('*').order('name')
  return error ? [] : data
}

export async function getProductSignedUploadUrls(filesInfo: { name: string, type: string }[]) {
  try {
    const supabase = await createAdminClient()
    const results = []
    
    for (const file of filesInfo) {
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
      
      const { data, error } = await supabase.storage.from('product-media').createSignedUploadUrl(fileName)
      
      if (error) throw new Error(error.message)
      
      const { data: { publicUrl } } = supabase.storage.from('product-media').getPublicUrl(fileName)
      
      results.push({
        token: data.token,
        path: data.path,
        publicUrl
      })
    }
    
    return { success: true, urls: results }
  } catch (err: any) {
    return { success: false, error: err.message || 'Unknown error' }
  }
}

export async function getReferenceMediaSignedUploadUrls(filesInfo: { name: string, type: string }[]) {
  try {
    const supabase = await createAdminClient()
    const results = []

    for (const file of filesInfo) {
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`

      const { data, error } = await supabase.storage.from('product-reference-media').createSignedUploadUrl(fileName)

      if (error) throw new Error(error.message)

      const { data: { publicUrl } } = supabase.storage.from('product-reference-media').getPublicUrl(fileName)

      results.push({
        token: data.token,
        path: data.path,
        publicUrl
      })
    }

    return { success: true, urls: results }
  } catch (err: any) {
    return { success: false, error: err.message || 'Unknown error' }
  }
}

export async function saveProduct(productData: any, images: { url: string, is_primary: boolean }[]) {
  try {
    const supabase = await createAdminClient()
    
    // 1. Upsert Product
    const { data: product, error: productError } = await supabase
      .from('products')
      .upsert({
        ...(productData.id ? { id: productData.id } : {}),
        name: productData.name,
        slug: productData.slug,
        category_id: productData.category_id,
        description: productData.description,
        price_kobo: productData.price_kobo,
        compare_at_price_kobo: productData.compare_at_price_kobo || null,
        stock_quantity: productData.stock_quantity,
        is_active: productData.is_active,
        sizes: productData.sizes || [],
        reference_media: productData.reference_media || [],
        updated_at: new Date().toISOString()
      })
      .select()
      .single()
      
    if (productError) throw new Error(productError.message)
    
    // 2. If new images were provided, delete old and insert new (simple approach for now)
    if (images && images.length > 0) {
      await supabase.from('product_images').delete().eq('product_id', product.id)
      
      const imageInserts = images.map((img, idx) => ({
        product_id: product.id,
        url: img.url,
        is_primary: img.is_primary,
        display_order: idx
      }))
      
      const { error: imageError } = await supabase.from('product_images').insert(imageInserts)
      if (imageError) throw new Error(imageError.message)
    }

    revalidatePath('/', 'layout')
    return { success: true, product }
  } catch (err: any) {
    console.error('Save product error:', err)
    return { success: false, error: err.message }
  }
}

export async function deleteProduct(productId: string) {
  try {
    const supabase = await createAdminClient()
    const { error } = await supabase.from('products').delete().eq('id', productId)
    if (error) throw new Error(error.message)
    revalidatePath('/', 'layout')
    return { success: true }
  } catch (err: any) {
    return { success: false, error: err.message }
  }
}
