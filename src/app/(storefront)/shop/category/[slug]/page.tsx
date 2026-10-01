import { getProducts, getCategories, getSliderConfig } from '@/lib/supabase/storefront'
import { Reveal } from '@/components/ui/Reveal'
import Link from 'next/link'
import { formatPrice } from '@/lib/utils'
import { notFound } from 'next/navigation'
import HeroSlider from '@/components/hero/HeroSlider'
import { ProductCardActions } from '@/components/product/ProductCardActions'

export const revalidate = 60

// ══════════════════════════════════════════════════════════════════════════════
// DEFAULT HERO SLIDES PER CATEGORY
// All copy is editable via Admin → Media Sliders (add real photos there).
// Until photos are added, each slide renders against a rich dark gradient.
// ══════════════════════════════════════════════════════════════════════════════

const JEWELS_SLIDES = [
  {
    eyebrow: 'Jewels Collection',
    lines: ['Wear the', '*moment*.'],
    sub: 'Rings, necklaces and earrings for the days you want to be remembered.',
    cta: { label: 'Shop Jewels', href: '/shop/category/jewels' },
    accentX: '70%', accentY: '35%',
  },
  {
    eyebrow: 'Everyday Pieces',
    lines: ['Little things', 'that *shine*.'],
    sub: "Everyday earrings, bracelets and anklets you'll reach for again and again.",
    cta: { label: 'Shop Everyday Pieces', href: '/shop/category/jewels' },
    accentX: '30%', accentY: '60%',
  },
  {
    eyebrow: 'Party Jewellery',
    lines: ['Dress up.', 'Own the *room*.'],
    sub: 'Party sets made for weddings, owambes and nights out.',
    cta: { label: 'See Party Sets', href: '/shop/category/jewels' },
    accentX: '65%', accentY: '40%',
  },
  {
    eyebrow: 'Gift Ideas',
    lines: ['A *gift*', "she'll keep."],
    sub: 'Rings, bangles and necklaces ready to wrap.',
    cta: { label: 'Find a Gift', href: '/shop/category/jewels' },
    accentX: '38%', accentY: '55%',
  },
  {
    eyebrow: 'New In',
    lines: ['Just', '*landed*.'],
    sub: 'New pieces this week. Get yours before they sell out.',
    cta: { label: 'See New Arrivals', href: '/shop/category/jewels' },
    accentX: '62%', accentY: '30%',
  },
  {
    eyebrow: 'Jewellery for Every Occasion',
    lines: ['Shine', 'for your'],
    rotatingWords: ['wedding', 'owambe', 'date night', 'Sunday best', 'graduation'],
    sub: 'Jewellery for every occasion.',
    cta: { label: 'Shop Jewels', href: '/shop/category/jewels' },
    accentX: '50%', accentY: '45%',
  },
]

const ACCESSORIES_SLIDES = [
  {
    eyebrow: 'Accessories Collection',
    lines: ['Finish', 'the *look*.'],
    sub: 'Sunglasses, belts and watches that pull any outfit together.',
    cta: { label: 'Shop Accessories', href: '/shop/category/accessories' },
    accentX: '65%', accentY: '40%',
  },
  {
    eyebrow: 'Eyewear',
    lines: ["Sun's out.", '*Shades* on.'],
    sub: 'Frames for the commute, the beach and everything in between.',
    cta: { label: 'Shop Shades', href: '/shop/category/accessories' },
    accentX: '35%', accentY: '55%',
  },
  {
    eyebrow: 'Timepieces',
    lines: ['*Time* looks', 'good on you.'],
    sub: 'Wristwatches for work, weekends and weddings.',
    cta: { label: 'Shop Watches', href: '/shop/category/accessories' },
    accentX: '70%', accentY: '30%',
  },
  {
    eyebrow: 'Belts & Straps',
    lines: ['The *belt*', 'makes the outfit.'],
    sub: 'Clean lines, strong buckles, easy to style.',
    cta: { label: 'Shop Belts', href: '/shop/category/accessories' },
    accentX: '40%', accentY: '62%',
  },
]

const WATCHES_SLIDES = [
  {
    eyebrow: 'Timepieces',
    lines: ['*Time* looks', 'good on you.'],
    sub: 'Wristwatches for work, weekends and weddings.',
    cta: { label: 'Shop Watches', href: '/shop/category/watches' },
    accentX: '68%', accentY: '35%',
  },
  {
    eyebrow: 'New Arrivals',
    lines: ['Precision.', '*Style*.', 'Statement.'],
    sub: 'Every wrist tells a story. Make yours worth reading.',
    cta: { label: 'Explore Watches', href: '/shop/category/watches' },
    accentX: '32%', accentY: '58%',
  },
]

const RINGS_SLIDES = [
  {
    eyebrow: 'Rings Collection',
    lines: ['A *ring*', 'that speaks.'],
    sub: 'Stacking rings, statement pieces and promise sets — all handpicked.',
    cta: { label: 'Shop Rings', href: '/shop/category/rings' },
    accentX: '65%', accentY: '38%',
  },
  {
    eyebrow: 'Gift Ideas',
    lines: ['The *ring*', "she's been waiting for."],
    sub: 'Find the perfect ring for someone special.',
    cta: { label: 'Find a Gift', href: '/shop/category/rings' },
    accentX: '35%', accentY: '58%',
  },
]

const NECKLACES_SLIDES = [
  {
    eyebrow: 'Necklaces',
    lines: ['Close to the', '*heart*.'],
    sub: 'Pendants, chains and layering pieces for every neckline.',
    cta: { label: 'Shop Necklaces', href: '/shop/category/necklaces' },
    accentX: '66%', accentY: '40%',
  },
  {
    eyebrow: 'Layer Up',
    lines: ['One chain', 'is *never* enough.'],
    sub: 'Mix lengths, mix metals, own the look.',
    cta: { label: 'Shop All Necklaces', href: '/shop/category/necklaces' },
    accentX: '34%', accentY: '58%',
  },
]

// Map slug → slides array
const SLIDES_MAP: Record<string, any[]> = {
  jewels: JEWELS_SLIDES,
  accessories: ACCESSORIES_SLIDES,
  watches: WATCHES_SLIDES,
  rings: RINGS_SLIDES,
  necklaces: NECKLACES_SLIDES,
}

function buildSlides(slug: string, name?: string, description?: string): any[] {
  if (SLIDES_MAP[slug]) return SLIDES_MAP[slug]
  // Generic 2-slide fallback for any other category
  const label = name || 'Collection'
  const desc =
    description || 'Handpicked pieces crafted for the discerning woman. Uncompromising quality, timeless design.'
  return [
    {
      eyebrow: label + ' Collection',
      lines: ['The', '*' + label + '*', 'Edit.'],
      sub: desc,
      cta: { label: 'Shop ' + label, href: '/shop/category/' + slug },
      accentX: '66%', accentY: '36%',
    },
    {
      eyebrow: 'New Arrivals',
      lines: ['Fresh.', 'Curated.', 'Just for *You*.'],
      sub: 'Discover the latest additions to our ' + label + ' collection.',
      cta: { label: 'Explore Now', href: '/shop/category/' + slug },
      accentX: '34%', accentY: '60%',
    },
  ]
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  const [products, categories, sliderConfig] = await Promise.all([
    getProducts(slug),
    getCategories(),
    getSliderConfig('/shop/category/' + slug),
  ])

  const currentCategory = categories.find((c: any) => c.slug === slug)

  if (!currentCategory && products.length === 0) {
    notFound()
  }

  const heroSlides = buildSlides(slug, currentCategory?.name, currentCategory?.description)

  return (
    <div style={{ backgroundColor: '#F5F4F0', minHeight: '100vh', paddingBottom: '100px' }}>
      <style>{`
        .cat-pill { padding: 0.5rem 1.25rem; background-color: transparent; border: 1px solid rgba(13,13,13,0.2); color: #0D0D0D; font-size: 0.75rem; font-weight: 600; border-radius: 2px; text-transform: uppercase; letter-spacing: 0.08em; transition: border-color 0.2s; }
        .cat-pill:hover { border-color: #0D0D0D; }
        .cat-pill.active { background-color: #0D0D0D; color: #fff; border-color: #0D0D0D; }
      `}</style>

      {/* Hero — always visible.
          Uses real images from Admin Media Sliders when uploaded,
          otherwise falls back to rich gradient-per-slide. */}
      <HeroSlider sliderConfig={sliderConfig} pageContext={heroSlides} />

      {/* ── HEADER ─────────────────────────────────────────────────────────── */}
      <section
        className="max-w-7xl mx-auto px-5 sm:px-8 mb-12"
        style={{ paddingTop: '4rem' }}
      >
        <Reveal>
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              borderBottom: '1px solid rgba(13,13,13,0.1)',
              paddingBottom: '2rem',
            }}
          >
            <div>
              <p
                style={{
                  fontSize: '0.7rem',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.22em',
                  color: '#B8882C',
                  marginBottom: '0.75rem',
                }}
              >
                Collection
              </p>
              <h1
                className="font-display font-bold"
                style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', color: '#0D0D0D', lineHeight: 1.15 }}
              >
                {currentCategory?.name || 'Category'}
              </h1>
              {currentCategory?.description && (
                <p style={{ marginTop: '0.75rem', color: '#7A7069', fontSize: '0.9rem' }}>
                  {currentCategory.description}
                </p>
              )}
            </div>
          </div>
        </Reveal>

        {/* Category filter pills */}
        <Reveal delay={0.1}>
          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem', flexWrap: 'wrap' }}>
            <Link href="/shop" className="cat-pill">All</Link>
            {categories.map((cat: any) => (
              <Link
                key={cat.id}
                href={'/shop/category/' + cat.slug}
                className={'cat-pill' + (cat.slug === slug ? ' active' : '')}
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </Reveal>
      </section>

      {/* ── PRODUCT GRID ───────────────────────────────────────────────────── */}
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
                <Link href={'/shop/' + product.slug} style={{ display: 'block' }} className="group">
                  <div
                    style={{
                      position: 'relative',
                      width: '100%',
                      aspectRatio: '3/4',
                      backgroundColor: '#E8E5DF',
                      overflow: 'hidden',
                    }}
                  >
                    <ProductCardActions product={product} />
                    {(() => {
                      const img =
                        product.product_images?.find((x: any) => x.is_primary) ||
                        product.product_images?.[0]
                      return img ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={img.url}
                          alt={product.name}
                          style={{
                            position: 'absolute',
                            inset: 0,
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            transition: 'transform 0.5s ease',
                          }}
                          className="group-hover:scale-105"
                        />
                      ) : (
                        <div
                          style={{
                            position: 'absolute',
                            inset: 0,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'rgba(13,13,13,0.2)',
                            fontSize: '0.8rem',
                          }}
                        >
                          No Image
                        </div>
                      )
                    })()}
                  </div>
                  <div style={{ marginTop: '1rem' }}>
                    <p
                      style={{
                        fontSize: '0.65rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.15em',
                        color: '#B8882C',
                        marginBottom: '0.25rem',
                      }}
                    >
                      {product.categories?.name}
                    </p>
                    <h3
                      className="font-display font-bold"
                      style={{ fontSize: '1.1rem', color: '#0D0D0D', marginBottom: '0.25rem' }}
                    >
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
