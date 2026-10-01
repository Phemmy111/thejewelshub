import Image from 'next/image'
import Link from 'next/link'

export default function HomePage() {
  const whatsapp = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '2349133115713'

  return (
    <div style={{ backgroundColor: '#F5F4F0' }}>
      <style>{`
        .hero-btn-primary { background-color: #B8882C; color: #fff; transition: background-color 0.2s; }
        .hero-btn-primary:hover { background-color: #D4A84B; }
        .hero-btn-outline { border: 1px solid rgba(255,255,255,0.3); color: rgba(255,255,255,0.85); transition: border-color 0.2s, color 0.2s; }
        .hero-btn-outline:hover { border-color: rgba(255,255,255,0.7); color: #fff; }
        .cat-tile { background: #1A1510; position: relative; overflow: hidden; display: flex; flex-direction: column; justify-content: flex-end; aspect-ratio: 3/4; padding: 1.5rem; transition: transform 0.3s; }
        .cat-tile:hover { transform: translateY(-2px); }
        .cat-tile::after { content: ''; position: absolute; bottom: 0; left: 0; height: 2px; width: 0; background-color: #B8882C; transition: width 0.35s ease; }
        .cat-tile:hover::after { width: 100%; }
        .cat-tile-overlay { position: absolute; inset: 0; opacity: 0; transition: opacity 0.3s; background: linear-gradient(to top, rgba(184,136,44,0.15), transparent); }
        .cat-tile:hover .cat-tile-overlay { opacity: 1; }
        .footer-link { color: rgba(255,255,255,0.5); transition: color 0.2s; font-size: 0.875rem; }
        .footer-link:hover { color: #fff; }
        .shop-all-link { color: #B8882C; border-bottom: 1px solid #B8882C; transition: opacity 0.2s; }
        .shop-all-link:hover { opacity: 0.7; }
      `}</style>

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section
        style={{ minHeight: '100vh', background: '#0D0D0D', position: 'relative', display: 'flex', alignItems: 'flex-end' }}
        className="md:items-center overflow-hidden"
      >
        {/* Diagonal gold texture */}
        <div className="absolute inset-0" style={{ opacity: 0.04, backgroundImage: 'repeating-linear-gradient(-45deg, #B8882C 0px, #B8882C 1px, transparent 1px, transparent 60px)' }} />

        {/* Faded JH watermark */}
        <div className="absolute right-0 top-0 bottom-0 pointer-events-none select-none" style={{ width: '55%', opacity: 0.06, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Image src="/brand/logo.jpg" alt="" fill className="object-contain object-right" style={{ filter: 'invert(1)' }} />
        </div>

        {/* Gradient */}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(90deg, rgba(13,13,13,0.96) 0%, rgba(13,13,13,0.7) 55%, rgba(13,13,13,0.2) 100%)' }} />

        {/* Content */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-5 sm:px-8 pb-24 md:pb-0 pt-36 md:pt-0">
          <div style={{ maxWidth: '560px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
              <span style={{ display: 'block', width: '40px', height: '1px', backgroundColor: '#B8882C' }} />
              <span style={{ fontSize: '0.7rem', fontWeight: 500, letterSpacing: '0.25em', textTransform: 'uppercase', color: '#B8882C' }}>New Collection</span>
            </div>
            <h1
              className="font-display font-bold"
              style={{ fontSize: 'clamp(2.8rem, 6vw, 5.5rem)', color: '#FFFFFF', lineHeight: 1.08, letterSpacing: '-0.01em' }}
            >
              Wear What<br />
              <em style={{ color: '#B8882C', fontStyle: 'italic' }}>Speaks</em><br />
              for You.
            </h1>
            <p style={{ marginTop: '1.5rem', color: 'rgba(255,255,255,0.6)', fontSize: '1.05rem', lineHeight: 1.7, maxWidth: '380px' }}>
              Curated jewellery &amp; accessories, sourced for the bold and the elegant.
              Fast delivery across all 36 Nigerian states.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '1rem', marginTop: '2.5rem' }}>
              <Link href="/shop" className="hero-btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '1rem 2rem', fontWeight: 600, fontSize: '0.8rem', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                Shop the Collection
              </Link>
              <Link href="/jewels" className="hero-btn-outline" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '1rem 2rem', fontWeight: 600, fontSize: '0.8rem', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                View Jewels
              </Link>
            </div>
          </div>
        </div>

        {/* Scroll cue */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2" style={{ color: 'rgba(255,255,255,0.3)' }}>
          <span style={{ fontSize: '9px', letterSpacing: '0.2em', textTransform: 'uppercase' }}>Scroll</span>
          <span style={{ display: 'block', width: '1px', height: '40px', backgroundColor: 'rgba(255,255,255,0.2)' }} />
        </div>
      </section>

      {/* ── TRUST STRIP ──────────────────────────────────────────────────── */}
      <section style={{ backgroundColor: '#0D0D0D', borderTop: '1px solid rgba(184,136,44,0.3)' }}>
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-4 flex flex-wrap justify-center gap-8"
          style={{ fontSize: '0.7rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)' }}>
          {['Secure Paystack Checkout', 'Delivery Across All 36 States', 'WhatsApp Customer Support', 'Authentic Products Guaranteed'].map(item => (
            <span key={item} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ display: 'inline-block', width: '4px', height: '4px', borderRadius: '50%', backgroundColor: '#B8882C', flexShrink: 0 }} />
              {item}
            </span>
          ))}
        </div>
      </section>

      {/* ── SHOP BY CATEGORY ─────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-5 sm:px-8 py-24">
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '3rem' }}>
          <div>
            <p style={{ fontSize: '0.7rem', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.22em', color: '#B8882C', marginBottom: '0.75rem' }}>Explore</p>
            <h2 className="font-display font-bold" style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)', color: '#0D0D0D', lineHeight: 1.15 }}>Shop by Category</h2>
          </div>
          <Link href="/shop" className="shop-all-link hidden md:inline-flex" style={{ fontSize: '0.85rem', fontWeight: 500, paddingBottom: '2px' }}>View All →</Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Jewels', sub: 'Rings · Necklaces · Sets', href: '/jewels', bg: '#1A1510' },
            { label: 'Earrings', sub: 'Studs · Drops · Hoops', href: '/jewels/earrings', bg: '#141410' },
            { label: 'Accessories', sub: 'Watches · Sunglasses', href: '/accessories', bg: '#101414' },
            { label: 'Bracelets', sub: 'Bangles · Chains', href: '/jewels/bracelets', bg: '#141014' },
          ].map(cat => (
            <Link key={cat.label} href={cat.href} className="cat-tile" style={{ background: cat.bg }}>
              <div className="cat-tile-overlay" />
              <div style={{ position: 'relative', zIndex: 1 }}>
                <h3 className="font-display font-bold text-white" style={{ fontSize: 'clamp(1.1rem, 2vw, 1.4rem)', lineHeight: 1.2 }}>{cat.label}</h3>
                <p style={{ fontSize: '0.72rem', marginTop: '0.3rem', color: 'rgba(255,255,255,0.4)' }}>{cat.sub}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── BRAND STATEMENT ──────────────────────────────────────────────── */}
      <section style={{ backgroundColor: '#0D0D0D', position: 'relative', overflow: 'hidden', padding: '6rem 1.25rem' }}>
        <div className="absolute inset-0" style={{ opacity: 0.03, backgroundImage: 'repeating-linear-gradient(45deg, #B8882C 0px, #B8882C 1px, transparent 1px, transparent 80px)' }} />
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <div style={{ width: '48px', height: '1px', backgroundColor: '#B8882C', margin: '0 auto 2rem' }} />
          <blockquote className="font-display italic" style={{ fontSize: 'clamp(1.6rem, 4vw, 3rem)', color: '#FFFFFF', lineHeight: 1.3, letterSpacing: '-0.01em' }}>
            &ldquo;Every piece tells a story.<br />
            <span style={{ color: '#B8882C' }}>What will yours say?</span>&rdquo;
          </blockquote>
          <div style={{ width: '48px', height: '1px', backgroundColor: '#B8882C', margin: '2rem auto 0' }} />
        </div>
      </section>

      {/* ── NEW ARRIVALS PLACEHOLDER ─────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-5 sm:px-8 py-24">
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '3rem' }}>
          <div>
            <p style={{ fontSize: '0.7rem', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.22em', color: '#B8882C', marginBottom: '0.75rem' }}>Just In</p>
            <h2 className="font-display font-bold" style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)', color: '#0D0D0D', lineHeight: 1.15 }}>New Arrivals</h2>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i}>
              <div style={{ width: '100%', aspectRatio: '3/4', backgroundColor: '#E8E5DF', borderRadius: '2px' }} />
              <div style={{ marginTop: '0.75rem' }}>
                <div style={{ width: '70%', height: '13px', backgroundColor: '#E8E5DF', borderRadius: '2px', marginBottom: '6px' }} />
                <div style={{ width: '40%', height: '13px', backgroundColor: 'rgba(184,136,44,0.2)', borderRadius: '2px' }} />
              </div>
            </div>
          ))}
        </div>
        <p style={{ textAlign: 'center', marginTop: '3rem', fontSize: '0.875rem', color: '#7A7069' }}>
          Products loading soon —{' '}
          <a href={`https://wa.me/${whatsapp}`} style={{ color: '#B8882C', textDecoration: 'underline' }}>
            message us on WhatsApp
          </a>.
        </p>
      </section>
    </div>
  )
}
