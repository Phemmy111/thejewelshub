export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero placeholder — replaced in Phase 4 with dynamic slider */}
      <section className="relative w-full h-[60vh] md:h-[80vh] bg-black flex items-center justify-center overflow-hidden">
        <div className="text-center px-6 z-10">
          <p className="text-[var(--color-gold)] text-sm tracking-widest uppercase mb-3 font-sans">
            New Collection
          </p>
          <h1 className="font-display text-4xl md:text-6xl text-white leading-tight max-w-2xl mx-auto">
            Elegance, Crafted for You
          </h1>
          <p className="mt-4 text-white/70 text-base md:text-lg max-w-md mx-auto">
            Premium accessories & jewellery, delivered across Nigeria.
          </p>
          <a
            href="/shop"
            className="mt-8 inline-block bg-[var(--color-gold)] text-black font-semibold px-8 py-3 rounded-full hover:bg-[var(--color-gold-light)] transition-colors"
          >
            Shop Now
          </a>
        </div>
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/40" />
      </section>

      {/* Trust strip */}
      <section className="bg-black text-white py-3">
        <div className="max-w-6xl mx-auto px-4 flex flex-wrap justify-center gap-6 text-sm text-white/80">
          <span>🔒 Secure Paystack Checkout</span>
          <span>🚚 Delivery Across All States</span>
          <span>💬 WhatsApp Support</span>
          <span>✨ Verified Authentic Products</span>
        </div>
      </section>

      {/* Coming soon content — phases 4+ */}
      <section className="max-w-6xl mx-auto px-4 py-20 text-center">
        <h2 className="font-display text-3xl text-[var(--color-foreground)]">
          Store Coming Soon
        </h2>
        <p className="mt-3 text-[var(--color-muted)]">
          Products and collections are being loaded. Check back shortly.
        </p>
      </section>
    </div>
  )
}
