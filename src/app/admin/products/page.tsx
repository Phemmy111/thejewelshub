import { getAdminProducts, getAdminCategories } from './actions'
import ProductManagerClient from '@/components/admin/ProductManagerClient'

export const dynamic = 'force-dynamic'

export default async function AdminProductsPage() {
  const [products, categories] = await Promise.all([
    getAdminProducts(),
    getAdminCategories()
  ])

  return <ProductManagerClient initialProducts={products} categories={categories} />
}
