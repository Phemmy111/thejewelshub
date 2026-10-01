import { getProductBySlug } from '@/lib/supabase/storefront'
import { formatPrice } from '@/lib/utils'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { AddToCartButton } from '@/components/product/AddToCartButton'

export const revalidate = 60

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const product = await getProductBySlug(slug)

  if (!product) {
    notFound()
  }

  return (
    <div style={{ backgroundColor: '#F5F4F0', minHeight: '100vh', paddingTop: '100px', paddingBottom: '100px' }}>
      <style>{`
        .btn-cart:hover { background-color: #1A1A1A !important; }
      `}</style>
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        
        {/* Breadcrumb */}
        <div style={{ fontSize: '0.75rem', fontWeight: 500, letterSpacing: '0.05em', color: '#7A7069', marginBottom: '3rem' }}>
          <Link href="/" style={{ transition: 'color 0.2s' }}>Home</Link>
          <span style={{ margin: '0 0.5rem' }}>/</span>
          <Link href="/shop" style={{ transition: 'color 0.2s' }}>Shop</Link>
          <span style={{ margin: '0 0.5rem' }}>/</span>
          <span style={{ color: '#0D0D0D' }}>{product.name}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-20">
          
          {/* Images */}
          <div>
            <div style={{ width: '100%', aspectRatio: '3/4', backgroundColor: '#E8E5DF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(13,13,13,0.3)', fontSize: '1rem' }}>
              Product Image
            </div>
          </div>

          {/* Details */}
          <div style={{ paddingTop: '2rem' }}>
            <p style={{ fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.22em', color: '#B8882C', marginBottom: '1rem' }}>
              {product.categories?.name}
            </p>
            
            <h1 className="font-display font-bold" style={{ fontSize: 'clamp(2rem, 3.5vw, 2.5rem)', color: '#0D0D0D', lineHeight: 1.15, marginBottom: '1rem' }}>
              {product.name}
            </h1>
            
            <p style={{ fontSize: '1.25rem', color: '#0D0D0D', fontWeight: 600, marginBottom: '2rem' }}>
              {formatPrice(product.price_kobo)}
            </p>

            <div style={{ width: '100%', height: '1px', backgroundColor: 'rgba(13,13,13,0.1)', marginBottom: '2rem' }} />

            <div style={{ fontSize: '0.95rem', color: '#7A7069', lineHeight: 1.8, marginBottom: '3rem' }}>
              {product.description}
            </div>

            <AddToCartButton product={product} />
            
            <p style={{ fontSize: '0.75rem', color: '#7A7069', marginTop: '1rem', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
              <span style={{ display: 'inline-block', width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#22c55e' }} />
              Usually ships within 2-3 business days
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
