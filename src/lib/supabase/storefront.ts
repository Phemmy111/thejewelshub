import { createClient } from './server'

export async function getCategories() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('active', true)
    .order('name')
  
  if (error) {
    console.error('Error fetching categories:', error)
    return []
  }
  return data
}

export async function getProducts(categorySlug?: string) {
  const supabase = await createClient()
  
  let query = supabase
    .from('products')
    .select(`
      *,
      categories!inner(id, name, slug)
    `)
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  if (categorySlug) {
    query = query.eq('categories.slug', categorySlug)
  }

  const { data, error } = await query
  
  if (error) {
    console.error('Error fetching products:', error)
    return []
  }
  return data
}

export async function getProductBySlug(slug: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      categories(id, name, slug)
    `)
    .eq('slug', slug)
    .eq('is_active', true)
    .single()
    
  if (error) {
    console.error('Error fetching product:', error)
    return null
  }
  return data
}

export async function getSliderConfig(targetPage: string) {
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('settings')
      .select('value')
      .eq('key', 'media_sliders')
    
    if (data && data.length > 0 && Array.isArray(data[0].value)) {
      return data[0].value.find((s: any) => s.targetPage === targetPage) || null
    }
    return null
  } catch (err) {
    console.error('Error fetching slider config:', err)
    return null
  }
}
