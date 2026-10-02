'use client'
import { useState, useEffect } from 'react'
import { Heart, ShoppingCart } from 'lucide-react'
import { useCartStore } from '@/store/cart'
import { toggleWishlist } from '@/app/actions/wishlist'
import { useRouter } from 'next/navigation'

interface ProductCardActionsProps {
  product: {
    id: string
    name: string
    slug: string
    price_kobo: number
    product_images?: { url: string; is_primary?: boolean }[]
    sizes?: string[]
    colors?: string[]
  }
}

export function ProductCardActions({ product }: ProductCardActionsProps) {
  const { addItem, setIsOpen } = useCartStore()
  const [wishlisted, setWishlisted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    fetch(`/api/wishlist/check?productId=${product.id}`)
      .then(r => r.json())
      .then(d => setWishlisted(d.wishlisted))
      .catch(() => {})
  }, [product.id])

  const handleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (isLoading) return
    setIsLoading(true)
    setWishlisted(prev => !prev) // optimistic
    const result = await toggleWishlist(product.id)
    if (!result.success) {
      setWishlisted(prev => !prev) // revert on error
      router.push('/sign-in')
    }
    setIsLoading(false)
  }

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    const hasVariants = (product.sizes?.length ?? 0) > 0 || (product.colors?.length ?? 0) > 0
    if (hasVariants) {
      router.push(`/shop/${product.slug}`)
      return
    }

    const primaryImage =
      product.product_images?.find(i => i.is_primary) || product.product_images?.[0]
    addItem({
      productId: product.id,
      name: product.name,
      priceKobo: product.price_kobo,
      quantity: 1,
      image: primaryImage?.url || '',
    })
    setIsOpen(true)
  }

  return (
    <div className="absolute top-3 right-3 flex flex-col gap-2 z-10 opacity-100 transition-opacity duration-300">
      <button
        onClick={handleWishlist}
        title={wishlisted ? 'Remove from Saved' : 'Save for later'}
        className={`w-9 h-9 rounded-full bg-white/90 hover:bg-white flex items-center justify-center shadow-sm transition-all hover:scale-105 ${wishlisted ? 'text-red-500' : 'text-[#0D0D0D]'}`}
      >
        <Heart size={18} fill={wishlisted ? 'currentColor' : 'none'} />
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
