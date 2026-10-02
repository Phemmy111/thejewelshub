import { getProductBySlug, getRelatedProducts } from '@/lib/supabase/storefront'
import { notFound } from 'next/navigation'
import ProductDetailClient from '@/components/product/ProductDetailClient'
import ProductReviews from '@/components/product/ProductReviews'
import { createAdminClient } from '@/lib/supabase/server'

export const revalidate = 60

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const product = await getProductBySlug(slug)

  if (!product) notFound()

  const supabase = await createAdminClient()
  const { data: reviews } = await supabase
    .from('reviews')
    .select('id, rating, comment, customer_name, created_at')
    .eq('product_id', product.id)
    .eq('is_approved', true)
    .order('created_at', { ascending: false })

  const relatedProducts = await getRelatedProducts(product.categories?.slug || '', product.slug)

  return (
    <>
      <ProductDetailClient product={product} relatedProducts={relatedProducts} />
      <ProductReviews reviews={reviews || []} productId={product.id} />
    </>
  )
}
