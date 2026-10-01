'use server'

import { createAdminClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function saveCategory(categoryData: any) {
  try {
    const supabase = await createAdminClient()

    let result
    if (categoryData.id) {
      // Update
      const { data, error } = await supabase
        .from('categories')
        .update({
          name: categoryData.name,
          slug: categoryData.slug,
          description: categoryData.description,
          active: categoryData.active
        })
        .eq('id', categoryData.id)
        .select()
      
      if (error) throw error
      result = data
    } else {
      // Insert
      const { data, error } = await supabase
        .from('categories')
        .insert({
          name: categoryData.name,
          slug: categoryData.slug,
          description: categoryData.description,
          active: categoryData.active
        })
        .select()

      if (error) throw error
      result = data
    }

    revalidatePath('/admin/categories')
    revalidatePath('/shop')
    revalidatePath('/')
    return { success: true, data: result }
  } catch (error: any) {
    console.error('Error saving category:', error)
    return { success: false, error: error.message }
  }
}

export async function deleteCategory(id: string) {
  try {
    const supabase = await createAdminClient()
    const { error } = await supabase.from('categories').delete().eq('id', id)
    if (error) throw error

    revalidatePath('/admin/categories')
    revalidatePath('/shop')
    revalidatePath('/')
    return { success: true }
  } catch (error: any) {
    console.error('Error deleting category:', error)
    return { success: false, error: error.message }
  }
}
