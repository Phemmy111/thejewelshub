'use client'

import { useWishlistStore } from '@/store/wishlist'
import { useCartStore } from '@/store/cart'
import { formatPrice } from '@/lib/utils'
import Link from 'next/link'
import Image from 'next/image'
import { Heart, ShoppingCart, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function WishlistPage() {
  const { items, toggleItem, clearWishlist } = useWishlistStore()
  const { addItem, setIsOpen } = useCartStore()
  
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  if (!mounted) return null // prevent hydration mismatch

  return (
    <div className="bg-[#F5F4F0] min-h-screen py-20 px-5 sm:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4">
          <div>
            <h1 className="text-4xl font-display font-bold text-[#0D0D0D] tracking-tight">Saved for Later</h1>
            <p className="text-[#7A7069] mt-2">Your personal collection of loved pieces ({items.length} items)</p>
          </div>
          {items.length > 0 && (
            <button 
              onClick={clearWishlist}
              className="text-sm font-semibold text-red-500 hover:text-red-700 transition"
            >
              Clear All Saved Items
            </button>
          )}
        </div>

        {items.length === 0 ? (
          <div className="bg-white p-16 rounded-xl border border-[rgba(13,13,13,0.06)] text-center flex flex-col items-center">
            <Heart size={48} className="text-[#E8E5DF] mb-4" />
            <h2 className="text-2xl font-display font-bold text-[#0D0D0D] mb-3">No saved pieces yet</h2>
            <p className="text-[#7A7069] mb-8 max-w-md mx-auto">
              Tap the heart icon on any product to save it here for later. Build your dream jewelry collection!
            </p>
            <Link 
              href="/shop"
              className="bg-[#B8882C] hover:bg-[#A67A28] text-white px-8 py-3 rounded-full font-semibold transition"
            >
              Explore the Shop
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {items.map((item) => (
              <div key={item.productId} className="bg-white rounded-lg overflow-hidden border border-[rgba(13,13,13,0.06)] group transition-shadow hover:shadow-lg flex flex-col">
                <Link href={`/shop/${item.slug}`} className="block relative aspect-[4/5] bg-[#F5F4F0] overflow-hidden">
                  {item.image ? (
                    <img 
                      src={item.image} 
                      alt={item.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[#7A7069] text-xs uppercase tracking-wider">No Image</div>
                  )}
                </Link>
                <div className="p-5 flex flex-col flex-1 justify-between">
                  <div>
                    <h3 className="font-display font-bold text-[#0D0D0D] text-lg leading-snug mb-1">{item.name}</h3>
                    <p className="text-[#7A7069] font-medium">{formatPrice(item.priceKobo)}</p>
                  </div>
                  
                  <div className="flex gap-2 mt-5">
                    <button 
                      onClick={() => {
                        addItem({
                          productId: item.productId,
                          name: item.name,
                          priceKobo: item.priceKobo,
                          quantity: 1,
                          image: item.image
                        })
                        setIsOpen(true)
                      }}
                      className="flex-1 bg-[#0D0D0D] hover:bg-black text-white py-2.5 rounded-md font-semibold text-sm flex items-center justify-center gap-2 transition"
                    >
                      <ShoppingCart size={16} /> Add
                    </button>
                    <button 
                      onClick={() => toggleItem(item)}
                      className="w-10 h-10 border border-[#E8E5DF] hover:border-red-200 hover:bg-red-50 text-[#7A7069] hover:text-red-500 rounded-md flex items-center justify-center transition"
                      title="Remove from saved"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
