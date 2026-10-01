'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Suspense } from 'react'

function ConfirmedContent() {
  const params = useSearchParams()
  const ref = params.get('ref') || ''

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F5F4F0', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
      <div style={{ maxWidth: '520px', width: '100%', textAlign: 'center' }}>

        {/* Gold checkmark */}
        <div style={{ width: '72px', height: '72px', borderRadius: '50%', backgroundColor: 'rgba(184,136,44,0.12)', border: '2px solid #B8882C', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 28px' }}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#B8882C" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>

        <h1 className="font-display font-bold" style={{ fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', color: '#0D0D0D', marginBottom: '12px', lineHeight: 1.2 }}>
          Order Confirmed!
        </h1>

        <p style={{ color: '#7A7069', fontSize: '0.95rem', lineHeight: 1.7, marginBottom: '28px' }}>
          Thank you for shopping with The Jeweller&apos;s Hub. Your payment was successful and we&apos;ve received your order. A confirmation email is on its way to your inbox.
        </p>

        {ref && (
          <div style={{ background: '#fff', border: '1px solid #E8E5DF', borderRadius: '4px', padding: '16px 20px', marginBottom: '32px', textAlign: 'left' }}>
            <p style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#B8882C', margin: '0 0 4px' }}>Payment Reference</p>
            <p style={{ fontFamily: 'monospace', fontSize: '0.9rem', color: '#0D0D0D', margin: 0 }}>{ref}</p>
          </div>
        )}

        <p style={{ fontSize: '0.8rem', color: '#7A7069', marginBottom: '32px' }}>
          We&apos;ll contact you shortly to confirm delivery details. Questions? WhatsApp us at{' '}
          <a href="https://wa.me/2349133115713" target="_blank" rel="noopener noreferrer" style={{ color: '#B8882C', fontWeight: 600 }}>+234 913 311 5713</a>
        </p>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link
            href="/shop"
            style={{ display: 'inline-block', padding: '0.875rem 2rem', backgroundColor: '#0D0D0D', color: '#fff', fontWeight: 700, fontSize: '0.75rem', letterSpacing: '0.12em', textTransform: 'uppercase', textDecoration: 'none', borderRadius: '2px' }}
          >
            Continue Shopping
          </Link>
          <a
            href="https://wa.me/2349133115713"
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: 'inline-block', padding: '0.875rem 2rem', backgroundColor: 'transparent', color: '#B8882C', border: '1px solid #B8882C', fontWeight: 700, fontSize: '0.75rem', letterSpacing: '0.12em', textTransform: 'uppercase', textDecoration: 'none', borderRadius: '2px' }}
          >
            Chat with Us
          </a>
        </div>
      </div>
    </div>
  )
}

export default function OrderConfirmedPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading…</div>}>
      <ConfirmedContent />
    </Suspense>
  )
}
