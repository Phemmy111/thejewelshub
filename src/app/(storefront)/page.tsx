import Image from 'next/image'
import Link from 'next/link'

export default function HomePage() {
  return (
    <div style={{ backgroundColor: '#F5F4F0' }}>

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section
        className="relative w-full flex items-end md:items-center overflow-hidden"
        style={{ minHeight: '100vh', background: '#0D0D0D' }}
      >
        {/* Background texture — diagonal gold rule */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `repeating-linear-gradient(
              -45deg,
              #B8882C 0px,
              #B8882C 1px,
              transparent 1px,
              transparent 60px
            )`,
          }}
        />

        {/* Large faded JH monogram watermark */}
        <div
          className="absolute right-0 top-0 bottom-0 w-[55%] md:w-[50%] flex items-center justify-center pointer-events-none select-none"
          style={{ opacity: 0.06 }}
        >
          <Image
            src="/brand/logo.jpg"
            alt=""
            fill
            className="object-contain object-right"
            style={{ filter: 'invert(1)' }}
          />
        </div>

        {/* Gradient overlay — fades right side */}
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(90deg, rgba(13,13,13,0.96) 0%, rgba(13,13,13,0.7) 55%, rgba(13,13,13,0.2) 100%)',
          }}
        />

        {/* Content */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-5 sm:px-8 pb-24 md:pb-0 pt-36 md:pt-0">
          <div className="max-w-xl">
            {/* Gold rule */}
            <div className="flex items-center gap-4 mb-8">
              <span style={{ display: 'block', width: '40px', height: '1px', backgroundColor: '#B8882C' }} />
              <span
                className="text-xs font-medium tracking-[0.25em] uppercase"
                style={{ color: '#B8882C' }}
              >
                New Collection
              </span>
            </div>

            {/* Headline */}
            <h1
              className="font-display font-bold leading-[1.08]"
              style={{
                fontSize: 'clamp(2.8rem, 6vw, 5.5rem)',
                color: '#FFFFFF',
                letterSpacing: '-0.01em',
              }}
            >
              Wear What
              <br />
              <em style={{ color: '#B8882C', fontStyle: 'italic' }}>Speaks</em>
              <br />
              for You.
            </h1>

            {/* Sub */}
            <p
              className="mt-6 leading-relaxed max-w-sm"
              style={{ color: 'rgba(255,255,255,0.60)', fontSize: '1.05rem' }}
            >
              Curated jewellery &amp; accessories, sourced for the bold and the elegant.
              Fast delivery across all 36 Nigerian states.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 mt-10">
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 px-8 py-4 font-semibold text-sm tracking-wide transition-all duration-200"
                style={{
                  backgroundColor: '#B8882C',
                  color: '#FFFFFF',
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                }}
                onMouseEnter={e => ((e.currentTarget as HTMLAnchorElement).style.backgroundColor = '#D4A84B')}
                onMouseLeave={e => ((e.currentTarget as HTMLAnchorElement).style.backgroundColor = '#B8882C')}
              >
                Shop the Collection
              </Link>
              <Link
                href="/jewels"
                className="inline-flex items-center gap-2 px-8 py-4 font-semibold text-sm tracking-wide transition-all duration-200"
                style={{
                  border: '1px solid rgba(255,255,255,0.3)',
                  color: 'rgba(255,255,255,0.85)',
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                }}
              >
                View Jewels
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom scroll cue */}
        <div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          style={{ color: 'rgba(255,255,255,0.3)' }}
        >
          <span style={{ fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase' }}>Scroll</span>
          <span style={{ display: 'block', width: '1px', height: '40px', backgroundColor: 'rgba(255,255,255,0.2)' }} />
        </div>
      </section>

      {/* ── TRUST STRIP ──────────────────────────────────────────────────── */}
      <section style={{ backgroundColor: '#0D0D0D', borderTop: '1px solid rgba(184,136,44,0.3)' }}>
        <div
          className="max-w-6xl mx-auto px-5 sm:px-8 py-4 flex flex-wrap justify-center gap-8"
          style={{ fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.45)' }}
        >
          {[
            'Secure Paystack Checkout',
            'Delivery Across All 36 States',
            'WhatsApp Customer Support',
            'Authentic Products Guaranteed',
          ].map(item => (
            <span key={item} className="flex items-center gap-2">
              <span style={{ display: 'inline-block', width: '4px', height: '4px', borderRadius: '50%', backgroundColor: '#B8882C', flexShrink: 0 }} />
              {item}
            </span>
          ))}
        </div>
      </section>

      {/* ── SECTIONS ─────────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-5 sm:px-8 py-24">
        {/* Section header */}
        <div className="flex items-end justify-between mb-12">
          <div>
            <p
              className="text-xs font-medium uppercase tracking-[0.2em] mb-3"
              style={{ color: '#B8882C' }}
            >
              Explore
            </p>
            <h2
              className="font-display font-bold"
              style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)', color: '#0D0D0D', lineHeight: 1.15 }}
            >
              Shop by Category
            </h2>
          </div>
          <Link
            href="/shop"
            className="hidden md:inline-flex text-sm font-medium pb-0.5"
            style={{ color: '#B8882C', borderBottom: '1px solid #B8882C' }}
          >
            View All →
          </Link>
        </div>

        {/* Category grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Jewels', sub: 'Rings · Necklaces · Sets', href: '/jewels', bg: '#1A1510' },
            { label: 'Earrings', sub: 'Studs · Drops · Hoops', href: '/jewels/earrings', bg: '#141410' },
            { label: 'Accessories', sub: 'Watches · Sunglasses', href: '/accessories', bg: '#101414' },
            { label: 'Bracelets', sub: 'Bangles · Chains', href: '/jewels/bracelets', bg: '#141014' },
          ].map(cat => (
            <Link
              key={cat.label}
              href={cat.href}
              className="group relative overflow-hidden flex flex-col justify-end"
              style={{ background: cat.bg, aspectRatio: '3/4', padding: '1.5rem' }}
            >
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ background: 'linear-gradient(to top, rgba(184,136,44,0.15), transparent)' }}
              />
              <div
                className="absolute bottom-0 left-0 h-[2px] w-0 group-hover:w-full transition-all duration-400"
                style={{ backgroundColor: '#B8882C' }}
              />
              <div className="relative z-10">
                <h3
                  className="font-display font-bold text-white leading-tight"
                  style={{ fontSize: 'clamp(1.1rem, 2vw, 1.4rem)' }}
                >
                  {cat.label}
                </h3>
                <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.45)' }}>{cat.sub}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── BRAND STATEMENT ──────────────────────────────────────────────── */}
      <section
        className="py-24 px-5"
        style={{ backgroundColor: '#0D0D0D', position: 'relative', overflow: 'hidden' }}
      >
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `repeating-linear-gradient(
              45deg, #B8882C 0px, #B8882C 1px, transparent 1px, transparent 80px
            )`,
          }}
        />
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <div className="w-12 mx-auto mb-8" style={{ height: '1px', backgroundColor: '#B8882C' }} />
          <blockquote
            className="font-display italic leading-tight"
            style={{
              fontSize: 'clamp(1.6rem, 4vw, 3rem)',
              color: '#FFFFFF',
              letterSpacing: '-0.01em',
            }}
          >
            &ldquo;Every piece tells a story.
            <br />
            <span style={{ color: '#B8882C' }}>What will yours say?</span>&rdquo;
          </blockquote>
          <div className="w-12 mx-auto mt-8" style={{ height: '1px', backgroundColor: '#B8882C' }} />
        </div>
      </section>

      {/* ── NEW ARRIVALS PLACEHOLDER ─────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-5 sm:px-8 py-24">
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.2em] mb-3" style={{ color: '#B8882C' }}>
              Just In
            </p>
            <h2
              className="font-display font-bold"
              style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)', color: '#0D0D0D', lineHeight: 1.15 }}
            >
              New Arrivals
            </h2>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="flex flex-col gap-3">
              <div
                className="w-full"
                style={{ aspectRatio: '3/4', backgroundColor: '#E8E5DF', borderRadius: '2px' }}
              />
              <div>
                <div style={{ width: '70%', height: '14px', backgroundColor: '#E8E5DF', borderRadius: '2px', marginBottom: '6px' }} />
                <div style={{ width: '40%', height: '14px', backgroundColor: '#B8882C22', borderRadius: '2px' }} />
              </div>
            </div>
          ))}
        </div>
        <p className="text-center mt-12 text-sm" style={{ color: '#7A7069' }}>
          Products are being loaded — check back soon or{' '}
          <a href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '2349133115713'}`} style={{ color: '#B8882C', textDecoration: 'underline' }}>
            message us on WhatsApp
          </a>.
        </p>
      </section>

    </div>
  )
}
