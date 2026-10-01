'use client'

import { useState, useEffect } from 'react'
import { useCartStore, CartItem } from '@/store/cart'
import { formatPrice } from '@/lib/utils'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { verifyAndSaveOrder } from './actions'

declare global {
  interface Window {
    PaystackPop: any
  }
}

export default function CheckoutClient() {
  const { items, clearCart } = useCartStore()
  const [mounted, setMounted] = useState(false)
  const router = useRouter()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => { setMounted(true) }, [])

  const subtotal = items.reduce((sum: number, i: CartItem) => sum + i.priceKobo * i.quantity, 0)
  const total = subtotal // extend with delivery fee later if needed

  const inputCls = 'w-full border border-[#E8E5DF] rounded bg-white px-4 py-3 text-sm text-[#0D0D0D] focus:outline-none transition-colors'

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault()
    if (items.length === 0) { setError('Your cart is empty.'); return }
    setError('')
    setIsProcessing(true)

    try {
      // Load Paystack inline script if not already loaded
      if (!window.PaystackPop) {
        await new Promise<void>((resolve, reject) => {
          const script = document.createElement('script')
          script.src = 'https://js.paystack.co/v1/inline.js'
          script.onload = () => resolve()
          script.onerror = () => reject(new Error('Could not load Paystack'))
          document.head.appendChild(script)
        })
      }

      const handler = window.PaystackPop.setup({
        key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY,
        email,
        amount: total, // already in kobo
        currency: 'NGN',
        ref: 'TJH-' + Date.now() + '-' + Math.random().toString(36).slice(2, 7).toUpperCase(),
        metadata: {
          custom_fields: [
            { display_name: 'Customer Name', variable_name: 'customer_name', value: name },
            { display_name: 'Phone', variable_name: 'phone', value: phone },
          ],
        },
        callback: async (response: { reference: string }) => {
          try {
            const result = await verifyAndSaveOrder({
              reference: response.reference,
              customerName: name,
              customerEmail: email,
              customerPhone: phone,
              deliveryAddress: address,
              items: items.map((i: CartItem) => ({
                productId: i.productId,
                name: i.name,
                priceKobo: i.priceKobo,
                quantity: i.quantity,
                image: i.image,
                size: i.size,
                color: i.color,
              })),
              totalKobo: total,
            })

            if (result.success) {
              clearCart()
              router.push('/order-confirmed?ref=' + response.reference)
            } else {
              setError(result.error || 'Payment was received but order could not be saved. Please contact us.')
              setIsProcessing(false)
            }
          } catch (err: any) {
            setError('Something went wrong after payment: ' + err.message)
            setIsProcessing(false)
          }
        },
        onClose: () => {
          setIsProcessing(false)
        },
      })

      handler.openIframe()
    } catch (err: any) {
      setError(err.message || 'Could not initialise payment.')
      setIsProcessing(false)
    }
  }

  if (!mounted) return null

  if (items.length === 0) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '1rem', backgroundColor: '#F5F4F0' }}>
        <p style={{ color: '#7A7069', fontSize: '1rem' }}>Your cart is empty.</p>
        <Link href="/shop" style={{ color: '#B8882C', fontSize: '0.85rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Continue Shopping</Link>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F5F4F0', paddingTop: '100px', paddingBottom: '80px' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 20px' }}>

        {/* Back link */}
        <Link
          href="/shop"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#7A7069', marginBottom: '2.5rem', textDecoration: 'none' }}
        >
          ← Back to Shop
        </Link>

        <h1 className="font-display font-bold" style={{ fontSize: 'clamp(1.6rem, 3vw, 2.4rem)', color: '#0D0D0D', marginBottom: '2.5rem' }}>
          Checkout
        </h1>

        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,420px)', gap: '3rem', alignItems: 'start' }}>

          {/* ── LEFT: Customer form ──────────────────────────────────────── */}
          <form onSubmit={handlePay}>

            {/* Contact */}
            <section style={{ background: '#fff', borderRadius: '4px', padding: '28px', marginBottom: '20px', border: '1px solid #E8E5DF' }}>
              <h2 style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#B8882C', marginBottom: '20px' }}>Contact Information</h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#7A7069', marginBottom: '6px' }}>Full Name *</label>
                  <input required value={name} onChange={e => setName(e.target.value)} placeholder="Amaka Johnson" className={inputCls} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#7A7069', marginBottom: '6px' }}>Email *</label>
                  <input required type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="amaka@email.com" className={inputCls} />
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#7A7069', marginBottom: '6px' }}>Phone Number *</label>
                  <input required type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+234 800 000 0000" className={inputCls} />
                </div>
              </div>
            </section>

            {/* Delivery */}
            <section style={{ background: '#fff', borderRadius: '4px', padding: '28px', marginBottom: '20px', border: '1px solid #E8E5DF' }}>
              <h2 style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#B8882C', marginBottom: '20px' }}>Delivery Address</h2>
              <div>
                <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#7A7069', marginBottom: '6px' }}>Full Address *</label>
                <textarea
                  required
                  rows={3}
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  placeholder="House no., street, city, state, postal code"
                  className={inputCls}
                  style={{ resize: 'vertical' }}
                />
              </div>
              <p style={{ fontSize: '0.72rem', color: '#7A7069', marginTop: '10px' }}>
                Delivery fee will be communicated after order confirmation.
              </p>
            </section>

            {/* Error */}
            {error && (
              <div style={{ background: '#fee2e2', border: '1px solid #fecaca', borderRadius: '4px', padding: '12px 16px', marginBottom: '20px', color: '#dc2626', fontSize: '0.85rem' }}>
                {error}
              </div>
            )}

            {/* Pay button */}
            <button
              type="submit"
              disabled={isProcessing}
              style={{
                width: '100%',
                padding: '1.1rem',
                backgroundColor: isProcessing ? '#A07020' : '#B8882C',
                color: '#fff',
                border: 'none',
                fontWeight: 700,
                fontSize: '0.85rem',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                cursor: isProcessing ? 'not-allowed' : 'pointer',
                transition: 'background-color 0.2s',
                borderRadius: '2px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
              }}
            >
              {isProcessing ? (
                <>
                  <span style={{ display: 'inline-block', width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.4)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
                  Processing…
                </>
              ) : (
                'Pay ' + formatPrice(total) + ' Securely'
              )}
            </button>

            <p style={{ textAlign: 'center', fontSize: '0.7rem', color: '#7A7069', marginTop: '12px' }}>
              Secured by Paystack · Your card details are never stored
            </p>

            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </form>

          {/* ── RIGHT: Order summary ─────────────────────────────────────── */}
          <div style={{ position: 'sticky', top: '100px' }}>
            <div style={{ background: '#fff', borderRadius: '4px', padding: '28px', border: '1px solid #E8E5DF' }}>
              <h2 style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#B8882C', marginBottom: '20px' }}>Order Summary</h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '20px' }}>
                {items.map((item: CartItem) => (
                  <div key={item.id} style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <div style={{ width: '56px', height: '68px', backgroundColor: '#E8E5DF', flexShrink: 0, borderRadius: '2px', overflow: 'hidden' }}>
                      {item.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : null}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontWeight: 600, fontSize: '0.85rem', color: '#0D0D0D', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</p>
                      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '3px' }}>
                        {item.size && <span style={{ fontSize: '0.68rem', color: '#7A7069' }}>Size: {item.size}</span>}
                        {item.color && <span style={{ fontSize: '0.68rem', color: '#7A7069' }}>· {item.color}</span>}
                        <span style={{ fontSize: '0.68rem', color: '#7A7069' }}>· Qty: {item.quantity}</span>
                      </div>
                    </div>
                    <p style={{ fontWeight: 700, fontSize: '0.85rem', color: '#0D0D0D', margin: 0, flexShrink: 0 }}>{formatPrice(item.priceKobo * item.quantity)}</p>
                  </div>
                ))}
              </div>

              <div style={{ borderTop: '1px solid #E8E5DF', paddingTop: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#7A7069' }}>Subtotal</span>
                  <span style={{ fontWeight: 700, fontSize: '1.1rem', color: '#0D0D0D' }}>{formatPrice(subtotal)}</span>
                </div>
                <p style={{ fontSize: '0.7rem', color: '#7A7069', marginTop: '6px' }}>+ Delivery (confirmed after order)</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
