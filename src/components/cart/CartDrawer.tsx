'use client'

import { useCartStore } from '@/store/cart'
import { X, Minus, Plus, ShoppingBag } from 'lucide-react'
import { formatPrice } from '@/lib/utils'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export function CartDrawer() {
  const { items, isOpen, setIsOpen, removeItem, updateQuantity } = useCartStore()
  const [mounted, setMounted] = useState(false)

  // Prevent hydration mismatch for persisted store
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const subtotal = items.reduce((total, item) => total + (item.priceKobo * item.quantity), 0)

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Drawer */}
      <div 
        className="fixed top-0 right-0 h-full w-full sm:w-[400px] bg-[#F5F4F0] z-50 shadow-2xl flex flex-col transition-transform duration-300 ease-in-out"
        style={{ transform: isOpen ? 'translateX(0)' : 'translateX(100%)' }}
      >
        <div className="flex items-center justify-between p-6 border-b border-black/10">
          <h2 className="font-display font-bold text-xl text-[#0D0D0D]">Your Cart</h2>
          <button 
            onClick={() => setIsOpen(false)}
            className="p-2 hover:bg-black/5 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-[#7A7069] gap-4">
              <ShoppingBag size={48} strokeWidth={1} opacity={0.5} />
              <p>Your cart is empty.</p>
              <button 
                onClick={() => setIsOpen(false)}
                className="mt-4 px-6 py-2 border border-[#B8882C] text-[#B8882C] text-sm font-semibold uppercase tracking-wider hover:bg-[#B8882C] hover:text-white transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            items.map(item => (
              <div key={item.id} className="flex gap-4">
                <div className="w-20 h-24 bg-[#E8E5DF] flex-shrink-0 flex items-center justify-center">
                  <span className="text-[10px] text-black/30 uppercase">No Img</span>
                </div>
                <div className="flex-1 flex flex-col justify-between py-1">
                  <div>
                    <div className="flex justify-between items-start gap-2">
                      <h3 className="font-bold text-[#0D0D0D] text-sm leading-tight">{item.name}</h3>
                      <button onClick={() => removeItem(item.id)} className="text-black/40 hover:text-red-500 transition-colors">
                        <X size={16} />
                      </button>
                    </div>
                    <p className="text-[#B8882C] font-semibold text-sm mt-1">{formatPrice(item.priceKobo)}</p>
                  </div>
                  <div className="flex items-center gap-3 border border-black/10 w-fit rounded-sm">
                    <button 
                      className="p-1.5 hover:bg-black/5 transition-colors disabled:opacity-50"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                    >
                      <Minus size={14} />
                    </button>
                    <span className="text-sm font-semibold w-4 text-center">{item.quantity}</span>
                    <button 
                      className="p-1.5 hover:bg-black/5 transition-colors"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-black/10 p-6 bg-white">
            <div className="flex justify-between items-center mb-6 text-[#0D0D0D]">
              <span className="font-semibold text-sm uppercase tracking-wider">Subtotal</span>
              <span className="font-bold text-lg">{formatPrice(subtotal)}</span>
            </div>
            <p className="text-xs text-[#7A7069] mb-4 text-center">Shipping & taxes calculated at checkout.</p>
            <Link 
              href="/checkout"
              onClick={() => setIsOpen(false)}
              className="flex justify-center items-center w-full bg-[#B8882C] hover:bg-[#D4A84B] text-white py-4 font-bold text-sm uppercase tracking-widest transition-colors"
            >
              Checkout Securely
            </Link>
          </div>
        )}
      </div>
    </>
  )
}
