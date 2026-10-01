'use client'

import { useCartStore, CartItem } from '@/store/cart'
import { X, Minus, Plus, ShoppingBag } from 'lucide-react'
import { formatPrice } from '@/lib/utils'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export function CartDrawer() {
  const { items, isOpen, setIsOpen, removeItem, updateQuantity } = useCartStore()
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])
  if (!mounted) return null

  const subtotal = items.reduce((total: number, item: CartItem) => total + item.priceKobo * item.quantity, 0)
  const itemCount = items.reduce((total: number, item: CartItem) => total + item.quantity, 0)

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(4px)', zIndex: 50 }}
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Drawer */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          height: '100%',
          width: '100%',
          maxWidth: '420px',
          backgroundColor: '#F5F4F0',
          zIndex: 51,
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '-4px 0 40px rgba(0,0,0,0.15)',
          transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.35s cubic-bezier(0.22,1,0.36,1)',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 24px', borderBottom: '1px solid rgba(13,13,13,0.08)', backgroundColor: '#fff' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ShoppingBag size={18} style={{ color: '#B8882C' }} />
            <h2 className="font-display font-bold" style={{ fontSize: '1.1rem', color: '#0D0D0D', margin: 0 }}>
              Your Cart
            </h2>
            {itemCount > 0 && (
              <span style={{ backgroundColor: '#B8882C', color: '#fff', borderRadius: '20px', padding: '1px 8px', fontSize: '0.7rem', fontWeight: 700 }}>
                {itemCount}
              </span>
            )}
          </div>
          <button
            onClick={() => setIsOpen(false)}
            style={{ padding: '6px', borderRadius: '50%', border: 'none', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', color: '#7A7069' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Items */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px' }}>
          {items.length === 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: '16px', paddingBottom: '80px' }}>
              <ShoppingBag size={52} strokeWidth={1} style={{ color: '#C4BCB4' }} />
              <p style={{ color: '#7A7069', fontSize: '0.9rem', margin: 0 }}>Your cart is empty.</p>
              <button
                onClick={() => setIsOpen(false)}
                style={{ marginTop: '8px', padding: '10px 24px', border: '1px solid #B8882C', color: '#B8882C', backgroundColor: 'transparent', fontWeight: 600, fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer', transition: 'all 0.2s' }}
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {items.map((item: CartItem) => (
                <div key={item.id} style={{ display: 'flex', gap: '14px', backgroundColor: '#fff', padding: '14px', borderRadius: '4px', border: '1px solid rgba(13,13,13,0.06)' }}>

                  {/* Thumb */}
                  <div style={{ width: '70px', height: '84px', backgroundColor: '#E8E5DF', flexShrink: 0, borderRadius: '2px', overflow: 'hidden' }}>
                    {item.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : null}
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                      <div style={{ minWidth: 0 }}>
                        <h3 style={{ fontWeight: 700, fontSize: '0.85rem', color: '#0D0D0D', margin: '0 0 3px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {item.name}
                        </h3>
                        {/* Variant chips */}
                        <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
                          {item.size && (
                            <span style={{ fontSize: '0.65rem', fontWeight: 600, padding: '1px 7px', backgroundColor: 'rgba(184,136,44,0.1)', color: '#8C6518', borderRadius: '20px', border: '1px solid rgba(184,136,44,0.2)' }}>
                              {item.size}
                            </span>
                          )}
                          {item.color && (
                            <span style={{ fontSize: '0.65rem', fontWeight: 600, padding: '1px 7px', backgroundColor: 'rgba(13,13,13,0.06)', color: '#0D0D0D', borderRadius: '20px', border: '1px solid rgba(13,13,13,0.1)' }}>
                              {item.color}
                            </span>
                          )}
                        </div>
                        <p style={{ color: '#B8882C', fontWeight: 700, fontSize: '0.9rem', margin: '6px 0 0' }}>
                          {formatPrice(item.priceKobo)}
                        </p>
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        style={{ padding: '3px', border: 'none', background: 'transparent', cursor: 'pointer', color: '#C4BCB4', flexShrink: 0 }}
                      >
                        <X size={15} />
                      </button>
                    </div>

                    {/* Qty stepper */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0', border: '1px solid rgba(13,13,13,0.12)', borderRadius: '2px', width: 'fit-content', marginTop: '8px' }}>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                        style={{ padding: '5px 9px', border: 'none', background: 'transparent', cursor: item.quantity <= 1 ? 'not-allowed' : 'pointer', opacity: item.quantity <= 1 ? 0.3 : 1 }}
                      >
                        <Minus size={12} />
                      </button>
                      <span style={{ fontSize: '0.8rem', fontWeight: 700, width: '24px', textAlign: 'center', color: '#0D0D0D' }}>{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        style={{ padding: '5px 9px', border: 'none', background: 'transparent', cursor: 'pointer' }}
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div style={{ borderTop: '1px solid rgba(13,13,13,0.08)', padding: '20px 24px', backgroundColor: '#fff' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <span style={{ fontWeight: 600, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#7A7069' }}>Subtotal</span>
              <span style={{ fontWeight: 800, fontSize: '1.2rem', color: '#0D0D0D' }}>{formatPrice(subtotal)}</span>
            </div>
            <p style={{ fontSize: '0.7rem', color: '#7A7069', textAlign: 'center', margin: '0 0 14px' }}>
              Delivery fee confirmed after order.
            </p>
            <Link
              href="/checkout"
              onClick={() => setIsOpen(false)}
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%',
                padding: '1rem',
                backgroundColor: '#B8882C',
                color: '#fff',
                fontWeight: 700,
                fontSize: '0.8rem',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                textDecoration: 'none',
                borderRadius: '2px',
                transition: 'background-color 0.2s',
              }}
            >
              Checkout Securely — {formatPrice(subtotal)}
            </Link>
            <p style={{ textAlign: 'center', fontSize: '0.65rem', color: '#7A7069', marginTop: '10px' }}>
              Secured by Paystack
            </p>
          </div>
        )}
      </div>
    </>
  )
}
