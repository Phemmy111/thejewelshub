import Link from 'next/link'

const footerLinks = {
  Shop: [
    { href: '/shop', label: 'All Products' },
    { href: '/accessories', label: 'Accessories' },
    { href: '/jewels', label: 'Jewels' },
    { href: '/new-arrivals', label: 'New Arrivals' },
  ],
  Help: [
    { href: '/delivery', label: 'Delivery & Returns' },
    { href: '/faq', label: 'FAQ' },
    { href: '/contact', label: 'Contact Us' },
  ],
  Legal: [
    { href: '/privacy', label: 'Privacy Policy' },
    { href: '/terms', label: 'Terms & Conditions' },
  ],
}

export default function Footer() {
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '2349133115713'

  return (
    <footer className="bg-black text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14 grid grid-cols-2 md:grid-cols-4 gap-10">
        {/* Brand */}
        <div className="col-span-2 md:col-span-1">
          <span className="font-display text-2xl font-bold text-[var(--color-gold)]">
            The Jeweller&apos;s Hub
          </span>
          <p className="mt-3 text-white/60 text-sm leading-relaxed max-w-xs">
            Premium accessories & jewellery, handpicked and delivered with love across Nigeria.
          </p>
          <div className="mt-5 flex gap-4">
            <a
              href={`https://wa.me/${whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--color-gold)] hover:text-[var(--color-gold-light)] text-sm font-medium transition-colors"
            >
              WhatsApp Us
            </a>
          </div>
        </div>

        {/* Link groups */}
        {Object.entries(footerLinks).map(([group, links]) => (
          <div key={group}>
            <h3 className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-4">
              {group}
            </h3>
            <ul className="space-y-2.5">
              {links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/70 hover:text-[var(--color-gold)] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-white/40">
          <span>© {new Date().getFullYear()} The Jeweller&apos;s Hub. All rights reserved.</span>
          <span>Secure payments by Paystack 🔒</span>
        </div>
      </div>
    </footer>
  )
}
