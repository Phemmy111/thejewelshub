export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero — replaced in Phase 4 with dynamic slider */}
      <section className="relative w-full bg-black flex items-center justify-center overflow-hidden" style={{ minHeight: '80vh' }}>
        <div className="text-center px-6 z-10">
          <p style={{ color: '#C9A84C', fontSize: '0.75rem', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
            New Collection
          </p>
          <h1 className="font-display text-4xl md:text-6xl text-white leading-tight max-w-2xl mx-auto">
            Elegance, Crafted for You
          </h1>
          <p className="mt-4 text-lg max-w-md mx-auto" style={{ color: 'rgba(255,255,255,0.7)' }}>
            Premium accessories &amp; jewellery, delivered across Nigeria.
          </p>
          <a
            href="/shop"
            className="mt-8 inline-block font-semibold px-8 py-3 rounded-full transition-colors"
            style={{ backgroundColor: '#C9A84C', color: '#111111', marginTop: '2rem', display: 'inline-block' }}
          >
            Shop Now
          </a>
        </div>
        <div className="absolute inset-0" style={{ backgroundColor: 'rgba(0,0,0,0.4)' }} />
      </section>

      {/* Trust strip */}
      <section className="bg-black text-white py-3">
        <div className="max-w-6xl mx-auto px-4 flex flex-wrap justify-center gap-6 text-sm" style={{ color: 'rgba(255,255,255,0.8)' }}>
          <span>🔒 Secure Paystack Checkout</span>
          <span>🚚 Delivery Across All States</span>
          <span>💬 WhatsApp Support</span>
          <span>✨ Verified Authentic Products</span>
        </div>
      </section>

      {/* Coming soon */}
      <section className="max-w-6xl mx-auto px-4 py-20 text-center">
        <h2 className="font-display text-3xl">Store Coming Soon</h2>
        <p className="mt-3" style={{ color: '#6B7280' }}>
          Products and collections are being loaded. Check back shortly.
        </p>
      </section>
    </div>
  )
}
