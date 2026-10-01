import { getProductBySlug, getRelatedProducts } from '@/lib/supabase/storefront'
import { notFound } from 'next/navigation'
import ProductDetailClient from '@/components/product/ProductDetailClient'

export const revalidate = 60

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const product = await getProductBySlug(slug)

  if (!product) {
    notFound()
  }

  const relatedProducts = await getRelatedProducts(product.categories?.slug || '', product.slug)

  return <ProductDetailClient product={product} relatedProducts={relatedProducts} />
}
