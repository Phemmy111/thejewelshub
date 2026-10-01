import Link from 'next/link'
import HeroSlider from '@/components/hero/HeroSlider'
import { Reveal } from '@/components/ui/Reveal'

export default function HomePage() {
  const whatsapp = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '2349133115713'

  return (
    <div style={{ backgroundColor: '#F5F4F0' }}>
      <style>{`
        .cat-tile { background: #E8E5DF; position: relative; overflow: hidden; display: flex; flex-direction: column; justify-content: flex-end; aspect-ratio: 3/4; padding: 1.5rem; transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s; border: 1px solid rgba(184,136,44,0.1); border-radius: 4px; }
        .cat-tile:hover { transform: translateY(-4px); box-shadow: 0 12px 24px -10px rgba(13,13,13,0.1); }
        .cat-tile::after { content: ''; position: absolute; bottom: 0; left: 0; height: 3px; width: 0; background-color: #B8882C; transition: width 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
        .cat-tile:hover::after { width: 100%; }
        .cat-tile-overlay { position: absolute; inset: 0; opacity: 0; transition: opacity 0.4s; background: linear-gradient(to top, rgba(184,136,44,0.08), transparent); }
        .cat-tile:hover .cat-tile-overlay { opacity: 1; }
        .shop-all-link { color: #B8882C; border-bottom: 1px solid #B8882C; transition: opacity 0.2s; }
        .shop-all-link:hover { opacity: 0.7; }
        .arrival-card { transition: transform 0.4s; cursor: pointer; }
        .arrival-card:hover { transform: translateY(-4px); }
      `}</style>

      {/* ── HERO SLIDER ─────────────────────────────────────────────────── */}
      <HeroSlider />

      {/* ── TRUST STRIP ──────────────────────────────────────────────────── */}
      {/* Changed to uniform light ash with dark text */}
      <section style={{ backgroundColor: '#F5F4F0', borderTop: '1px solid rgba(13,13,13,0.06)', borderBottom: '1px solid rgba(13,13,13,0.06)' }}>
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-5 flex flex-wrap justify-center gap-8"
          style={{ fontSize: '0.7rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#7A7069', fontWeight: 600 }}>
          {['Secure Paystack Checkout', 'Delivery Across All 36 States', 'WhatsApp Customer Support', 'Authentic Products Guaranteed'].map((item, i) => (
            <Reveal key={item} delay={i * 0.1}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ display: 'inline-block', width: '4px', height: '4px', borderRadius: '50%', backgroundColor: '#B8882C', flexShrink: 0 }} />
                {item}
              </span>
            </Reveal>
          ))}
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
          {[
            { label: 'Jewels', sub: 'Rings · Necklaces · Sets', href: '/jewels' },
            { label: 'Earrings', sub: 'Studs · Drops · Hoops', href: '/jewels/earrings' },
            { label: 'Accessories', sub: 'Watches · Sunglasses', href: '/accessories' },
            { label: 'Bracelets', sub: 'Bangles · Chains', href: '/jewels/bracelets' },
          ].map((cat, i) => (
            <Reveal key={cat.label} delay={i * 0.1}>
              <Link href={cat.href} className="cat-tile">
                <div className="cat-tile-overlay" />
                <div style={{ position: 'relative', zIndex: 1 }}>
                  <h3 className="font-display font-bold" style={{ fontSize: 'clamp(1.1rem, 2vw, 1.4rem)', color: '#0D0D0D', lineHeight: 1.2 }}>{cat.label}</h3>
                  <p style={{ fontSize: '0.72rem', marginTop: '0.3rem', color: '#7A7069', fontWeight: 500 }}>{cat.sub}</p>
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
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => (
            <Reveal key={i} delay={i * 0.1}>
              <div className="arrival-card">
                <div style={{ width: '100%', aspectRatio: '3/4', backgroundColor: '#E8E5DF', borderRadius: '4px', border: '1px solid rgba(13,13,13,0.05)' }} />
                <div style={{ marginTop: '1rem' }}>
                  <div style={{ width: '70%', height: '13px', backgroundColor: '#E8E5DF', borderRadius: '2px', marginBottom: '8px' }} />
                  <div style={{ width: '40%', height: '13px', backgroundColor: 'rgba(184,136,44,0.2)', borderRadius: '2px' }} />
                </div>
              </div>
            </Reveal>
          ))}
        </div>
        
        <Reveal delay={0.2}>
          <p style={{ textAlign: 'center', marginTop: '4rem', fontSize: '0.875rem', color: '#7A7069', fontWeight: 500 }}>
            Products loading soon —{' '}
            <a href={`https://wa.me/${whatsapp}`} style={{ color: '#B8882C', textDecoration: 'underline', fontWeight: 600 }}>
              message us on WhatsApp
            </a>.
          </p>
        </Reveal>
      </section>
    </div>
  )
}
