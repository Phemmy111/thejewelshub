import { getProducts, getCategories, getSliderConfig } from '@/lib/supabase/storefront'
import { Reveal } from '@/components/ui/Reveal'
import Link from 'next/link'
import { formatPrice } from '@/lib/utils'
import { notFound } from 'next/navigation'
import HeroSlider from '@/components/hero/HeroSlider'

export const revalidate = 60

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  
  const [products, categories, sliderConfig] = await Promise.all([
    getProducts(slug),
    getCategories(),
    getSliderConfig(`/shop/category/${slug}`)
  ])

  const currentCategory = categories.find((c: any) => c.slug === slug)

  if (!currentCategory && products.length === 0) {
    notFound()
  }

  return (
    <div style={{ backgroundColor: '#F5F4F0', minHeight: '100vh', paddingBottom: '100px' }}>
      <style>{`
        .cat-pill { padding: 0.5rem 1.25rem; background-color: transparent; border: 1px solid rgba(13,13,13,0.2); color: #0D0D0D; font-size: 0.75rem; font-weight: 600; border-radius: 2px; text-transform: uppercase; letter-spacing: 0.08em; transition: border-color 0.2s; }
        .cat-pill:hover { border-color: #0D0D0D; }
        .cat-pill.active { background-color: #0D0D0D; color: #fff; border-color: #0D0D0D; }
      `}</style>
      
      {sliderConfig && sliderConfig.media && sliderConfig.media.length > 0 && (
        <HeroSlider sliderConfig={sliderConfig} pageContext={{
          eyebrow: currentCategory?.name ? currentCategory.name + ' Collection' : 'Jewellery Collection',
          lines: currentCategory ? ['The', currentCategory.name, 'Edit.'] : ['Our', 'Curated', 'Collection.'],
          highlight: 1,
          sub: currentCategory?.description || 'Discover handpicked pieces crafted for the discerning woman. Uncompromising quality meets timeless design.',
          cta: { href: '/shop/category/' + slug, label: 'Shop ' + (currentCategory?.name || 'Collection') },
          accentX: '65%', accentY: '35%'
        }} />
      )}

      {/* ── HEADER ────────────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-5 sm:px-8 mb-12" style={{ paddingTop: sliderConfig ? '4rem' : '100px' }}>
        <Reveal>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', borderBottom: '1px solid rgba(13,13,13,0.1)', paddingBottom: '2rem' }}>
            <div>
              <p style={{ fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.22em', color: '#B8882C', marginBottom: '0.75rem' }}>Collection</p>
              <h1 className="font-display font-bold" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', color: '#0D0D0D', lineHeight: 1.15 }}>
                {currentCategory?.name || 'Category'}
              </h1>
              {currentCategory?.description && (
                <p style={{ marginTop: '0.75rem', color: '#7A7069', fontSize: '0.9rem' }}>{currentCategory.description}</p>
              )}
            </div>
          </div>
        </Reveal>

        {/* Categories Pills */}
        <Reveal delay={0.1}>
          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem', flexWrap: 'wrap' }}>
            <Link href="/shop" className="cat-pill">
              All
            </Link>
            {categories.map((cat: any) => (
              <Link 
                key={cat.id} 
                href={`/shop/category/${cat.slug}`}
                className={`cat-pill ${cat.slug === slug ? 'active' : ''}`}
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </Reveal>
      </section>

      {/* ── PRODUCT GRID ─────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-5 sm:px-8">
        {products.length === 0 ? (
          <Reveal>
            <div style={{ textAlign: 'center', padding: '6rem 0', color: '#7A7069' }}>
              <p>No products found in this category.</p>
            </div>
          </Reveal>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {products.map((product: any, i: number) => (
              <Reveal key={product.id} delay={0.1 + (i % 4) * 0.1}>
                <Link href={`/shop/${product.slug}`} style={{ display: 'block' }} className="group">
                  <div style={{ position: 'relative', width: '100%', aspectRatio: '3/4', backgroundColor: '#E8E5DF', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(13,13,13,0.2)', fontSize: '0.8rem' }}>
                      No Image
                    </div>
                  </div>
                  <div style={{ marginTop: '1rem' }}>
                    <p style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: '#B8882C', marginBottom: '0.25rem' }}>
                      {product.categories?.name}
                    </p>
                    <h3 className="font-display font-bold" style={{ fontSize: '1.1rem', color: '#0D0D0D', marginBottom: '0.25rem' }}>
                      {product.name}
                    </h3>
                    <p style={{ fontSize: '0.85rem', color: '#7A7069', fontWeight: 500 }}>
                      {formatPrice(product.price_kobo)}
                    </p>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
