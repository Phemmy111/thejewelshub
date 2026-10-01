import Link from 'next/link'
import HeroSlider from '@/components/hero/HeroSlider'
import { Reveal } from '@/components/ui/Reveal'
import { getSliderConfig, getAllSlidersConfig, getProducts } from '@/lib/supabase/storefront'
import { formatPrice } from '@/lib/utils'
import { ProductCardActions } from '@/components/product/ProductCardActions'

export const revalidate = 60 // Revalidate every minute so it updates periodically

export default async function HomePage() {
  const whatsapp = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '2349133115713'
  const [sliderConfig, allSliders, allProducts] = await Promise.all([
    getSliderConfig('/'),
    getAllSlidersConfig(),
    getProducts()
  ])
  const newArrivals = allProducts.slice(0, 4)

  // Helper to extract the first media from a specific slider config
  const getCatMedia = (slug: string, fallback: string) => {
    const customSlider = allSliders.find((s: any) => s.targetPage === `home-cat-${slug}`)
    if (customSlider && customSlider.media && customSlider.media.length > 0) {
      return { url: customSlider.media[0].url, isVideo: customSlider.media[0].isVideo }
    }
    return { url: fallback, isVideo: false }
  }

  const categoryTiles = [
    { label: 'Jewels', slug: 'jewels', sub: 'Rings · Necklaces · Sets', href: '/shop/category/jewels', ...getCatMedia('jewels', 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=800&auto=format&fit=crop') },
    { label: 'Earrings', slug: 'earrings', sub: 'Studs · Drops · Hoops', href: '/shop/category/earrings', ...getCatMedia('earrings', 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=800&auto=format&fit=crop') },
    { label: 'Accessories', slug: 'accessories', sub: 'Watches · Sunglasses', href: '/shop/category/accessories', ...getCatMedia('accessories', 'https://images.unsplash.com/photo-1524592094714-cb9c5e40e698?q=80&w=800&auto=format&fit=crop') },
    { label: 'Bracelets', slug: 'bracelets', sub: 'Bangles · Chains', href: '/shop/category/bracelets', ...getCatMedia('bracelets', 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=800&auto=format&fit=crop') },
  ]

  return (
    <div style={{ backgroundColor: '#F5F4F0' }}>
      <style>{`
        .cat-pill { padding: 0.5rem 1.25rem; background-color: transparent; border: 1px solid rgba(13,13,13,0.2); color: #0D0D0D; font-size: 0.75rem; font-weight: 600; border-radius: 2px; text-transform: uppercase; letter-spacing: 0.08em; transition: border-color 0.2s; }
        .cat-pill:hover { border-color: #0D0D0D; }
        .cat-tile { background: #E8E5DF; position: relative; overflow: hidden; display: flex; flex-direction: column; justify-content: flex-end; aspect-ratio: 3/4; padding: 1.5rem; transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s; border: 1px solid rgba(184,136,44,0.1); border-radius: 4px; }
        .cat-tile:hover { transform: translateY(-4px); box-shadow: 0 12px 24px -10px rgba(13,13,13,0.1); }
        .cat-tile::after { content: ''; position: absolute; bottom: 0; left: 0; height: 3px; width: 0; background-color: #B8882C; transition: width 0.4s cubic-bezier(0.16, 1, 0.3, 1); z-index: 2; }
        .cat-tile:hover::after { width: 100%; }
        .cat-tile-overlay { position: absolute; inset: 0; opacity: 0; transition: opacity 0.4s; background: linear-gradient(to top, rgba(184,136,44,0.08), transparent); z-index: 1; }
        .cat-tile:hover .cat-tile-overlay { opacity: 1; }
        .shop-all-link { color: #B8882C; border-bottom: 1px solid #B8882C; transition: opacity 0.2s; }
        .shop-all-link:hover { opacity: 0.7; }
        .arrival-card { transition: transform 0.4s; cursor: pointer; }
        .arrival-card:hover { transform: translateY(-4px); }
        
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .marquee-container {
          overflow: hidden;
          white-space: nowrap;
          width: 100%;
        }
        .marquee-content {
          display: inline-flex;
          animation: marquee 35s linear infinite;
        }
        .marquee-content:hover {
          animation-play-state: paused;
        }
      `}</style>

      {/* ── HERO SLIDER ─────────────────────────────────────────────────── */}
      <HeroSlider sliderConfig={sliderConfig} />

      {/* ── TRUST STRIP ──────────────────────────────────────────────────── */}
      <section style={{ backgroundColor: '#F5F4F0', borderTop: '1px solid rgba(13,13,13,0.06)', borderBottom: '1px solid rgba(13,13,13,0.06)', padding: '1.25rem 0' }}>
        <div className="marquee-container" style={{ fontSize: '0.7rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#7A7069', fontWeight: 600 }}>
          <div className="marquee-content">
            {/* We duplicate the array 4 times so the scrolling is perfectly endless and seamless */}
            {[...Array(4)].flatMap((_, arrayIndex) => (
              ['Secure Paystack Checkout', 'Delivery Across All 36 States', 'Premium Quality Pieces', 'WhatsApp Customer Support', 'Authentic Products Guaranteed', 'Handcrafted Elegance', '100% Secure Checkout', 'Fast Nationwide Shipping'].map((item, i) => (
                <span key={`${arrayIndex}-${i}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0 2.5rem' }}>
                  <span style={{ display: 'inline-block', width: '4px', height: '4px', borderRadius: '50%', backgroundColor: '#B8882C', flexShrink: 0 }} />
                  {item}
                </span>
              ))
            ))}
          </div>
        </div>
      </section>

      {/* ── SHOP BY CATEGORY ─────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-5 sm:px-8 py-24">
        <Reveal>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '3rem' }}>
            <div>
              <p style={{ fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.22em', color: '#B8882C', marginBottom: '0.75rem' }}>Explore</p>
              <h2 className="font-display font-bold" style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)', color: '#0D0D0D', lineHeight: 1.15 }}>Shop by Category</h2>
            </div>
            <Link href="/shop" className="shop-all-link hidden md:inline-flex" style={{ fontSize: '0.85rem', fontWeight: 600, paddingBottom: '2px' }}>View All →</Link>
          </div>
        </Reveal>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categoryTiles.map((cat, i) => (
            <Reveal key={cat.label} delay={i * 0.1}>
              <Link href={cat.href} className="cat-tile" style={!cat.isVideo ? { backgroundImage: `url(${cat.url})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}>
                {cat.isVideo && (
                  <video src={cat.url} autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover" style={{ zIndex: 0 }} />
                )}
                <div className="cat-tile-overlay" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)' }} />
                <div style={{ position: 'relative', zIndex: 2 }}>
                  <h3 className="font-display font-bold" style={{ fontSize: 'clamp(1.1rem, 2vw, 1.4rem)', color: '#FFFFFF', lineHeight: 1.2 }}>{cat.label}</h3>
                  <p style={{ fontSize: '0.72rem', marginTop: '0.3rem', color: 'rgba(255,255,255,0.8)', fontWeight: 500 }}>{cat.sub}</p>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── BRAND STATEMENT ──────────────────────────────────────────────── */}
      {/* Changed to uniform ash with dark text and gold accents */}
      <section style={{ backgroundColor: '#F5F4F0', position: 'relative', overflow: 'hidden', padding: '6rem 1.25rem', borderTop: '1px solid rgba(13,13,13,0.06)' }}>
        <div className="absolute inset-0" style={{ opacity: 0.05, backgroundImage: 'repeating-linear-gradient(45deg, #B8882C 0px, #B8882C 1px, transparent 1px, transparent 80px)' }} />
        <Reveal>
          <div className="relative z-10 max-w-4xl mx-auto text-center">
            <div style={{ width: '48px', height: '2px', backgroundColor: '#B8882C', margin: '0 auto 2rem' }} />
            <blockquote className="font-display italic" style={{ fontSize: 'clamp(1.6rem, 4vw, 3rem)', color: '#0D0D0D', lineHeight: 1.3, letterSpacing: '-0.01em' }}>
              &ldquo;Every piece tells a story.<br />
              <span style={{ color: '#B8882C' }}>What will yours say?</span>&rdquo;
            </blockquote>
            <div style={{ width: '48px', height: '2px', backgroundColor: '#B8882C', margin: '2rem auto 0' }} />
          </div>
        </Reveal>
      </section>

      {/* ── NEW ARRIVALS PLACEHOLDER ─────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-5 sm:px-8 py-24" style={{ borderTop: '1px solid rgba(13,13,13,0.06)' }}>
        <Reveal>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '3rem' }}>
            <div>
              <p style={{ fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.22em', color: '#B8882C', marginBottom: '0.75rem' }}>Just In</p>
              <h2 className="font-display font-bold" style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)', color: '#0D0D0D', lineHeight: 1.15 }}>New Arrivals</h2>
            </div>
          </div>
        </Reveal>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {newArrivals.map((product: any, i: number) => (
            <Reveal key={product.id} delay={i * 0.1}>
              <Link 
                href={`/shop/${product.slug}`}
                style={{ display: 'block' }}
                className="group arrival-card"
              >
                <div style={{ position: 'relative', width: '100%', aspectRatio: '3/4', backgroundColor: '#E8E5DF', overflow: 'hidden', borderRadius: '4px', border: '1px solid rgba(13,13,13,0.05)' }}>
                  <ProductCardActions product={product} />
                  {(() => {
                    const img = product.product_images?.find((x: any) => x.is_primary) || product.product_images?.[0]
                    return img ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={img.url}
                        alt={product.name}
                        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
                        className="group-hover:scale-105"
                      />
                    ) : (
                      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(13,13,13,0.2)', fontSize: '0.8rem' }}>
                        No Image
                      </div>
                    )
                  })()}
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
        
      </section>
    </div>
  )
}
