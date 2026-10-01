'use client'

import { ShoppingCart, Heart } from 'lucide-react'
import { useCartStore } from '@/store/cart'
import { useWishlistStore } from '@/store/wishlist'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export function ProductCardActions({ product }: { product: any }) {
  const { addItem, setIsOpen } = useCartStore()
  const { toggleItem, hasItem } = useWishlistStore()
  const router = useRouter()
  
  // To prevent hydration mismatch with local storage, we wait until mounted to check status
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  
  const isLoved = mounted ? hasItem(product.id) : false
  const hasVariants = product.sizes?.length > 0 || product.colors?.length > 0

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    // If it has variants like sizes, send them to the product page to choose
    if (hasVariants) {
       router.push(`/shop/${product.slug}`)
       return
    }

    // Otherwise, fast-add to cart
    addItem({
      productId: product.id,
      name: product.name,
      priceKobo: product.price_kobo,
      quantity: 1,
      image: product.product_images?.find((img: any) => img.is_primary)?.url || product.product_images?.[0]?.url,
    })
    setIsOpen(true)
  }

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    toggleItem({
      productId: product.id,
      name: product.name,
      priceKobo: product.price_kobo,
      slug: product.slug,
      image: product.product_images?.find((img: any) => img.is_primary)?.url || product.product_images?.[0]?.url,
    })
  }

  return (
    <div className="absolute top-3 right-3 flex flex-col gap-2 z-10 opacity-100 lg:opacity-0 group-hover:opacity-100 transition-opacity duration-300">
      <button 
        onClick={handleWishlist}
        title={isLoved ? "Remove from Saved" : "Save for later"}
        className={`w-9 h-9 rounded-full bg-white/90 hover:bg-white flex items-center justify-center shadow-sm transition-all hover:scale-105 ${isLoved ? 'text-red-500' : 'text-[#0D0D0D]'}`}
      >
        <Heart size={18} fill={isLoved ? 'currentColor' : 'none'} />
      </button>
      <button 
        onClick={handleAddToCart}
        title="Add to Cart"
        className="w-9 h-9 rounded-full bg-[#B8882C]/90 hover:bg-[#B8882C] flex items-center justify-center text-white shadow-sm transition-all hover:scale-105"
      >
        <ShoppingCart size={18} />
      </button>
    </div>
  )
}
