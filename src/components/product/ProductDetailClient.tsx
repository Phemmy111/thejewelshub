'use client'

import { useState } from 'react'
import { useCartStore } from '@/store/cart'
import { formatPrice } from '@/lib/utils'
import Link from 'next/link'
import { ChevronLeft, ChevronRight, ShoppingBag, Play } from 'lucide-react'

export default function ProductDetailClient({ product, relatedProducts }: { product: any, relatedProducts: any[] }) {
  const { addItem } = useCartStore()
  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  const [selectedColor, setSelectedColor] = useState<{name: string, hex: string} | null>(null)
  const [addedToCart, setAddedToCart] = useState(false)
  const [activeMediaIdx, setActiveMediaIdx] = useState(0)

  const images: any[] = product.product_images
    ? [...product.product_images].sort((a: any, b: any) => {
        if (a.is_primary) return -1
        if (b.is_primary) return 1
        return (a.display_order || 0) - (b.display_order || 0)
      })
    : []

  const refMedia: any[] = product.reference_media || []
  const sizes: string[] = product.sizes || []
  const colors: {name: string, hex: string}[] = product.colors || []

  // All displayable media: product images first, then reference media
  const allMedia = [
    ...images.map((img: any) => ({ url: img.url, isVideo: false })),
    ...refMedia
  ]

  const handleAddToCart = () => {
    if (sizes.length > 0 && !selectedSize) {
      alert('Please select a size first')
      return
    }
    if (colors.length > 0 && !selectedColor) {
      alert('Please select a colour first')
      return
    }
    addItem({
      productId: product.id,
      name: product.name,
      priceKobo: product.price_kobo,
      quantity: 1,
      image: images[0]?.url,
      size: selectedSize || undefined,
      color: selectedColor?.name || undefined
    })
    setAddedToCart(true)
    setTimeout(() => setAddedToCart(false), 2500)
  }

  const whatsapp = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '2349133115713'
  const waMsg = encodeURIComponent('Hi! I am interested in: ' + product.name + (selectedSize ? ' (Size: ' + selectedSize + ')' : '') + (selectedColor ? ' (Colour: ' + selectedColor.name + ')' : '') + '\n\nLink: ' + (typeof window !== 'undefined' ? window.location.href : ''))

  return (
    <div>
      {/* ── MAIN PRODUCT SECTION ────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-5 sm:px-8" style={{ paddingTop: '120px', paddingBottom: '80px' }}>

        {/* Breadcrumb */}
        <nav style={{ fontSize: '0.72rem', fontWeight: 500, letterSpacing: '0.06em', color: '#7A7069', marginBottom: '3rem', textTransform: 'uppercase' }}>
          <Link href="/" style={{ transition: 'color 0.2s' }} className="hover:text-[#0D0D0D]">Home</Link>
          <span style={{ margin: '0 0.6rem', color: '#C4BCB4' }}>/</span>
          <Link href="/shop" style={{ transition: 'color 0.2s' }} className="hover:text-[#0D0D0D]">Shop</Link>
          {product.categories && (
            <>
              <span style={{ margin: '0 0.6rem', color: '#C4BCB4' }}>/</span>
              <Link href={'/shop/category/' + product.categories.slug} style={{ transition: 'color 0.2s' }} className="hover:text-[#0D0D0D]">
                {product.categories.name}
              </Link>
            </>
          )}
          <span style={{ margin: '0 0.6rem', color: '#C4BCB4' }}>/</span>
          <span style={{ color: '#0D0D0D' }}>{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-20">

          {/* ── LEFT: Media Gallery ─────────────────────────────── */}
          <div>
            {/* Main media display */}
            <div className="relative overflow-hidden rounded-sm" style={{ backgroundColor: '#E8E5DF', aspectRatio: '3/4' }}>
              {allMedia.length > 0 ? (
                allMedia[activeMediaIdx]?.isVideo ? (
                  <video
                    key={activeMediaIdx}
                    src={allMedia[activeMediaIdx].url}
                    controls
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="w-full h-full object-cover"
                  />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    key={activeMediaIdx}
                    src={allMedia[activeMediaIdx].url}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    style={{ transition: 'opacity 0.3s' }}
                  />
                )
              ) : (
                <div className="w-full h-full flex items-center justify-center" style={{ color: 'rgba(13,13,13,0.25)' }}>
                  No image
                </div>
              )}

              {/* Nav arrows */}
              {allMedia.length > 1 && (
                <>
                  <button
                    onClick={() => setActiveMediaIdx((activeMediaIdx - 1 + allMedia.length) % allMedia.length)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center transition-colors"
                    style={{ backgroundColor: 'rgba(255,255,255,0.9)', color: '#0D0D0D' }}
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <button
                    onClick={() => setActiveMediaIdx((activeMediaIdx + 1) % allMedia.length)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center transition-colors"
                    style={{ backgroundColor: 'rgba(255,255,255,0.9)', color: '#0D0D0D' }}
                  >
                    <ChevronRight size={18} />
                  </button>
                </>
              )}

              {/* Counter */}
              {allMedia.length > 1 && (
                <div className="absolute bottom-4 right-4 text-xs font-mono" style={{ color: 'rgba(255,255,255,0.9)', backgroundColor: 'rgba(0,0,0,0.4)', padding: '2px 8px', borderRadius: '20px' }}>
                  {activeMediaIdx + 1} / {allMedia.length}
                </div>
              )}
            </div>

            {/* Thumbnail strip */}
            {allMedia.length > 1 && (
              <div className="flex gap-2 mt-3 flex-wrap">
                {allMedia.map((m: any, i: number) => (
                  <button
                    key={i}
                    onClick={() => setActiveMediaIdx(i)}
                    className="relative overflow-hidden rounded flex-shrink-0"
                    style={{
                      width: '64px', height: '80px',
                      backgroundColor: '#E8E5DF',
                      border: i === activeMediaIdx ? '2px solid #B8882C' : '2px solid transparent',
                      transition: 'border-color 0.2s'
                    }}
                  >
                    {m.isVideo ? (
                      <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: '#1A1A1A' }}>
                        <Play size={16} style={{ color: '#B8882C' }} />
                      </div>
                    ) : (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={m.url} alt="" className="w-full h-full object-cover" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── RIGHT: Product Details ───────────────────────────── */}
          <div style={{ paddingTop: '0.5rem' }}>

            {/* Category tag */}
            <p style={{ fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.28em', color: '#B8882C', marginBottom: '1rem' }}>
              {product.categories?.name}
            </p>

            {/* Name */}
            <h1 className="font-display font-bold" style={{ fontSize: 'clamp(2rem, 3.5vw, 2.75rem)', color: '#0D0D0D', lineHeight: 1.1, marginBottom: '1.25rem' }}>
              {product.name}
            </h1>

            {/* Pricing */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
              <span style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0D0D0D', fontFamily: 'monospace' }}>
                {formatPrice(product.price_kobo)}
              </span>
              {product.compare_at_price_kobo && product.compare_at_price_kobo > product.price_kobo && (
                <span style={{ fontSize: '1rem', color: '#A19D98', textDecoration: 'line-through', fontFamily: 'monospace' }}>
                  {formatPrice(product.compare_at_price_kobo)}
                </span>
              )}
              {product.compare_at_price_kobo && product.compare_at_price_kobo > product.price_kobo && (
                <span style={{ fontSize: '0.7rem', fontWeight: 700, backgroundColor: '#B8882C', color: '#fff', padding: '2px 8px', borderRadius: '2px', letterSpacing: '0.05em' }}>
                  SALE
                </span>
              )}
            </div>

            <div style={{ width: '100%', height: '1px', backgroundColor: 'rgba(13,13,13,0.1)', marginBottom: '2rem' }} />

            {/* Description */}
            {product.description && (
              <div style={{ fontSize: '0.95rem', color: '#5A5550', lineHeight: 1.85, marginBottom: '2rem' }}>
                {product.description}
              </div>
            )}

            {/* Sizes */}
            {sizes.length > 0 && (
              <div style={{ marginBottom: '2rem' }}>
                <p style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.18em', color: '#0D0D0D', marginBottom: '0.875rem' }}>
                  Size
                  {selectedSize && <span style={{ fontWeight: 400, color: '#B8882C', textTransform: 'none', letterSpacing: 0, marginLeft: '0.5rem' }}>— {selectedSize}</span>}
                </p>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {sizes.map((size: string) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size === selectedSize ? null : size)}
                      style={{
                        padding: '0.5rem 1rem',
                        border: size === selectedSize ? '2px solid #0D0D0D' : '1px solid rgba(13,13,13,0.2)',
                        backgroundColor: size === selectedSize ? '#0D0D0D' : 'transparent',
                        color: size === selectedSize ? '#fff' : '#0D0D0D',
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        borderRadius: '2px',
                        transition: 'all 0.15s',
                        minWidth: '48px',
                        textAlign: 'center'
                      }}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Colours */}
            {colors.length > 0 && (
              <div style={{ marginBottom: '2rem' }}>
                <p style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.18em', color: '#0D0D0D', marginBottom: '0.875rem' }}>
                  Colour
                  {selectedColor && <span style={{ fontWeight: 400, color: '#B8882C', textTransform: 'none', letterSpacing: 0, marginLeft: '0.5rem' }}>— {selectedColor.name}</span>}
                </p>
                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                  {colors.map((c, i) => {
                    const isSelected = selectedColor?.hex === c.hex
                    return (
                      <button
                        key={i}
                        title={c.name}
                        onClick={() => setSelectedColor(isSelected ? null : c)}
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '50%',
                          backgroundColor: c.hex,
                          border: isSelected ? '2px solid #B8882C' : '2px solid rgba(13,13,13,0.15)',
                          cursor: 'pointer',
                          outline: 'none',
                          boxShadow: isSelected ? '0 0 0 2px rgba(184,136,44,0.3)' : 'none',
                          transition: 'border-color 0.2s, box-shadow 0.2s',
                        }}
                      />
                    )
                  })}
                </div>
              </div>
            )}

            {/* Stock indicator */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
              <div style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: product.stock_quantity > 0 ? '#22c55e' : '#ef4444', flexShrink: 0 }} />
              <span style={{ fontSize: '0.78rem', color: '#7A7069', fontWeight: 500 }}>
                {product.stock_quantity > 10 ? 'In Stock' : product.stock_quantity > 0 ? 'Only ' + product.stock_quantity + ' left' : 'Out of Stock'}
              </span>
            </div>

            {/* CTA Buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem' }}>
              <button
                onClick={handleAddToCart}
                disabled={product.stock_quantity === 0}
                style={{
                  width: '100%',
                  padding: '1.1rem',
                  backgroundColor: addedToCart ? '#22c55e' : '#0D0D0D',
                  color: '#fff',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  border: 'none',
                  cursor: product.stock_quantity === 0 ? 'not-allowed' : 'pointer',
                  transition: 'background-color 0.25s',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  opacity: product.stock_quantity === 0 ? 0.5 : 1
                }}
              >
                <ShoppingBag size={16} />
                {addedToCart ? 'Added to Cart!' : product.stock_quantity === 0 ? 'Out of Stock' : 'Add to Cart'}
              </button>

              <a
                href={'https://wa.me/' + whatsapp + '?text=' + waMsg}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  width: '100%',
                  padding: '1.1rem',
                  backgroundColor: 'transparent',
                  color: '#0D0D0D',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  border: '1.5px solid rgba(13,13,13,0.25)',
                  cursor: 'pointer',
                  transition: 'border-color 0.2s',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem'
                }}
              >
                Enquire on WhatsApp
              </a>
            </div>

            {/* Trust details */}
            <div style={{ borderTop: '1px solid rgba(13,13,13,0.08)', paddingTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
              {[
                { icon: '🔒', text: 'Secure checkout' },
                { icon: '🚚', text: 'Delivery across Nigeria' },
                { icon: '✨', text: 'Authentic & quality-guaranteed' },
              ].map(({ icon, text }) => (
                <div key={text} style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', fontSize: '0.8rem', color: '#7A7069' }}>
                  <span>{icon}</span>
                  <span>{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── REFERENCE MEDIA / GALLERY SECTION ──────────────────── */}
      {refMedia.length > 0 && (
        <section style={{ backgroundColor: '#0D0D0D', padding: '80px 0' }}>
          <div className="max-w-7xl mx-auto px-5 sm:px-8">
            <p style={{ fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.28em', textTransform: 'uppercase', color: '#B8882C', marginBottom: '0.75rem' }}>
              Gallery
            </p>
            <h2 className="font-display font-bold" style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', color: '#fff', marginBottom: '3rem' }}>
              See it up close.
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {refMedia.map((m: any, i: number) => (
                <div
                  key={i}
                  onClick={() => setActiveMediaIdx(images.length + i)}
                  className="relative overflow-hidden cursor-pointer group"
                  style={{ aspectRatio: '1/1', backgroundColor: '#1A1A1A', borderRadius: '4px' }}
                >
                  {m.isVideo ? (
                    <>
                      <video src={m.url} muted playsInline className="w-full h-full object-cover" />
                      <div className="absolute inset-0 flex items-center justify-center" style={{ backgroundColor: 'rgba(0,0,0,0.3)' }}>
                        <Play size={28} style={{ color: '#B8882C' }} />
                      </div>
                    </>
                  ) : (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={m.url} alt={m.caption || product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  )}
                  {m.caption && (
                    <div className="absolute bottom-0 left-0 right-0 p-3" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)' }}>
                      <p style={{ color: '#fff', fontSize: '0.75rem', fontWeight: 500 }}>{m.caption}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── RELATED PRODUCTS ────────────────────────────────────── */}
      {relatedProducts.length > 0 && (
        <section style={{ backgroundColor: '#F5F4F0', padding: '80px 0' }}>
          <div className="max-w-7xl mx-auto px-5 sm:px-8">
            <p style={{ fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.28em', textTransform: 'uppercase', color: '#B8882C', marginBottom: '0.75rem' }}>
              You Might Also Like
            </p>
            <h2 className="font-display font-bold" style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', color: '#0D0D0D', marginBottom: '2.5rem' }}>
              More from the collection.
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              {relatedProducts.map((rel: any) => {
                const relPrimary = rel.product_images?.find((img: any) => img.is_primary) || rel.product_images?.[0]
                return (
                  <Link key={rel.id} href={'/shop/' + rel.slug} style={{ display: 'block' }} className="group">
                    <div style={{ position: 'relative', width: '100%', aspectRatio: '3/4', backgroundColor: '#E8E5DF', overflow: 'hidden', marginBottom: '1rem' }}>
                      {relPrimary ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={relPrimary.url} alt={rel.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center" style={{ color: 'rgba(13,13,13,0.2)', fontSize: '0.75rem' }}>No Image</div>
                      )}
                    </div>
                    <p style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: '#B8882C', marginBottom: '0.25rem' }}>{rel.categories?.name}</p>
                    <h3 className="font-display font-bold" style={{ fontSize: '1rem', color: '#0D0D0D', marginBottom: '0.25rem' }}>{rel.name}</h3>
                    <p style={{ fontSize: '0.85rem', color: '#7A7069', fontFamily: 'monospace' }}>{formatPrice(rel.price_kobo)}</p>
                  </Link>
                )
              })}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
