import Image from 'next/image'
import Link from 'next/link'

const footerLinks = {
  Shop: [
    { href: '/shop', label: 'All Products' },
    { href: '/shop/category/accessories', label: 'Accessories' },
    { href: '/shop/category/jewels', label: 'Jewels' },
    { href: '/shop', label: 'New Arrivals' },
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
  const whatsapp = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '2349133115713'

  return (
    <footer style={{ backgroundColor: '#080808', color: 'rgba(255,255,255,0.6)' }}>
      {/* Gold top border */}
      <div style={{ height: '1px', background: 'linear-gradient(90deg, transparent, #B8882C 30%, #B8882C 70%, transparent)' }} />

      <div className="max-w-7xl mx-auto px-5 sm:px-8 pt-16 pb-8">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10 mb-16">

          {/* Brand column */}
          <div className="col-span-2">
            <div className="flex items-center gap-3 mb-5">
              <div className="relative w-10 h-10 flex-shrink-0">
                <Image src="/brand/logo.jpg" alt="The Jeweller's Hub" fill className="object-contain" />
              </div>
              <span className="font-display text-lg font-bold" style={{ color: '#FFFFFF' }}>
                The Jeweller&apos;s Hub
              </span>
            </div>
            <p className="text-sm leading-relaxed max-w-xs" style={{ color: 'rgba(255,255,255,0.45)' }}>
              Premium accessories &amp; jewellery, handpicked and delivered with care across all 36 Nigerian states.
            </p>
            <a
              href={`https://wa.me/${whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-6 text-sm font-medium transition-colors"
              style={{ color: '#B8882C' }}
            >
              <span style={{ display: 'inline-block', width: '16px', height: '1px', backgroundColor: '#B8882C' }} />
              Chat on WhatsApp
            </a>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([group, links]) => (
            <div key={group}>
              <h4
                className="text-xs font-semibold uppercase mb-5"
                style={{ color: '#B8882C', letterSpacing: '0.15em' }}
              >
                {group}
              </h4>
              <ul className="space-y-3">
                {links.map(link => (
                  <li key={link.href}>
                    <Link href={link.href} className="footer-link">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div
          className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-6"
          style={{ borderTop: '1px solid rgba(255,255,255,0.07)', fontSize: '0.72rem', letterSpacing: '0.05em', color: 'rgba(255,255,255,0.25)' }}
        >
          <span>© {new Date().getFullYear()} The Jeweller&apos;s Hub. All rights reserved.</span>
          <span style={{ color: 'rgba(184,136,44,0.6)' }}>Powered by Paystack · Secured by Clerk</span>
        </div>
      </div>
    </footer>
  )
}
